export function checkAccount() {
  const account = localStorage.getItem('account')
  if (!account) location.replace('/account2/login')
}