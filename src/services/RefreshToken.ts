
// import AxiosAuth from './Axios';
import Authentication from "../models/Authentication";
import axios from 'axios';

const BACKEND_URL= import.meta.env.VITE_APP_BACKEND_URL

const refreshToken = async () => {
  try {
    const authentication = new Authentication()
    const response = await axios.get(`${BACKEND_URL}auth/refresh_token` , {
        headers : { 'Authorization' : `Bearer  ${authentication.refreshToken}` },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export default refreshToken;