import { getAxios } from '../utils/login-axios';

const axiosInstance = getAxios();

// type JoinRequestBody ={
//      type:string,
//     name: string,
//     email: string,
//     password: string,
//     phone: string,
//     address: string,
// }
export async function newJoin(
    name: string,
    email: string,
    password: string,
  ) {
  try {
      if(password.length < 3){
      alert('비밀번호를 4자 이상 작성해주세요!!!');
      return;
    }
    const postData = {
     name: name,
     email: email,
     password: password, 
     type: "user",
     loginType: "email",
     image:"https://res.cloudinary.com/ddedslqvv/image/upload/v1762758667/nike/l6wt5gQPTd.webp",
     extra: {
      job:"",
      biography:"",
      keyword:[]
     }
    };
    const { data } = await axiosInstance.post('/users/', postData);

    console.log(data);
   
    return data;

  } catch (err) {
    console.error(err);
  }
}
