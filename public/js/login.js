import { api, goToApp, showAlert } from "./helpers/helpers.js";

function loginButtonOnClick() {
  api.post('/auth/clinics/login', {
    email: document.getElementById('loginEmail').value,
    password: document.getElementById('loginPassword').value
  })
    .then(res => {
      if (res.data && res.data.token) {
        localStorage.setItem('token', res.data.token)
        localStorage.setItem('name', res.data.name)
        localStorage.setItem('email', res.data.email)
        goToApp()
      } else {
        //TODO: store the real error somewhere
        showAlert(
          'Su contraseña o su dirección de correo electrónico es erróneo. Inténtelo de nuevo',
          false)
      }
    })
    .catch(err => {
      //TODO: store the real error somewhere
      showAlert(
        'Su contraseña o su dirección de correo electrónico es erróneo. Inténtelo de nuevo',
        false)
    });
}
function passwordInputOnKeyUp(e) {
  if (e.key === 'Enter')
    document.getElementById('loginButton').click()
}

window.addEventListener('load', () => {
  if(localStorage.getItem('email')) {
    document.getElementById('loginEmail').value = localStorage.getItem('email')
  }

  document.getElementById('loginButton').addEventListener('click', loginButtonOnClick)
  //document.getElementById('loginPassword').addEventListener('keyup', passwordInputOnKeyUp)
})