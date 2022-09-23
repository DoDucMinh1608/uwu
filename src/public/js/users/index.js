const account = localStorage.getItem("account")
if (!account) window.location.replace('/account/login')

const id = JSON.parse(account).id
if (!document.URL.includes(id)) window.location.replace(`./info/${id}`)

function updateInfo(data) {
  console.log(JSON.parse(data));
}

let result;
const xhttp = new XMLHttpRequest()
xhttp.open("POST", "./validate", true);
xhttp.setRequestHeader('Content-type', 'application/json;charset=UTF-8')
xhttp.onload = function () {
  if (this.status != 200) return
  updateInfo(this.responseText)
};

xhttp.send(account);