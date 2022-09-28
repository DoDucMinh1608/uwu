import { checkAccount } from './redirect.mjs'
checkAccount()

const account = JSON.parse(localStorage.getItem('account'))

location.replace(`./${account.id}`)