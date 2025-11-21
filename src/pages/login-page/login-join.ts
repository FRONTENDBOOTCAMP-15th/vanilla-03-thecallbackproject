import { newJoin } from '../../apis/joinAPIs';

window.addEventListener('DOMContentLoaded', function () {
  const joinForm = document.querySelector('.login-join') as HTMLFormElement;
  const nickName = document.querySelector('#nickName') as HTMLInputElement;
  const email = document.querySelector('#email') as HTMLInputElement;
  const passWord = document.querySelector('#password') as HTMLInputElement;
  const passWordCheck = document.querySelector(
    '#password-Check',
  ) as HTMLInputElement;
  const joinBtn = document.querySelector<HTMLButtonElement>('.btn-join');

  // 로그인 조건에 따른 버튼 색상변경
  function updateJoinButtonState() {
    if (!joinBtn) return;
    if (
      nickName.value.length >= 3 &&
      email.value.includes('@') &&
      passWord.value.length >= 4 &&
      passWord.value === passWordCheck.value
    ) {
      joinBtn.classList.add('active');
      joinBtn.disabled = false;
    } else {
      joinBtn.classList.remove('active');
      joinBtn.disabled = true;
    }
  }
  nickName.addEventListener('input', updateJoinButtonState);
  email.addEventListener('input', updateJoinButtonState);
  passWord.addEventListener('input', updateJoinButtonState);
  passWordCheck.addEventListener('input', updateJoinButtonState);

  async function JoinHandler() {
    try {
      const joinData = await newJoin(
        nickName.value,
        email.value,
        passWord.value,
      );
      console.log('회원가입 성공:', joinData);
      alert('회원가입이 완료되었습니다!');
      window.location.href = '/src/pages/login-page/login.html';
    } catch (error) {
      console.error('회원가입 실패:', error);
    }
  }

  // 서밋 회원가입 버튼을 눌렸을때.

  joinForm?.addEventListener('submit', function (e: Event) {
    e.preventDefault();
    console.log('클릭됨');
    const form = e.currentTarget as HTMLFormElement;
    const passWord = form.elements.namedItem('password') as HTMLInputElement;

    if (passWord.value.length < 4) {
      alert('비밀번호는 4자 이상 입력해야 합니다.');
      return;
    }
    // 이미 가입되어 있는 로그인 데이터는 패스 하도록 알림을 띄운다.

    JoinHandler();
  });
});
