export const BASE_URL = 'http://localhost:3000/api'
export const APP_URL = './citas-app.html'
export const api = axios.create({
  baseURL: BASE_URL,
  timeout: 3000
});

export const MEETINGS_FILTER_CARDS_HTML = [
  'row container-fluid card shadow-sm px-0 py-2 me-3 g-0 flex-nowrap overflow-hidden',
  '180px'
]

export const goToApp = () => { window.location = APP_URL }
export const goToHome = () => { window.location = './index.html' }

const INTERCEPT_AXIOS = false

if(INTERCEPT_AXIOS) {
  api.interceptors.request.use(request => {
    console.log('Starting Request', JSON.stringify(request, null, 2))
    return request
  })

  api.interceptors.response.use(response => {
    console.log('Received response:', JSON.stringify(response, null, 2))
    return response
  })
}