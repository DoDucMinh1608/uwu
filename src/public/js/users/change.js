import { sendDataSync } from '../utilities.mjs'

$('.Info').click(e => location.replace('./'))
$('.input-field:last-child').before($('#password').closest('.input-field')[0])
$('.input-field:last-child').before($('.error-message'))

const account = JSON.parse(sendDataSync({ url: './data', method: "POST" }, localStorage.getItem('account')))

const nameInput = $('#username')
const passInput = $('#password')
const birthInput = $('#birthday-input')
const genderInput = $('#gender')
  ;
[
  [nameInput, 'name'],
  [birthInput, 'birth'],
  [genderInput, 'gender']
].forEach(i => i[0].val() || i[0].val(account[i[1]]))

passInput.val('')