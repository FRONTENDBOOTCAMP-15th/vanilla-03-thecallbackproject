export async function loginAPI(email:string,password:string) {
  const url = 'https://fesp-api.koyeb.app/market/users/login';

  const response = await fetch (url, {
    method: 'POST',
    headers: {
      'Content-Type':'application/json',
    },
    body: JSON.stringify({
      email,
      password,
    }),
  });
  if (!response.ok) {
    throw new Error('로그인 실패');
  }

  return await response.json();
}