//import { api, goToApp } from "../helpers/helpers.js";
const BASE_URL = 'http://localhost:3000/api'
const api = axios.create({
  baseURL: BASE_URL,
  timeout: 3000
});

function onSuccess(googleUser) {
  let profile = googleUser.getBasicProfile()
  console.log('Logged in as: ' + profile.getName());
  let token = googleUser.getAuthResponse().id_token;
  console.log(token)
  api.post('/auth/clinics/googleLogin', { token: token, email: profile.getEmail(), name: profile.getName()})
    .then(res => {
      localStorage.setItem('token', res.data.token)
      localStorage.setItem('name', res.data.name)
      localStorage.setItem('email', res.data.email)
      localStorage.setItem('googleSign', true)
      //window.location = './citas-app.html'
    })
    .catch(err => {
      console.log(err)
      //TODO: bootstrap alert
      alert('No se pudo loguear con google')
    })

  /*var xhr = new XMLHttpRequest();
  xhr.open('POST', `${BASE_URL}/auth/clinics/googleLogin`);
  xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
  xhr.onload = function() {
    console.log('Signed in as: ' + xhr.responseText);
  };
  xhr.send('idtoken=' + token);*/
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

window.onload = async function () {
  document.getElementById('signOutMobile').addEventListener('click', googleSignOut)
}