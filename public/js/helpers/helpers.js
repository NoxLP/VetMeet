export const BASE_URL = 'https://vet-meet.herokuapp.com/api'//'http://localhost:3000/api'
export const APP_URL = '../../citas-app.html'
export const api = axios.create({
  baseURL: BASE_URL,
  timeout: 3000
});

export const MEETINGS_FILTER_CARDS_HTML = [
  'row container-fluid card shadow-sm px-0 py-2 me-3 mb-2 g-0 flex-nowrap overflow-hidden',
  '180px'
]

export const goToApp = () => { window.location = APP_URL }
export const goToHome = () => {
  console.log('HOME')
  window.location = '../../index.html'
}
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
export const getMobileDoneString = meeting => meeting.done ? 'Comp.' : 'No comp.'
/**
 * WARNING: it just do if(!value), if one want to set the input value to false, it won't work
 */
export const setInputValueIfNotFalsie = (input, newValue, propertyToSet = 'value') => {
  if (!newValue)
    return
  input[propertyToSet] = newValue
}
export const showAlert = (message, success, title) => {
  console.log('showalert')
  let alert 
  if (success) {
    alert = document.getElementById('myToast')
    alert.classList.remove('d-none')
    alert.classList.add('show')
    document.getElementById('toastTitle').innerText = title
    document.getElementsByClassName('toast-body')[0].innerHTML = message;
  } else {
    alert = document.createElement('div')
    alert.classList.add('d-none','fade','show','fixed-top', 'bg-white')
    alert.setAttribute('role', 'alert')
    alert.innerHTML = `${message}
    <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>`
    alert.classList.add('alert', 'alert-danger')
  }

  document.getElementById('alertsContainer').appendChild(alert)
  alert.classList.remove('d-none')
}
export const askForConfirmation = (message, title, acceptCallback) => {
  let toast = document.getElementById('confirmationToast')
  toast.classList.remove('d-none')
  toast.classList.add('show')
  document.getElementById('confToastTitle').innerText = title
  document.getElementById('confToastText').innerText = message
  document.getElementById('confToastAcceptB').addEventListener('click', acceptCallback)
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