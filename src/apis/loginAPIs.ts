import { getAxios } from "../utils/axios";

const axiosInstance = getAxios();

export async function loginAPI(email:string, password:string) {
  try {
    const {data} = await axiosInstance.post('/users/login',{
      email,
      password
    });
    return data;  
  } catch (error) {
    
    console.error("로그인 API 오류", error);

    throw error;
  }
}

