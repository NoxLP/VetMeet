import { 
  api, 
  MEETINGS_FILTER_CARDS_HTML, 
  getFormattedDateString, 
  getFormattedTimeString, 
  getMobileCompletedString, 
  getMobileConfirmedString, 
  setInputValueIfNotFalsie, 
  showAlert, 
  askForConfirmation } from "../helpers/helpers.js";

const SPINNER = document.getElementById('filterSpinner')
const FILTER_CHANGE_WAIT_MS = 2500
const SCROLL_THRESHOLD = 5
const LIMIT = 2
let currentPage = -1
let lastFilterValue
let filterChangeTimer = null
let fileMeetingId

//#region helpers
const getMeetingsFilterCard = meetingDTO => {
  console.log(meetingDTO)
  let card = document.createElement('article')
  card.classList.add(...(MEETINGS_FILTER_CARDS_HTML[0].split(' ')))
  card.style.maxHeight = MEETINGS_FILTER_CARDS_HTML[1]
  card.innerHTML = `<div class="row flex-nowrap">
  <h5 class="col-6">${(new Date(meetingDTO.date)).toLocaleDateString()}</h5>
  <p class="col-3 fs-6 text-nowrap text-end">${getMobileConfirmedString(meetingDTO)}</p>
  <p class="col-3 fs-6 text-nowrap text-end">${getMobileCompletedString(meetingDTO)}</p>
</div>
<div class="row d-flex justify-content-between flex-nowrap">
  <h4 class="col mb-0">${meetingDTO.name}</h4>
  <p class="col fs-6 text-end text-nowrap mb-0">${meetingDTO.species}</p>
</div>
<div class="row my-0 py-0">
  <p class="col fs-6 fst-italic">${meetingDTO.disease}</p>
</div>
<div class="row mw-100">
  <p class="col fs-6 h-25 text-wrap">${meetingDTO.surgery ? meetingDTO.surgery : ''}</p>
</div>`

  card.setAttribute('id', meetingDTO._id)
  card.addEventListener('click', cardOnClick, true)

  return card
}
const getCategoryField = () => {
  switch (document.getElementById('meetingsFilterSelect').value) {
    case '1':
      return 'name'
    case '2':
      return 'date'
    case '3':
      return 'disease'
    case '4':
      return 'species'
  }
}
const getFilteredMeetingsCards = async () => {
  try {
    currentPage++
    let value = encodeURIComponent(document.getElementById('filterMeetingsTextInput').value)

    let meetingsDTOs = (await api.get(
      `/meetings/dtos/filter`, 
      {
        params: {
          'limit': LIMIT,
          page: currentPage,
          [getCategoryField()]: value
        }
      })).data
    console.log(meetingsDTOs)
    if (!Array.isArray(meetingsDTOs) || meetingsDTOs[0] === 0)
      return null

    let totalPages = Math.ceil(meetingsDTOs[0] / LIMIT)
    if (currentPage > totalPages)
      return null
    
    return meetingsDTOs[1].map(dTO => getMeetingsFilterCard(dTO))
  } catch (err) {
    //TODO: store the real error somewhere
    showAlert(
      'Hubo un error al intentar filtrar sus citas. Inténtelo de nuevo o contacte con nosotros.',
      false)
  }
}
const showFilterSpinner = () => {
  if(SPINNER.classList.contains('collapse')) {
    SPINNER.classList.remove('collapse')
    SPINNER.classList.remove('hide')
    SPINNER.classList.add('show')
  }
}
const hideFilterSpinner = () => {
  if(!SPINNER.classList.contains('collapse')) {
    SPINNER.classList.add('collapse')
    SPINNER.classList.add('hide')
    SPINNER.classList.remove('show')
  }
}
const clearCards = () => {
  const cardsContainer = document.getElementById('meetingsFilterDTOsCardsContainer')
  const currentCards = document.querySelectorAll('#meetingsFilterDTOsCardsContainer > .card')
  if(currentCards)
    currentCards.forEach(card => cardsContainer.removeChild(card))
  
  return cardsContainer
}
const fillMeetingFile = card => {
  console.log('card: ', card)
  api.get(`/meetings/${card.getAttribute('id')}`)
    .then(({ data }) => {
      let date = new Date(data.date)

      setInputValueIfNotFalsie(document.getElementById('meetingFileDate'), `${getFormattedDateString(date)}\n${getFormattedTimeString(date)}`, 'innerText')
      setInputValueIfNotFalsie(document.getElementById('meetingFileConfirmed'), getMobileConfirmedString(data), 'innerText')
      setInputValueIfNotFalsie(document.getElementById('meetingFileCompleted'), getMobileCompletedString(date), 'innerText')
      setInputValueIfNotFalsie(document.getElementById('meetingFileNameInput'), data.patient.name)
      setInputValueIfNotFalsie(document.getElementById('meetingFileSpeciesInput'), data.patient.species)
      setInputValueIfNotFalsie(document.getElementById('meetingFileDiseaseInput'), data.disease)
      setInputValueIfNotFalsie(document.getElementById('meetingFileTreatmentInput'), data.treatment)
      setInputValueIfNotFalsie(document.getElementById('meetingFileSurgeryInput'), data.surgery)
      setInputValueIfNotFalsie(document.getElementById('meetingFileNotesInput'), data.notes)
      setInputValueIfNotFalsie(document.getElementById('meetingFileHistoryInput'), data.patient.history)
    })
    .catch(err => {
      //TODO: store the real error somewhere
      showAlert(
        'No se pudo encontrar la cita que buscaba. Inténtelo de nuevo o contacte con nosotros.',
        false)
    })
}
const getFileUpdateObject = () => {
  return {
    meeting: {
      disease: document.getElementById('meetingFileDiseaseInput').value,
      treatment: document.getElementById('meetingFileTreatmentInput').value,
      surgery: document.getElementById('meetingFileSurgeryInput').value,
      notes: document.getElementById('meetingFileNotesInput').value
    },
    patient: {
      name: document.getElementById('meetingFileNameInput').value,
      species: document.getElementById('meetingFileSpeciesInput').value,
      history: document.getElementById('meetingFileHistoryInput').value
    }
  }
}
const deleteMeeting = () => {
  api.delete(`/meetings/${fileMeetingId}`)
    .then(res => {
      showAlert(
        'Su cita ha sido borrada correctamente',
        true,
        'Cita Borrada'
      )
    })
    .catch(err => {
      //TODO: store the real error somewhere
      showAlert(
        'Hubo un error al intentar borrar su cita. Inténtelo de nuevo o contacte con nosotros.',
        false)
    })
}
//#endregion

