import { sendDataSync, sendData } from '../utilities.mjs'
import { logout } from '../utilities.mjs'
import { checkAccount } from './redirect.mjs'

logout()
checkAccount()

const account = JSON.parse(localStorage.getItem('account'))
if (account.id && !document.URL.includes(account.id)) location.replace(`./${account.id}`)

sendData({ method: "POST", url: './validate', async: true }, JSON.stringify(account), function () {
  const data = JSON.parse(this.responseText)?.verify
  if (data) return
  localStorage.removeItem('account')
  location.replace('/account2/login')
})

$('.Change').click(e => {
  location.replace('./change')
})