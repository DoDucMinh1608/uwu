const account = JSON.parse(localStorage.getItem('account'))
if (!account) location.replace('/account2/login')
if (account.id && !document.URL.includes(account.id)) location.replace(`./${account.id}`)

const xhttp = new XMLHttpRequest()
xhttp.open("POST", "./validate", true);
xhttp.setRequestHeader('Content-type', 'application/json;charset=UTF-8')
xhttp.onload = function () {
  const data = JSON.parse(this.responseText)?.verify
  if (data) return
  localStorage.removeItem('account')
  location.replace('/account2/login')
};

xhttp.send(JSON.stringify(account)); 