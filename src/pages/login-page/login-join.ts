import { newJoin } from '../../apis/joinAPIs';

window.addEventListener('DOMContentLoaded', function () {
  async function JoinHandler(e: Event) {
    const form = e.currentTarget as HTMLFormElement;
    const nickName = form.elements.namedItem('nickname') as HTMLInputElement;
    const email = form.elements.namedItem('email') as HTMLInputElement;
    const passWord = form.elements.namedItem('password') as HTMLInputElement;



    const joinData = await newJoin(nickName.value, email.value, passWord.value);
    console.log(joinData);
  }

  const joinForm = document.querySelector('.login-join');

  joinForm?.addEventListener('submit', function (e) {
    e.preventDefault();
    JoinHandler(e);
  });
});
