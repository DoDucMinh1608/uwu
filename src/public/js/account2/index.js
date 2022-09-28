if (localStorage.getItem('account') == null) location.replace('./account2/login')

const account = JSON.parse(localStorage.getItem('account'))

location.replace(`/account2/user/${account.id}`)
