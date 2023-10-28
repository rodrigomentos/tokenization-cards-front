import axios from 'axios';
import ILogin from '../interfaces/ILogin';
import auth from '../router/auth';
import AxiosAuth  from './Axios';

const API_URL =  import.meta.env.VITE_APP_BACKEND_URL+ 'auth/';

class AuthenticationService {
  login(userLogin: ILogin) {
    return axios
      .post(API_URL + 'login', userLogin)
      .then(response => {
        if (response.data.accessToken) {
          
          localStorage.setItem('CULQI_DATA', JSON.stringify(response.data ));
          localStorage.setItem('tokenCommercial', response.data.tokenCommercial)
          AxiosAuth.defaults.headers.Authorization = `Bearer  ${response.data.accessToken}`
          auth.isLoggedIn = true;
        }

        return response.data;
      }).catch(error => {
        if(error.response.data){
          throw new Error(error.response.data.message)
        }
        
        throw new Error(error)
        
      });
  }

  async logout() {
    
    await AxiosAuth
      .get('auth/logout').then(response => {
        delete AxiosAuth.defaults.headers.Authorization
        localStorage.removeItem('CULQI_DATA');
        localStorage.removeItem('tokenCommercial');
        auth.isLoggedIn = false;

        return response.data;
      }).catch(error => {
        if(error.response.data){
          throw new Error(error.response.data.message)
        }
        
        throw new Error(error)
        
    });
    
  }

  
}

export default new AuthenticationService;