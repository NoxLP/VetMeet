import { api, goToApp } from "./helpers/helpers.js";

document.getElementById('signupButton').addEventListener('click', e => {
  const clinic = {
    name: document.getElementById('nameInput').value,
    address: document.getElementById('addressInput').value,
    telephone: document.getElementById('telephoneInput').value,
    email: document.getElementById('signupEmail').value,
    password: document.getElementById('signupPassword').value
  }
  const contactPerson = document.getElementById('contactPInput').value
  if(contactPerson) { clinic['contactPerson'] = contactPerson }
  
  Helpers.api.post('/auth/clinics/signup', clinic)
    .then(res => {
      localStorage.setItem('token', res.data.token)
      localStorage.setItem('email', res.data.email)
      Helpers.goToApp()
    })
    .catch(err => {
      alert('User Already registered!')
    })
})