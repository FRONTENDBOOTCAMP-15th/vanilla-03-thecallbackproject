const loginButton = document.querySelector<HTMLButtonElement>('.login-btn');
const loginForm = document.getElementById(
  'login-form',
) as HTMLFormElement | null;

const loginCheckBtn =
  document.querySelector<HTMLButtonElement>('#login-check-btn');
let isChecked: boolean = false;

// 로그인 버튼 클릭 핸들러
function loginButtonClick(e: Event) {
  e.preventDefault();

  if (!loginForm) return;

  const userEmail = (loginForm.querySelector('#userEmail') as HTMLInputElement)
    .value;
  const userPassword = (
    loginForm.querySelector('#userPassword') as HTMLInputElement
  ).value;

  if (userEmail === 'gkstjq309@gmail.com' && userPassword === 'k12455241') {
    alert('로그인 성공!');
  } else {
    alert('아이디나 비밀번호를 확인해주세요.');
  }
}

if (loginButton) {
  loginButton.addEventListener('click', loginButtonClick);
}

if (loginCheckBtn) {
  loginCheckBtn.addEventListener('click', () => {
    const area = document.querySelector<SVGElement>('#login-check-btn .area');
    const border = document.querySelector<SVGElement>(
      '#login-check-btn .border',
    );
    const marker = document.querySelector<SVGElement>(
      '#login-check-btn .marker',
    );

    if (!area || !border || !marker) return;

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
}
