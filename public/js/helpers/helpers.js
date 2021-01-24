/*
BASE_URL="http://localhost:3000/api"
APP_URL="http://localhost:3000/citas-app.html"
*/

export const BASE_URL = 'http://localhost:3000/api'
export const APP_URL = './citas-app.html'
export const api = axios.create({
  baseURL: BASE_URL,
  timeout: 3000
});

export const goToApp = () => { window.location = APP_URL }
export const goToHome = () => { window.location = './index.html' }