//#region events callbacks
export function cardsFilterOnKeyUp(e) {
  console.log('filter on key up')
  currentPage = -1

  if(e.target.value === '') {
    lastFilterValue = ''
    clearTimeout(filterChangeTimer)
    filterChangeTimer = null
    clearCards()
    hideFilterSpinner()
    return
  }
  
  showFilterSpinner()
  if(e.target.value !== lastFilterValue) {
    //user still writing, wait
    lastFilterValue = e.target.value
    clearTimeout(filterChangeTimer)
    filterChangeTimer = setTimeout(() => { cardsFilterOnKeyUp(e) }, FILTER_CHANGE_WAIT_MS)
    return
  }
  console.log('pass')

  if(filterChangeTimer) {
    clearTimeout(filterChangeTimer)
    filterChangeTimer = null
  }
  lastFilterValue = e.target.value

  const cardsContainer = clearCards()
  
  getFilteredMeetingsCards()
    .then(res => {
      console.log('onkeyup cards: ', res)
      if (!res)
        return
      
      res.forEach(card => {
        cardsContainer.appendChild(card)
      })
    })
    .catch(err => {
      //TODO: store the real error somewhere
      showAlert(
        'Hubo un error al intentar filtrar sus citas. Inténtelo de nuevo o contacte con nosotros.',
        false)
    })
  hideFilterSpinner()
}
export function cardsContainerOnScroll(e) {
  //https://www.javascripttutorial.net/javascript-dom/javascript-infinite-scroll/
  const {
    scrollLeft,
    scrollWidth,
    clientWidth
  } = e.target

  if (scrollLeft + clientWidth >= scrollWidth - SCROLL_THRESHOLD) {
    showFilterSpinner()
    getFilteredMeetingsCards()
      .then(res => {
        console.log('onkeyup cards: ', res)
        if (!res)
          return
        
        const cardsContainer = document.getElementById('meetingsFilterDTOsCardsContainer')
        res.forEach(card => {
          cardsContainer.appendChild(card)
        })
      })
      .catch(err => {
        //TODO: store the real error somewhere
        showAlert(
          'Hubo un error al intentar filtrar sus citas. Inténtelo de nuevo o contacte con nosotros.',
          false)
      })
    hideFilterSpinner()
  }
}
function cardOnClick(e) {
  e.stopPropagation();
  //visual
  let tab = new bootstrap.Tab(document.getElementById('meetingsFilesTab'))
  console.log(tab)
  tab.show()

  /*document.querySelectorAll('.tab-pane.active.show').forEach(pane => {
    pane.classList.remove('active', 'show')
  })*/
  //document.getElementById('meetingsFilesContent').classList.add('active', 'show')
  document.getElementById('filterMeetingsTab').classList.remove('active')
  document.getElementById('meetingsFilesTab').classList.add('active')
  //********************************
  console.log('e: ', e.path)
  let card = e.path.find(x => x.classList.contains('card'))
  fillMeetingFile(card)
  fileMeetingId = card.id
}
export function goStartEndButtonOnClick() {
  let cardsContainer = document.getElementById('meetingsFilterDTOsCardsContainer')
  if(cardsContainer.scrollLeft === 0)
    cardsContainer.scrollLeft = cardsContainer.scrollWidth
  else
    cardsContainer.scrollLeft = 0
}
export function meetingUpdateButtonOnClick(e) {
  api.put(`/meetings/${fileMeetingId}`, getFileUpdateObject())
    .then(response => {
      showAlert(
        'Su cita ha sido actualizada correctamente',
        true,
        'Cita actualizada'
      )
    })
    .catch(err => {
      //TODO: store the real error somewhere
      showAlert(
        'Hubo un error al intentar actualziar su cita. Inténtelo de nuevo o contacte con nosotros.',
        false)
    })
}
export function removeMeetingButtonOnClick() {
  askForConfirmation(
    'Está a punto de cancelar una cita, borrando todos los datos de la misma. ¿quiere continuar?',
    '¡Atención!',
    removeConfirmationButtonOnClick
  )  
}
export function removeConfirmationButtonOnClick() {
  $('#confirmationToast').hide()
  deleteMeeting()
}
//#endregion