import { loginAPI } from '../../apis/loginAPIs';


const loginButton = document.querySelector<HTMLButtonElement>('.login-btn');
const loginForm = document.getElementById('login-form',) as HTMLFormElement | null;

const loginCheckBtn = document.querySelector<HTMLButtonElement>('#login-check-btn');
let isChecked: boolean = false;

// 로그인 버튼 클릭 핸들러
async function loginButtonClick(e: Event) {
  e.preventDefault();

  if (!loginForm) return;

  const userEmail = (loginForm.querySelector('#userEmail') as HTMLInputElement).value;
  const userPassword = (loginForm.querySelector('#userPassword') as HTMLInputElement).value;

  if(!userEmail || !userPassword){
    alert('이메일과 비밀번호를 입력해주세요');
    return;
  }

  try {
    const result = await loginAPI(userEmail,userPassword);
    console.log('로그인',result);
    if(!result.item.token){
      throw new Error("토큰 반환 실패");     
    }
    localStorage.setItem('token', result.token);
    localStorage.setItem('user', JSON.stringify(result.user));
    alert('로그인 성공!');
    //페이지 이동 액션
    //window.location.href = '/';
  } catch (error) {
    console.error(error);
    alert('아이디 또는 비밀번호가 올바르지 않습니다.');
    // window.location.href = "";

  }
}

if (loginButton) {
  loginButton.addEventListener('click', loginButtonClick);
}
// 로그인 정보저장
if (loginCheckBtn) {
  loginCheckBtn.addEventListener('click', () => {
    const area = document.querySelector<SVGElement>('#login-check-btn .area');
    const border = document.querySelector<SVGElement>('#login-check-btn .border');
    const marker = document.querySelector<SVGElement>('#login-check-btn .marker');

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
