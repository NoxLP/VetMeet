let limit = 1
let currentPage = 0

//#region helpers
const getMeetingsFilterCard = meeting => {
  let card = document.createElement('article')
  card.classList.add(...(MEETINGS_FILTER_CARDS_HTML[0].split(' ')))
  card.style.maxHeight = MEETINGS_FILTER_CARDS_HTML[1]
  card.innerHTML = `<div class="row flex-nowrap">
  <h5 class="col-7">${meeting.date.toLocaleDateString()}</h5>
  <p class="col-3 fs-6 text-end">${(meeting.confirmed ? 'Conf.' : 'No conf.')}</p>
  <p class="col-3 fs-6 text-end">${(meeting.done ? 'Comp.' : 'No comp.')}</p>
</div>
<div class="row d-flex justify-content-between flex-nowrap">
  <h4 class="col mb-0">${meeting.name}</h4>
  <p class="col fs-6 text-end text-nowrap mb-0">${meeting.species}</p>
</div>
<div class="row my-0 py-0">
  <p class="col fs-6 fst-italic">${meeting.disease}</p>
</div>
<div class="row mw-100">
  <p class="col fs-6 h-25 text-wrap">${meeting.surgery}</p>
</div>`
  return card
}
const showFilterSpinner = () => { 
  document.getElementById('filterSpinner'.classList.remove('collapse'))
  document.getElementById('filterSpinner'.classList.remove('hide'))
  document.getElementById('filterSpinner'.classList.add('show'))
}
const hideFilterSpinner = () => { 
  document.getElementById('filterSpinner'.classList.add('collapse'))
  document.getElementById('filterSpinner'.classList.add('hide'))
  document.getElementById('filterSpinner'.classList.remove('show'))
}
const getFilteredMeetings = async () => {
  try {
    let meetings = api.get('/meetings/dtos/filter')
  } catch(err) {

  }
}
//#endregion

//#region events callbacks
export function cardsContainerOnScroll(e) {
  //https://www.javascripttutorial.net/javascript-dom/javascript-infinite-scroll/
  const {
    scrollTop,
    scrollHeight,
    clientHeight
  } = e.target

  if(scrollTop + clientHeight >= scrollHeight - 5) {
    currentPage++
    showFilterSpinner()
  }
}
//#endregion