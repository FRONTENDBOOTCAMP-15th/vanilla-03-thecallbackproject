import axios from 'axios';

const API_SERVER = 'https://fesp-api.koyeb.app/market';

// axiosInstance를 외부에서도 접근할 수 있도록 선언
export let axiosInstance: ReturnType<typeof getAxios> | null = null;

export function getAxios() {
  const instance = axios.create({
    baseURL: API_SERVER, // 기본 URL
    timeout: 1000 * 5,
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      'Client-Id': 'febc15-vanilla03-ecad',
      Authorization: `Bearer`, // 초기에는 비워둠 (인터셉터에서 채워짐)
    },
  });

  // 생성된 instance 저장
  axiosInstance = instance;

  // 요청 인터셉터: 토큰 자동 추가
  instance.interceptors.request.use(
    config => {
      console.log('요청 인터셉터 호출', config);

      // localStorage에서 토큰 가져오기
      const token = JSON.parse(localStorage.getItem('item') || '{}')?.token
        ?.accessToken;

      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }

      // 기존 params 유지
      config.params = {
        ...config.params,
      };

      return config;
    },
    error => {
      return Promise.reject(error);
    },
  );

  // 응답 인터셉터
  instance.interceptors.response.use(
    response => {
      console.log('정상 응답 인터셉터 호출', response);
      return response;
    },
    error => {
      console.error('에러 응답 인터셉터 호출', error);
      return Promise.reject(new Error('잠시 후 다시 이용해 주시기 바랍니다.'));
    },
  );

  return instance;
}

// 현재 Authorization 헤더 값을 가져오는 함수
export function getAuthorizationHeader(): string {
  const item = localStorage.getItem('item');
  if (!item) return '';

  try {
    const parsed = JSON.parse(item);
    const token = parsed?.token?.accessToken;
    return token ? `Bearer ${token}` : '';
  } catch {
    return '';
  }
}
