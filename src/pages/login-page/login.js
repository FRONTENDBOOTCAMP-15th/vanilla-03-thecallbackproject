const loginButton = document.querySelector('.login-btn');
const loginForm = document.getElementById('login-form');
loginButton.addEventListener('click', loginButtonClick);
const loginCheckBtn = document.querySelector('#login-check-btn');
let isChecked = false;

function loginButtonClick() {
  event.preventDefault();
  const userEmail = loginForm.userEmail.value;
  const userPassword = loginForm.userPassword.value;
  if (userEmail === 'gkstjq309@gmail.com' && userPassword === 'k12455241') {
    alert('로그인 성공!');
  } else {
    alert('아이디나 비밀번호를 확인해주세요.');
  }
}

loginCheckBtn.addEventListener('click', function () {
  const area = document.querySelector('#login-check-btn .area');
  const border = document.querySelector('#login-check-btn .border');
  const marker = document.querySelector('#login-check-btn .marker');
  if (isChecked) {
    area.setAttribute('fill', '#fff');
    border.setAttribute('fill', '#999');
    marker.setAttribute('fill', '#999');
  } else {
    area.setAttribute('fill', '#1bf008');
    border.setAttribute('fill', '#fff');
    marker.setAttribute('fill', '#fff');
  }
  isChecked = !isChecked;
});
