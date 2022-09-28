import { sendDataSync } from '../utilities.js'

$('.Info').click(e => {
  location.replace('./')
})

const account = JSON.parse(sendDataSync({ url: './data', method: "POST" }, localStorage.getItem('account')))
console.log(account)

const nameInput = $('#username')
const passInput = $('#password')
const birthInput = $('#birthday-input')
const genderInput = $('#gender')

nameInput.val(account.name)
birthInput.val(account.birth)
genderInput.val(account.gender)