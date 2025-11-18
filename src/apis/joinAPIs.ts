import { getAxios } from '../utils/login-axios';

const axiosInstance = getAxios();

type JoinRequestBody ={
     type:string,
    name: string,
    email: string,
    password: string,
    phone: string,
    address: string,
}
export async function newJoin(
    name: string,
    email: string,
    password: string,
  ) {
  try {
    const postData: JoinRequestBody = {
     type: name,  //임시
     name: name,
     email: email,
     password: password, 
     phone: password, //임시
     address: password //임시
    };
    const { data } = await axiosInstance.post('/users', postData);
    console.log(data);
    return data;
  } catch (err) {
    console.error(err);
  }
}
