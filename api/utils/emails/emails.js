const fs = require('fs')

const emailsBodies = {
  meetCreation: fs.readFileSync('./meetCreationEmailTemplate.html', 'utf8')
}
const getReplaceCharsObject = (meeting, clinic, patient) => {
  const meetingDate = new Date(meeting.date)

  return {
    '$created': (new Date(meeting.createdAt)).toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' }),
    '$clinic': clinic.name,
    '$date': meetingDate.toLocaleDateString('es-ES', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }),
    '$time': meetingDate.toLocaleTimeString(),
    '$patient': patient.name,
    '$disease': meeting.disease,
    '$addressSelf': process.env.SELF_ADDRESS
  }
}
const getReplaceRegex = replaceObject => {
  return Object.keys(replaceObject).reduce(key => {
    
  })
}

module.exports = {
  emailsBodies,
  getReplaceCharsObject
}