export function sendData(method = { method: "POST", url: './', async: true }, data = '', callback = () => { }) {
  const xhttp = new XMLHttpRequest()
  xhttp.open(method.method, method.url, method.async);
  xhttp.setRequestHeader('Content-type', 'application/json;charset=UTF-8')
  xhttp.onload = callback
  xhttp.send(data)
}

export function sendDataSync(method = { method: "POST", url: './', async: true }, data = '') {
  let xhttp = new XMLHttpRequest(), result;
  xhttp.open(method.method, method.url, method.async);
  xhttp.setRequestHeader('Content-type', 'application/json;charset=UTF-8')
  xhttp.onload = function () {
    if (this.status == 404) result = 'error'
    result = this.responseText
  }
  xhttp.send(data)
  return result
}