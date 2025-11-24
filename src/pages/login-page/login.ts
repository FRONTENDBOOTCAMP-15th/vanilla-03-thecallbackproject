import { loginAPI } from '../../apis/loginAPIs';

const loginButton = document.querySelector<HTMLButtonElement>('.login-btn');
const loginForm = document.getElementById(
  'login-form',
) as HTMLFormElement | null;
const loginCheckBtn =
  document.querySelector<HTMLButtonElement>('#login-check-btn');

const emailInput = loginForm?.querySelector(
  '#userEmail',
) as HTMLInputElement | null;
const passwordInput = loginForm?.querySelector(
  '#userPassword',
) as HTMLInputElement | null;

let userEmailValue: string = '';
let userPasswordValue: string = '';

function updateLoginButtonState() {
  if (!loginButton) return;
  // Input 입력 조건
  if (
    userEmailValue.trim() !== '' &&
    userEmailValue.includes('@') &&
    userEmailValue.length >= 5 &&
    userPasswordValue.length > 3 &&
    userPasswordValue.trim() !== ''
  ) {
    loginButton.classList.add('active'); // 활성화 CSS
    loginButton.disabled = false;
  } else {
    loginButton.classList.remove('active'); // 비활성화 CSS
    loginButton.disabled = true;
  }
}

emailInput?.addEventListener('input', e => {
  userEmailValue = (e.target as HTMLInputElement).value;
  updateLoginButtonState();
});
passwordInput?.addEventListener('input', e => {
  userPasswordValue = (e.target as HTMLInputElement).value;
  updateLoginButtonState();
});

let isChecked: boolean = false;

// 로그인 버튼 클릭 핸들러
async function loginButtonClick(e: Event) {
  e.preventDefault();

  if (!loginForm) return;

  if (!userEmailValue || !userPasswordValue) {
    alert('이메일과 비밀번호를 입력해주세요');
    return;
  }

  try {
    const result = await loginAPI(userEmailValue, userPasswordValue);

    if (!result.item.token) {
      throw new Error('토큰 반환 실패');
    }

    localStorage.setItem('item', JSON.stringify(result.item));

    //페이지 이동 액션
    const redirect = localStorage.getItem('redirectPath');
    if (redirect) {
      localStorage.removeItem('redirectPath');
      window.location.href = redirect;
    } else {
      window.location.href = '/';
    }
  } catch (error) {
    alert('아이디 또는 비밀번호가 올바르지 않습니다.');
  }
}
function handleEnterKey(e: KeyboardEvent) {
  if (e.key === 'Enter') {
    e.preventDefault();
    loginButtonClick(e); // 로그인 함수 호출
  }
}

emailInput?.addEventListener('keydown', handleEnterKey);
passwordInput?.addEventListener('keydown', handleEnterKey);

if (loginButton) {
  loginButton.addEventListener('click', loginButtonClick);
}
// 로그인 데이터에 따른 버튼 색상 변경 이벤트
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
