import axios from "axios";
import Authentication from "../models/Authentication";

const authentication = new Authentication()
const BACKEND_URL= import.meta.env.VITE_APP_BACKEND_URL
const AxiosAuth = axios.create({	
	baseURL: 	BACKEND_URL,
	headers : { 'Authorization' : `Bearer ${authentication.accessToken}` },
});




export default AxiosAuth ;