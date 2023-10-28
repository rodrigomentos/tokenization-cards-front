
import axios from 'axios';
import ICard from '../interfaces/ICard';
import { ICardInfoResponse } from '../interfaces/ICardInfoResponse';
import AxiosAuth  from './Axios';
const API_URL = import.meta.env.VITE_APP_BACKEND_URL;

class CardService {
  
  async store( card: ICard){

    const tokenCommercial :string = localStorage.getItem('tokenCommercial' ) || '';

    return axios.post(API_URL + 'cards', card, { headers: { 
        'Authorization': `Bearer ${tokenCommercial}`
      }}).then(response => {
        
        return response.data;

      }).catch(error => {
        const { status, data } = error.response
        
        if(status === 400){
           const errorMessages =  Object.values(data.message) 
           if(errorMessages.length > 0){
              errorMessages.forEach((msg: any) => {
                throw new Error(msg)
              })
           } 
        }
        
        if(error?.response?.data){
          throw new Error(error.response.data.user_message)
        }
        console.log(error)
        throw new Error('Intento mas tarde.')
        
      });
  }

  async getCardByToken( token: string){

    
    const response = await AxiosAuth
      .get<ICardInfoResponse>(`cards/token/${token}`).then(response => {

        return response;

      }).catch(error => {
        if(error?.response?.data){
          throw new Error(error.response.data.message)
        }
        console.log(error)
        throw new Error('Intento mas tarde.')
        
    });
    return response.data
  }
}

export default  CardService;