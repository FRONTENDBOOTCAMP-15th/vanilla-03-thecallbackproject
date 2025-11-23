import axios from 'axios';

const API_SERVER = 'https://fesp-api.koyeb.app/market';

function safeGetLocalUser() {
  try {
    const raw = localStorage.getItem('item');
    if (!raw) return null;

    const parsed = JSON.parse(raw);

    if (parsed?.token?.accessToken) return parsed;

    return null;
  } catch {
    localStorage.removeItem('item');
    return null;
  }
}

export function getAxios() {
  const instance = axios.create({
    baseURL: API_SERVER,
    timeout: 1000 * 7,
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      'Client-Id': 'febc15-vanilla03-ecad',
    },
  });

  instance.interceptors.request.use(
    config => {
      console.log('요청 인터셉터 호출', config);

      const user = safeGetLocalUser();
      const token = user?.token?.accessToken;

      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      } else {
        delete config.headers.Authorization;
      }

      config.params = {
        ...config.params,
      };

      return config;
    },
    error => {
      return Promise.reject(error);
    },
  );

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

export function getAuthorizationHeader(): string {
  const user = safeGetLocalUser();
  const token = user?.token?.accessToken;

  return token ? `Bearer ${token}` : '';
}
