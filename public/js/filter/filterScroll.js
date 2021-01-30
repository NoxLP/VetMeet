import { api, MEETINGS_FILTER_CARDS_HTML } from "../helpers/helpers.js";

const SPINNER = document.getElementById('filterSpinner')
const FILTER_CHANGE_WAIT_MS = 2500
const SCROLL_THRESHOLD = 5
const LIMIT = 2
const filteredMeetingsIds = []
let currentPage = -1
let lastFilterValue
let filterChangeTimer = null

//#region helpers
const getMeetingsFilterCard = meetingDTO => {
  console.log(meetingDTO)
  let card = document.createElement('article')
  card.classList.add(...(MEETINGS_FILTER_CARDS_HTML[0].split(' ')))
  card.style.maxHeight = MEETINGS_FILTER_CARDS_HTML[1]
  card.innerHTML = `<div class="row flex-nowrap">
  <h5 class="col-6">${(new Date(meetingDTO.date)).toLocaleDateString()}</h5>
  <p class="col-3 fs-6 text-nowrap text-end">${(meetingDTO.confirmed ? 'Conf.' : 'No conf.')}</p>
  <p class="col-3 fs-6 text-nowrap text-end">${(meetingDTO.done ? 'Comp.' : 'No comp.')}</p>
</div>
<div class="row d-flex justify-content-between flex-nowrap">
  <h4 class="col mb-0">${meetingDTO.name}</h4>
  <p class="col fs-6 text-end text-nowrap mb-0">${meetingDTO.species}</p>
</div>
<div class="row my-0 py-0">
  <p class="col fs-6 fst-italic">${meetingDTO.disease}</p>
</div>
<div class="row mw-100">
  <p class="col fs-6 h-25 text-wrap">${meetingDTO.surgery}</p>
</div>`

  card.setAttribute('id', meetingDTO._id)
  card.addEventListener('click', cardOnClick)

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
    console.log(err)
    alert('Hubo un error intentando filtrar sus citas')
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

  console.log(filteredMeetingsIds)
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
      console.log(err)
      alert('Hubo un error intentando filtrar sus citas')
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
        console.log(err)
        alert('Hubo un error intentando filtrar sus citas')
      })
    hideFilterSpinner()
  }
}
function cardOnClick(e) {
  document.querySelectorAll('.tab-pane.active.show').forEach(pane => {
    pane.classList.remove('active', 'show')
  })
  document.getElementById('meetingsFilesContent').classList.add('active', 'show')
}
export function goStartEndButtonOnClick() {
  let cardsContainer = document.getElementById('meetingsFilterDTOsCardsContainer')
  if(cardsContainer.scrollLeft === 0)
    cardsContainer.scrollLeft = cardsContainer.scrollWidth
  else
    cardsContainer.scrollLeft = 0
}
//export function 
//#endregion