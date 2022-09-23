console.log(document.URL)

if (!document.URL.includes('/account/info')) {
  location.replace('account/info')
}