const meetingsModel = require('../models/meetings.model')
const clinicsModel = require('../models/clinics.model')
const patientsModel = require('../models/patients.model')
const { handleError } = require('../utils')

module.exports = {
  getDateDTOs,
  getFilterDTOs,
  createMeeting,
  deleteMeeting
}

//#region helpers
const getPatientsMeetingsPopulatedFromQuery = async (req, clinic, queryHasName) => {
  const patientQuery = { clinics: clinic._id }
  if(queryHasName) patientQuery['name'] = req.query.name
  else patientQuery['species'] = req.query.species
  
  const data = await Promise.all([
    patientsModel.find(patientQuery, {name: 1, species: 1, _id: 0})
      .populate({
        path: 'meetings',
        select: 'date disease surgery confirmed done'
      }),
    patientsModel.find(patientQuery, {name: 1, species: 1, _id: 0})
      .populate({
        path: 'meetings',
        select: 'date disease surgery confirmed done',
        options: { 
          limit: req.query.limit,
          skip: req.query.limit * req.query.page,
          sort: { date: 1 }
        }
      })
  ])
  const [ allPatients, limitedPatients ] = data

  return [ 
    allPatients.reduce((acc, patient) => acc + patient.meetings.length, 0),
    limitedPatients
  ]
}
const getMeetingsQuery = query => {
  let meetingQuery = {}
  for(let paramName in query) {
    if(paramName === 'limit' || paramName === 'page')
      continue
      
    meetingQuery[paramName] = query[paramName]
  }

  return meetingQuery
}
const getMeetingsFromQuery = async (req, clinic) => {
  const meetingQuery = getMeetingsQuery(req.query)
  meetingQuery['clinic'] = clinic._id
  
  const data = await Promise.all([
    await meetingsModel.find(meetingQuery).count(),
    await meetingsModel.find(meetingQuery)
      .populate({ path: 'patient', select: 'name species' })
      .limit(req.query.limit)
      .skip(req.query.limit * req.query.page)
      .sort({ date: 1 })
  ])
  const [ meetingsCount, limitedMeetings ] = data
  console.log('lim meets: ', limitedMeetings)

  return [ meetingsCount, limitedMeetings ]
}
const mapMeetingsFilterDTOsFromPopulatedPatients = patients => {
  console.log(patients[0].meetings)
  return patients
    .reduce((acc, patient) => {
      acc = acc.concat(patient.meetings.map(m => {
        return {
          name: patient.name,
          species: patient.species,
          date: m.date,
          disease: m.disease,
          surgery: m.surgery,
          confirmed: m.confirmed,
          done: m.done
        }
      }))
      return acc
    }, [])
}
const mapMeetingsFilterDTOs = meetings => {
  console.log('map meets: ', meetings)
  return meetings
    .map(m => {
      return {
        _id: m._id,
        date: m.date,
        disease: m.disease,
        surgery: m.surgery,
        confirmed: m.confirmed,
        done: m.done,
        name: m.patient.name,
        specied: m.patient.species
      }
    })
}
//#endregion

function getDateDTOs(req, res) {
  console.log('getDateDTOs')

  meetingsModel.find({}, { date: 1, _id: 0 })
    .limit(req.query.limit)
    .skip(req.query.page * req.query.limit)
    .then(response => {
      console.log('ok')
      res.status(200).json(response)
    })
    .catch(err => {
      console.log(err)
      res.status(400).json(err)
    })
}

async function getFilterDTOs(req, res) {
  console.log('getFilterDTOs')
  req.query.limit = parseInt(req.query.limit)
  req.query.page = parseInt(req.query.page)
  try {
    const clinic = await clinicsModel.findOne({ email: res.locals.clinic.email })
    console.log('Clinic:', clinic)
    const queryHasName = req.query.hasOwnProperty('name')
    const queryHasSpecies = req.query.hasOwnProperty('species')
    let meetings = [];

    if( queryHasName || queryHasSpecies ) {
      const patients = await getPatientsMeetingsPopulatedFromQuery(req, clinic, queryHasName)

      if(!patients[0] === 0) {
        res.status(404).send('No meetings found')
        return
      }
      
      meetings.push(patients[0])
      meetings.push(mapMeetingsFilterDTOsFromPopulatedPatients(patients[1]))
    } else {
      meetings = await getMeetingsFromQuery(req, clinic)

      if(!meetings[0] === 0) {
        res.status(404).send('No meetings found')
        return
      }

      meetings[1] = mapMeetingsFilterDTOs(meetings[1])
    }

    res.status(200).json(meetings)
  } catch(err) {
    console.log(err)
    res.status(400).json(err)
  }
}

async function createMeeting(req, res) {
  console.log('createMeeting')

  try {
    let { name, patientId, species, history, date, disease } = req.body

    let data = await Promise.all([
      clinicsModel.findOne({ email: res.locals.clinic.email }),
      patientId ? 
        patientsModel.findById(patientId) :
        patientsModel.create({ name, species, history })
    ])
    let [clinic, patient] = data
    console.log(clinic, patient)

    let meetingData = { date, disease }
    meetingData['clinic'] = clinic._id
    meetingData['patient'] = patient._id
    let meeting = await meetingsModel.create(meetingData)
    console.log(meeting)

    if (!patientId) {
      clinic.patients.push(patient._id)
      patient.clinics.push(clinic._id)

      patient.meetings.push(meeting._id)
      clinic.meetings.push(meeting._id)

      await Promise.all([clinic.save(), patient.save()])
    } else {
      if (patient.name !== name) patient.name = name
      if (patient.species !== species) patient.species = species
      if (patient.history !== history) patient.history = history
      if (!clinic.patients.includes(patient._id)) clinic.patients.push(patient._id)

      clinic.meetings.push(meeting._id)
      patient.meetings.push(meeting._id)

      await Promise.all([clinic.save(), patient.save()])
    }

    res.status(200).json(meeting)
  } catch (err) {
    console.log(err)
    res.status(400).json(err)
  }
}

async function deleteMeeting(req, res) {
  console.log('deleteMeeting')

  try {
    let data = await Promise.all([
      meetingsModel.findById(req.params.meetingId),
      clinicsModel.findOne({ email: res.locals.clinic.email })
    ])
    let [meeting, clinic] = data
    
    let patient = await patientsModel.findById(meeting.patient)
    let removeMeeting = meetingsModel.findByIdAndRemove(req.params.meetingId)
    
    clinic.meetings.splice(clinic.meetings.findIndex(x => x === req.params.meetingId), 1)
    patient.meetings.splice(patient.meetings.findIndex(x => x === req.params.meetingId), 1)
    await Promise.all([clinic.save(), patient.save()])

    //Hay que esperar a que guarde primero los cambios en patient y en clinic, por que findByIdAndRemove no solo borra el objeto de la base de datos, también de la 
    //instancia del modelo que se usa aquí, y como a ambos se les está añadiendo la id de meeting, si se borra la instancia el bojeto ya no existe y no puede recoger la id
    await removeMeeting

    res.status(200).json(meeting)
  } catch (err) {
    console.log(err)
    res.status(400).json(err)
  }
}