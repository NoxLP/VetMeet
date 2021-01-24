import { api, goToHome } from "./helpers/helpers.js";

api.defaults.headers.common['token'] = localStorage.getItem('token')

async function fillClinicFile() {
  let clinicData;
  console.log('getting clinic me')
  try {
    clinicData = (await api.get('/clinics/me')).data
  } catch (err) {
    //TODO => go to a page where the error get shown and explained
    console.log(err)
    //goToHome()
  }

  document.getElementById('myClinicName').value = clinicData.name
  document.getElementById('myClinicAddress').value = clinicData.address
  document.getElementById('myClinicEmail').value = clinicData.email
  document.getElementById('myClinicTelephone').value = clinicData.telephone
  document.getElementById('myClinicContactPerson').value = clinicData.contactPerson || ''
}

//#region event callbacks
const signOut = () => {
  localStorage.removeItem('name')
  localStorage.removeItem('email')
  localStorage.removeItem('token')
  goToHome()
}
//#endregion

window.onload = function () {
  const signOutButton = document.getElementById('signOutMobile')
  const clinicNameText = document.getElementById('clinicNameCardText')

  signOutButton.classList.remove('invisible')
  signOutButton.addEventListener('click', signOut)

  clinicNameText.innerText = localStorage.getItem('name')

  fillClinicFile()
}