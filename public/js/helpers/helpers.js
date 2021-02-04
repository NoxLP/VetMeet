export const BASE_URL = 'http://localhost:3000/api'
export const APP_URL = './citas-app.html'
export const api = axios.create({
  baseURL: BASE_URL,
  timeout: 3000
});

export const MEETINGS_FILTER_CARDS_HTML = [
  'row container-fluid card shadow-sm px-0 py-2 me-3 g-0 flex-nowrap overflow-hidden',
  '180px'
]

export const goToApp = () => { window.location = APP_URL }
export const goToHome = () => { window.location = './index.html' }
export const pad = (str, minLength = 2, endStart = 'start', char = '0') => {
  if (str.length >= minLength)
    return str

  return endStart === 'start' ?
    char.repeat(minLength - str.length) + str :
    str + char.repeat(minLength - str.length)
}
export const getFormattedDateString = date => `${pad(date.getDate().toString())}/${pad((date.getMonth() + 1).toString())}/${date.getFullYear()}`
export const getFormattedTimeString = date => `${pad(date.getHours().toString())}:${pad(date.getMinutes().toString())}`
export const getMobileConfirmedString = meeting => meeting.confirmed ? 'Conf.' : 'No conf.'
export const getMobileCompletedString = meeting => meeting.completed ? 'Comp.' : 'No comp.'
/**
 * WARNING: it just do if(!value), if one want to set the input value to false, it won't work
 */
export const setInputValueIfNotFalsie = (input, newValue, propertyToSet = 'value') => {
  if (!newValue)
    return
  input[propertyToSet] = newValue
}

const INTERCEPT_AXIOS = false

if (INTERCEPT_AXIOS) {
  api.interceptors.request.use(request => {
    console.log('Starting Request', JSON.stringify(request, null, 2))
    return request
  })

  api.interceptors.response.use(response => {
    console.log('Received response:', JSON.stringify(response, null, 2))
    return response
  })
}