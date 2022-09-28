import { checkAccount } from '../users/redirect.mjs'

checkAccount()

location.replace(`/account2/user/${JSON.parse(localStorage.getItem('account')).id}`)
