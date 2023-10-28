<script lang="ts">
import { defineComponent } from 'vue';
import { toast } from 'vue3-toastify';
import CardErrorMessage from "../../models/CardErrorMessage";
import Card from "../../models/Card";
import CardService from "../../services/CardService";
import TokenConfirmation from "./Confirmation.vue";

import { months } from 'moment';
export default defineComponent({
  components: { TokenConfirmation },
  data() {
    return {
        form: new Card(),
        error: new CardErrorMessage(),
        cardService: new CardService(),
        cardNumber: '',
        month: '',
        year: '',
        cvv: '',
        expirationDate: '',
        email: '',
        limitCVV: '3',
        maskCardNumber: '',
        yearNow: (new Date()).getFullYear(),
        btnDisable: true,
        token: 'Esto es una prueba',
        template: 1,
        loanding: false,
        months: [
            "01",
            "02",
            "03",
            "04",
            "05",
            "06",
            "07",
            "08",
            "09",
            "10",
            "11",
            "12",
        ]
    }
  },
  created(){
    
  },
  methods: {
    newToken(){
        this.template = 1
        this.cardNumber= ''
        this.cvv= ''
        this.expirationDate= ''
        this.email= ''
        this.month= ''
        this.year= ''
    },
    async submit(){
        this.loanding = true
        this.form.cardNumber = this.cardNumber
        this.form.cvv = parseInt(this.cvv)
        this.form.email = this.email
        this.form.expiration_month = this.month
        this.form.expiration_year = this.year

        try {
            const response = await this.cardService.store(this.form)
            
            this.loanding = false
            this.template = 2
            this.token = response.token
            
            toast.success( 'Token creado exitosamente.'); 
            
        }catch(error: any){
            this.loanding = false
            
            toast.error( error?.toString()); 
        }
        
    },
    validateMonth(month: string) {
        var monthIn: number = parseInt(month.replace(/^0+/, ""), 10);

        return !isNaN(monthIn) && monthIn >= 1 && monthIn <= 12;
    },
    validateCreditCard(creditCardNumber: string) {
    
      const cardNumber = creditCardNumber.replace(/\D/g, ''); // Elimina caracteres no numéricos
      let sum = 0;
      let doubleUp = false;

      for (let i = cardNumber.length - 1; i >= 0; i--) {
        let digit = parseInt(cardNumber.charAt(i), 10);

        if (doubleUp) {
          digit *= 2;
          if (digit > 9) {
            digit -= 9;
          }
        }

        sum += digit;
        doubleUp = !doubleUp;
      }

      const validate = sum % 10 === 0;

      if(!validate){
            this.error.card_number = 'Número de tarjeta no es valido.'
        }else{
            this.error.card_number = ''

        }
      return validate
    },
    validateCvv(cvv : string){
        if(cvv && cvv.toString().length != parseFloat(this.limitCVV)){            
            this.error.cvv = 'Falta completar el código de seguridad.'

        }else{

            this.error.cvv = ''
        }

        
    },
    validateError(obj: Record<string, any>): boolean {
        for (const key in obj) {
            if (obj.hasOwnProperty(key)) {
                const value = obj[key];
                if (value) return true;
            }
        }
        return false;
    },
    isEmail(email : string) {
        const regex = /^[a-zA-Z0-9._%+-]+@(gmail\.com|hotmail\.com|yahoo\.es)$/;
        return regex.test(email);
    }
  },
  watch: {
    error: {
        handler: function(v) {
            this.btnDisable = this.validateError(v)
        },
        deep : true
    },
    cardNumber(newVal) {
       

        var limitCVV: string = '3'
        // Detect card type based on the first few digits
        if (/^4/.test(newVal)) {
            // Visa
            this.maskCardNumber = '#### #### #### ####';
        } else if (/^5[1-5]/.test(newVal)) {
            // Mastercard
            this.maskCardNumber = '#### #### #### ####';
        } else if (/^3[47]/.test(newVal)) {
            // American Express (Amex)
            this.maskCardNumber = '#### ###### #####';
            limitCVV = '4'
        } else {
            this.maskCardNumber = '#### #### #### ####';
        }
        this.limitCVV = limitCVV
        this.cvv = ''

        this.validateCreditCard(newVal)
        
        
    },
    cvv(newVal: string) {
        this.validateCvv(newVal)
    },
    year(newVal: string) {
        const year = parseFloat(newVal)
        var yearNow = this.yearNow
        var limitYear = yearNow+ 5 ;
        if(year < yearNow ){
            this.error.expirationDate = 'Minimo año actual en adelante'
        }else if(year > limitYear){
            this.error.expirationDate = 'Máximo 5 años del año actual.'
        }else {
            this.error.expirationDate = ''
        }
    },
    month(newVal: string) {
        if (!this.validateMonth(newVal)) {

            this.error.expirationDate = `${newVal} no es un mes válido.`
            return false
        }

        this.error.expirationDate = ''
    },
    email(newVal: string){
        if(!this.isEmail(newVal)){
           this.error.email = 'El correo electronico es incorrecto'
        }else{
           this.error.email = ''
        }
    }
  },
  computed: {
    years () {
        const currentYear = this.yearNow;

        const years = [];
        for (let i = currentYear - 5; i <= currentYear + 10; i++) {
            let numberYear = i.toString();
            years.push({ id: numberYear, value: numberYear.slice(2,4) });

        }
        
        return years
    }
  }
})
</script>
<template>
    <div class="pt-10 justify-self-center self-center">
        <div class="max-w-md mx-auto p-6 bg-white shadow-md rounded-lg" v-if="template == 1">
            <h1 class="text-xl font-semibold mb-4 justify-items-center">Solicitar Pago</h1>
            <form @submit.prevent="submit">
                <div class="mb-4" :class="{ 'text-red-700': error.card_number}">
                    <label for="cardNumber" class="block text-sm font-medium" >Número de Tarjeta</label>
                    <input v-model="cardNumber" v-mask="maskCardNumber" type="text" id="cardNumber" class="form-input border rounded p-2 w-full" placeholder="4111 1111 1111 1111" required>                    
                    <p v-if="error.card_number">{{  error.card_number  }}</p>
                </div>
                
                <div class="columns-2">
                    <div class="mb-4" :class="{ 'text-red-700': error.expirationDate}">
                        <label for="expirationDate" class="block text-sm font-medium">Vencimiento</label>
                        <div class="flex space-x-4">
                            <select class="px-4 py-2 border rounded-md" v-model="month" placeholder="12" >
                                <option v-for="(option, index) in months" :key="index" :value="option"> {{ option }}</option>
                            </select>
                            <div class=" h-8 w-4">
                                <div class="text-gray-900 text-center text-2xl">/</div>
                            </div>
                            <select class="px-4 py-2 border rounded-md" v-model="year" placeholder="23">
                                <option v-for="(option, index) in years" :key="index" :value="option.id"> {{ option.value }}</option>
                            </select>
                        </div>

                        <p v-if="error.expirationDate">{{  error.expirationDate  }}</p>
                    </div>
                    <div class="mb-4" :class="{ 'text-red-700': error.cvv}">
                        <label for="cvv" class="block text-sm font-medium">Código de seguridad</label>
                        <input v-model="cvv" v-mask="'####'" :maxlength="limitCVV" type="text" id="cvv" class="form-input border rounded p-2 w-full" placeholder="123" required>
                        <p v-if="error.cvv">{{  error.cvv  }}</p>
                    </div>
                </div>                
                <div class="mb-4" :class="{ 'text-red-700': error.email}">
                    <label for="email" class="block text-sm font-medium">Correo Electrónico</label>
                    <input v-model="email" type="email" id="email" class="form-input border rounded p-2 w-full" placeholder="ejemplo@correo.com" required>
                    <p v-if="error.email">{{  error.email  }}</p>
                </div>
                <div class="flex items-center justify-center">
                    <button v-if="!loanding" :disabled="btnDisable" type="submit" class=" w-full text-white px-4 py-2 rounded" :class="{  'bg-purple-400':btnDisable, 'bg-purple-800': !btnDisable }" >
                        Enviar
                    </button>
                    <a v-else  class="bg-purple-400 w-full text-white px-4 py-2 rounded"  >
                        Cargando...
                    </a>
                </div>
            </form>            
        </div>
        <div class="max-w-md mx-auto p-6 bg-white shadow-md rounded-lg" v-else>
            <h1 class="text-xl font-semibold mb-4 justify-items-center">Su token se ha creado con exito!</h1>
            <TokenConfirmation :token="token"/>
            <div class="flex items-center justify-end pt-4">
                <a @click="newToken" class="font-medium text-blue-500 underline hover:text-blue-700" href="#"> Regresar </a>
            </div>
        </div>
    </div>
</template>