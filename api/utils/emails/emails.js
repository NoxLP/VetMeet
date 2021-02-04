const fs = require('fs')

const emailsBodies = {
  meetCreation: fs.readFileSync('api/utils/emails/meetCreationEmailTemplate.html', 'utf8')
}
const getReplaceCharsObject = (meeting, clinic, patient) => {
  const meetingDate = new Date(meeting.date)

  return {
    '&created': (new Date(meeting.createdAt)).toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' }),
    '&clinic': clinic.name,
    '&date': meetingDate.toLocaleDateString('es-ES', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }),
    '&time': meetingDate.toLocaleTimeString('es-ES', {
      hour: '2-digit',
      minute:'2-digit'
    }),
    '&patient': patient.name,
    '&disease': meeting.disease,
    '&myWeb': 'estoesunaprueba.com',
    '&addressSelf': process.env.SELF_ADDRESS
  }
}
const getReplaceRegex = replaceObject => {
  console.log(Object.keys(replaceObject).reduce((acc, key) => {
    return acc = `${acc}${(acc !== '' ? '|' : '')}(${key})`
  }, ''))
  return new RegExp(
    Object.keys(replaceObject).reduce((acc, key) => {
      return acc = `${acc}${(acc !== '' ? '|' : '')}(${key})`
    }, ''), 
    'ig')
}
const buildEmailBody = (body, meeting, clinic, patient) => {
  const replaceObject = getReplaceCharsObject(meeting, clinic, patient)
  console.log('rep obj: ', replaceObject)
  const regex = getReplaceRegex(replaceObject)
  return body.replace(regex, m => replaceObject[m])
}

module.exports = {
  emailsBodies,
  buildEmailBody
}