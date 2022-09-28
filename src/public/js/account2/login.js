const registerBtn = $('.register-btn')

registerBtn.click(e => {
  e.preventDefault()
  window.location.replace('./register')
})

if (localStorage.getItem('account')) location.replace('/account2')