const account = JSON.parse(localStorage.getItem('account'))

location.replace(`./${account.id}`)