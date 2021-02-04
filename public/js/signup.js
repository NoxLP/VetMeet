import { api, goToApp } from "./helpers/helpers.js";

const getClinicFromInputs = () => {
  const clinic = {
    name: document.getElementById('nameInput').value,
    address: document.getElementById('addressInput').value,
    telephone: document.getElementById('telephoneInput').value,
    email: document.getElementById('signupEmail').value,
    password: document.getElementById('signupPassword').value
  }
  const contactPerson = document.getElementById('contactPInput').value
  if(contactPerson) { clinic['contactPerson'] = contactPerson }
  return clinic
}
document.getElementById('signupButton').addEventListener('click', e => {
  const clinic = getClinicFromInputs()
  
  api.post('/auth/clinics/signup', clinic)
    .then(res => {
      localStorage.setItem('token', res.data.token)
      localStorage.setItem('name', res.data.name)
      localStorage.setItem('email', res.data.email)
      goToApp()
    })
    .catch(err => {
      //TODO: store the real error somewhere
      showAlert(
        'Este usuario ya está registrado. Puede loguearse usando este usuario o introducir datos para un nuevo usuario.',
        false)
    })
})