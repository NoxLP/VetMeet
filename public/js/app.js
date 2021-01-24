import { api, goToHome } from "./helpers/helpers.js";

api.defaults.headers.common['token'] = localStorage.getItem('token')

const clinicData = {}

//#region helpers
const fillClinicNameCard = name => {
  const clinicNameText = document.getElementById('clinicNameCardText')
  clinicNameText.innerText = name
  if(localStorage.getItem('name') !== name)
    localStorage.setItem('name', name)
}
const fillClinicFile = myClinicInputs => {
  console.log('fillClinicFile: ', clinicData)
  myClinicInputs.myClinicName.value = clinicData.name
  myClinicInputs.myClinicAddress.value = clinicData.address
  myClinicInputs.myClinicEmail.value = clinicData.email
  myClinicInputs.myClinicTelephone.value = clinicData.telephone
  myClinicInputs.myClinicContactPerson.value = clinicData.contactPerson || ''
}
const updateField = (input, fieldName) => {
  console.log('updateField')
  api.put('/clinics/me', { [fieldName]: input.value })
    .then(response => {
      clinicData[fieldName] = input.value
      if(fieldName === 'name')
        fillClinicNameCard(input.value)
    })
    .catch(err => {
      alert(`No se pudo actualizar el campo: ${input.placeholder}`)
      input.value = clinicData[fieldName]
    })
}
const getBDFieldNameByInputId = inputId => {
  let fieldName
  switch (inputId) {
    case 'myClinicName':
      fieldName = 'name'
      break
    case 'myClinicAddress':
      fieldName = 'address'
      break
    case 'myClinicEmail':
      fieldName = 'email'
      break
    case 'myClinicTelephone':
      fieldName = 'telephone'
      break
    case 'myClinicContactPerson':
      fieldName = 'contactPerson'
      break
  }
  return fieldName
}
//#endregion

//#region event callbacks
function signOut() {
  localStorage.clear()
  goToHome()
}
function updateFieldIfNecessary(e, clinicInputs) {
  //console.log(e)
  let fieldName = getBDFieldNameByInputId(e.target.id)
  let input = clinicInputs[e.target.id]
  let data = typeof clinicData[fieldName] === 'string' ? clinicData[fieldName] : clinicData[fieldName].toString()
  
  if (input.value !== data)
    updateField(input, fieldName)
}
function myClinicInputsOnKeyUp(e, clinicInputs) {
  if(e.key === 'Enter')
    updateFieldIfNecessary(e, clinicInputs)
}
//#endregion

window.onload = async function () {
  //Begin the request to get clinic data
  const assignClinicData = (async () => {
    console.log('getting clinic me')
    try {
      Object.assign(clinicData, (await api.get('/clinics/me')).data)
    } catch (err) {
      //TODO => go to a page where the error get shown and explained
      console.log(err)
      //goToHome()
    }
  })()
  console.log('async get request running')
  //let the backend do its work
  //**************

  const signOutButton = document.getElementById('signOutMobile')
  const myClinicInputs = {
    myClinicName: document.getElementById('myClinicName'),
    myClinicAddress: document.getElementById('myClinicAddress'),
    myClinicEmail: document.getElementById('myClinicEmail'),
    myClinicTelephone: document.getElementById('myClinicTelephone'),
    myClinicContactPerson: document.getElementById('myClinicContactPerson')
  }

  signOutButton.classList.remove('invisible')
  signOutButton.addEventListener('click', signOut)

  fillClinicNameCard(localStorage.getItem('name'))
  
  //NOW, don't do anything more until the data have arrived
  await assignClinicData
  //Now the data is here => keep going
  fillClinicFile(myClinicInputs)
  
  //This one I could put it BEFORE waiting for retrieving clinic data, but since it use the clinic data and there is a posibility that the user activates this event clicking something 
  //BEFORE the data has been actually recieved from the backend(bad connection, ridiculously impatient user, etc), I just prefer to wait for the data
  Object.values(myClinicInputs).forEach(input => {
    input.addEventListener('focusout', e => { updateFieldIfNecessary(e, myClinicInputs) })
    input.addEventListener('keyup', e => { myClinicInputsOnKeyUp(e, myClinicInputs) })
  })
  //*******************************
}