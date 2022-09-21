console.log('LOGIN')

const registerBtn = $('.register-btn')

registerBtn.click(e => {
  e.preventDefault()
  window.location.replace('./register')
})
