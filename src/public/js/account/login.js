console.log('LOGIN')

const registerBtn = $('.register-btn')
const Popup = $('.pop-up-account')

registerBtn.click(e => {
  e.preventDefault()
  window.location.replace('./register')
})

if (document.URL.includes('account/register')) {
  window.location.replace('./login?register=1')
}

$(window).load(function () {
  if (Popup.length > 0) Popup.css({ top: '100px' })
})
function hidePopup(e) {
  const target = e.target
  if (target.nodeName != 'BUTTON') return
  Popup.css({ top: '-200px' })
}

Popup.click(hidePopup)
$(document.body).click(e => {
  if (!$(e.target.closest('.pop-up-account'))) return
  Popup.css({ top: '-200px' })
})
