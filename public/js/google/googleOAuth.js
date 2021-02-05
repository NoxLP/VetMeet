//import { api, goToApp } from "../helpers/helpers.js";
const BASE_URL = 'http://localhost:3000/api'
const api = axios.create({
  baseURL: BASE_URL,
  timeout: 3000
});

const showAlert = (message, success, title) => {
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
function onSuccess(googleUser) {
  let profile = googleUser.getBasicProfile()
  console.log('Logged in as: ' + profile.getName());
  let token = googleUser.getAuthResponse().id_token;
  console.log(token)
  api.post(
    '/auth/clinics/googleLogin', 
    { token: token, email: profile.getEmail(), name: profile.getName()})
    .then(res => {
      localStorage.setItem('token', res.data.token)
      localStorage.setItem('name', res.data.name)
      localStorage.setItem('email', res.data.email)
      localStorage.setItem('googleSign', true)

      let button = document.getElementById('goToAppButton')
      button.classList.add('show')
      button.classList.remove('collapse')
    })
    .catch(err => {
      //TODO: store the real error somewhere
      showAlert(
        'No se pudo loguear con google. Inténtelo de nuevo o contacte con nosotros.',
        false)
    })
}
function onFailure(error) {
  console.log(error);
}
function googleSignOut() {
  console.log('googleSignOut')
  if(!localStorage.getItem('googleSign'))
    return

  var auth2 = gapi.auth2.getAuthInstance();
  auth2.signOut().then(function () {
    console.log('User signed out.');
  });
  localStorage.clear()
  window.location = './index.html'
}
function renderButton() {
  gapi.signin2.render('my-signin2', {
    'scope': 'profile email https://www.googleapis.com/auth/calendar https://www.googleapis.com/auth/calendar.events',
    'width': 240,
    'height': 50,
    'longtitle': true,
    'theme': 'light',
    'onsuccess': onSuccess,
    'onfailure': onFailure
  });
}
function goToApp() {
  console.log('gotoapp')
  window.location = '../../citas-app.html'
}

window.addEventListener('load', () => {
  document.getElementById('signOutMobile').addEventListener('click', googleSignOut)
  if(window.location.pathname === '/citas-login.html')
    document.getElementById('goToAppButton').addEventListener('click', goToApp)
})