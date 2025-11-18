import { newJoin } from '../../apis/joinAPIs';


window.addEventListener('DOMContentLoaded', function (e: Event) {
  async function JoinHandler() {
    const form = e.currentTarget as HTMLFormElement;
    const nickName = form.elements.namedItem('nickname') as HTMLInputElement;
    const email = form.elements.namedItem('email') as HTMLInputElement;
    const passWord = form.elements.namedItem('password') as HTMLInputElement;
    
    try {
    const joinData = await newJoin(nickName.value, email.value, passWord.value);
      console.log("회원가입 성공:", joinData);
    } catch (error) {
      console.error('회원가입 실패:',error);     
    }

  }

  // 서밋 회원가입 버튼을 눌렸을때.
  const joinForm = document.querySelector('.login-join');

  joinForm?.addEventListener('submit', function () {
    const form = e.currentTarget as HTMLFormElement;
    const passWord = form.elements.namedItem('password') as HTMLInputElement;
  
    e.preventDefault();
       
    if (passWord.value.length < 4) {
      alert("비밀번호는 4자 이상 입력해야 합니다.");
      return;
    }
    // 이미 가입되어 있는 로그인 데이터는 패스 하도록 알림을 띄운다.
    
    JoinHandler();
  });
});
