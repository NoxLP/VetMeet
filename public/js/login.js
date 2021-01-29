import { api, goToApp } from "./helpers/helpers.js";

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
        alert('Email or Password Wrong!')
      }
    })
    .catch(err => {
      alert('Email or Password Wrong!')
    });
}
function passwordInputOnKeyUp(e) {
  if (e.key === 'Enter')
    document.getElementById('loginButton').click()
}

window.onload = () => {
  document.getElementById('loginButton').addEventListener('click', loginButtonOnClick)
  document.getElementById('loginPassword').addEventListener('keyup', passwordInputOnKeyUp)
}