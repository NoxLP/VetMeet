const meetingsModel = require('../models/meetings.model')
const clinicsModel = require('../models/clinics.model')
const patientsModel = require('../models/patients.model')
const {
  emailBodies,
  getReplaceCharsObject
} = require('../utils/emails/emails')
const { handleError } = require('../utils')

//*************** GOOGLE
// Google service account stuff
/*const {google} = require('googleapis');

const auth = new google.auth.GoogleAuth({
  keyFile: './api/google/quickstart-1612011346735-98102625f06a.json',
  scopes: [
    'https://www.googleapis.com/auth/calendar',
    'https://www.googleapis.com/auth/calendar.events'
  ],
});

//google calendar
const calendar = google.calendar({
  version: 'v3',
  auth: auth
});*/
const send = require('gmail-send')({
  user: process.env.GMAIL_ACCOUNT,
  pass: process.env.GMAIL_PWD,
  to: '...'
})
//***************

module.exports = {
  getDateDTOs,
  getFilterDTOs,
  getMeeting,
  updateMeeting,
  createMeeting,
  deleteMeeting
}

const FIRST_HOUR = 9
const LAST_HOUR = 20

//#region helpers
const getPatientsMeetingsPopulatedFromQuery = async (req, clinic, queryHasName) => {
  const patientQuery = { clinics: clinic._id }
  if (queryHasName) {
    patientQuery['name'] = { '$regex': req.query.name, '$options': 'i' }
  } else {
    patientQuery['species'] = { '$regex': req.query.species, '$options': 'i' }
  }

  const data = await Promise.all([
    patientsModel.find(patientQuery, { name: 1, species: 1, _id: 0 })
      .populate({ path: 'meetings' }),
    patientsModel.find(patientQuery, { name: 1, species: 1, _id: 0 })
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
  const [allPatients, limitedPatients] = data

  return [
    allPatients.reduce((acc, patient) => acc + patient.meetings.length, 0),
    limitedPatients
  ]
}
const parseLocaleDate = str => {
  let split = decodeURIComponent(str).split(/[\/\:\.]/g)
  if (split.length !== 3)
    return null

  return new Date(parseInt(split[2]), parseInt(split[1]) - 1, parseInt(split[0]))
}
const getMeetingsQuery = query => {
  let meetingQuery = {}
  for (let paramName in query) {
    if (paramName === 'limit' || paramName === 'page')
      continue

    if (paramName === 'date') {
      let parsedDate = parseLocaleDate(query['date'])
      if (isNaN(parsedDate))
        return null

      let nextDay = new Date(parsedDate)
      nextDay.setDate(nextDay.getDate() + 1)
      meetingQuery['date'] = {
        $gte: parsedDate,
        $lt: nextDay
      }
    } else {
      meetingQuery[paramName] = { '$regex': query[paramName], '$options': 'i' }
    }
  }

  return meetingQuery
}
const getMeetingsFromQuery = async (req, clinic) => {
  const meetingQuery = getMeetingsQuery(req.query)
  if (!meetingQuery)
    return null
    
  meetingQuery['clinic'] = clinic._id
  console.log(meetingQuery)

  const data = await Promise.all([
    await meetingsModel.find(meetingQuery).count(),
    await meetingsModel.find(meetingQuery)
      .populate({ path: 'patient', select: 'name species' })
      .limit(req.query.limit)
      .skip(req.query.limit * req.query.page)
      .sort({ date: 1 })
  ])
  const [meetingsCount, limitedMeetings] = data

  return [meetingsCount, limitedMeetings]
}
const mapMeetingsFilterDTOsFromPopulatedPatients = patients => {
  return patients
    .reduce((acc, patient) => {
      acc = acc.concat(patient.meetings.map(m => {
        return {
          _id: m._id,
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
const createGoogleCalendarEvent = async (meeting, clinic) => {
  //calendar.calendarList.get('primary')
  const meetingDatePlusHalfHour = new Date(meeting.date)
  meetingDatePlusHalfHour.setMinutes(meetingDatePlusHalfHour.getMinutes() + 29)

  const description = `Cita concertada con ${meeting.patient.name} (${meeting.patient.species}) por ${clinic.name}.
   - ${(meeting.confirmed ? 'Cita confirmada' : 'Pendiente de confirmación')}
   - Patología observada: ${meeting.disease}
   - Historial del paciente: ${meeting.patient.history}
   - Notas de la cita: ${meeting.notes}`

  const event = {
    summary: `Cita oftalmología con ${meeting.patient.name} en ${clinic.name}`,
    location: clinic.address,
    description: description,
    start: { dateTime: meeting.date },
    end: { dateTime: meetingDatePlusHalfHour },
    attendees: [ { email: clinic.email } ],
    reminders: { useDefault: true },
    status: 'tentative',
    organizer: { self: true }
  }

  try {
    await calendar.events.insert({
      calendarId: 'primary',
      maxAttendees: 2,
      requestBody: event,
      sendUpdates: 'all',
      supportAttachments: true
    })
    return true
  } catch(err) {
    console.log(err)
    return false
  }
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
    const queryHasName = req.query.hasOwnProperty('name')
    const queryHasSpecies = req.query.hasOwnProperty('species')
    let meetings = [];

    if (queryHasName || queryHasSpecies) {
      const patients = await getPatientsMeetingsPopulatedFromQuery(req, clinic, queryHasName)

      if (!patients[0] === 0) {
        res.status(404).send('No meetings found')
        return
      }

      meetings.push(patients[0])
      meetings.push(mapMeetingsFilterDTOsFromPopulatedPatients(patients[1]))
    } else {
      meetings = await getMeetingsFromQuery(req, clinic)

      if (!meetings || meetings[0] === 0) {
        res.status(200).send('No meetings found')
        return
      }

      meetings[1] = mapMeetingsFilterDTOs(meetings[1])
    }

    res.status(200).json(meetings)
  } catch (err) {
    console.log(err)
    res.status(400).json(err)
  }
}

function getMeeting(req, res) {
  console.log('getMeeting')
  meetingsModel.findById(req.params.meetingId)
    .populate('patient')
    .then(response => {
      console.log('ok')
      res.status(200).json(response)
    })
    .catch(err => {
      console.log(err)
      res.status(404).json(err)
    })
}

async function updateMeeting(req, res) {
  try {
    let updatedMeeting = await meetingsModel
      .findByIdAndUpdate(req.params.meetingId, req.body.meeting, { new: true })
      .populate('patient')

    if(req.body.patient) {
      for(let fieldName in req.body.patient) {
        console.log()
        updatedMeeting.patient[fieldName] = req.body.patient[fieldName]
      }

      await updatedMeeting.patient.save()
    }

    res.status(200).json(updatedMeeting)
  } catch (err) {
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

    let meetingData = { date, disease }
    meetingData['clinic'] = clinic._id
    meetingData['patient'] = patient._id
    let meeting = await meetingsModel.create(meetingData)

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

    //await createGoogleCalendarEvent(meeting, clinic)
      
    
    emailBody.replace()

    await send({
      to: clinic.email,
      subject: 'Su cita pendiente de confirmar con veterinaria oftalmología [no responder a este mensaje]',
      html: emailBodies.meetCreation
    })

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