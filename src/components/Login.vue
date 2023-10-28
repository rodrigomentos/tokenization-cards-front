<script lang="ts">
import { defineComponent } from 'vue';
import LoginErrorMessage from "../models/LoginErrorMessage";
import Login from "../models/Login";
import { toast } from 'vue3-toastify';
import { useRouter } from 'vue-router';
import AuthenticationService from '../services/AuthenticationService';

export default defineComponent({
  data() {
    return {
        router: useRouter(),
        form: new Login(),
        error: new LoginErrorMessage(),
        username: 'Rodrigo',
        password: 'Rodrigo2023.',
        btnDisable: false,
        loanding: false,
    }
  },
  created(){
    
  },
  methods: {
    async submit(){
        if(!this.username){
            this.error.username = 'El usuario es requerido.'
            return false
        }
        if(!this.password){
            this.error.password = 'La contraseña es requerido.'
            return false
        }
        this.loanding = true

        this.form.username = this.username
        this.form.password = this.password

        try {
            await AuthenticationService.login(this.form)
            
            this.router.push({ name: 'CreateCard' });
            toast.success( 'Ha iniciado de session exitosamente!');             
            this.loanding = false
        }catch(error: any){
            this.loanding = false
            toast.error( error?.toString()); 
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
  },
  watch: {
    error: {
        handler: function(v) {
            this.btnDisable = this.validateError(v)
        },
        deep : true
    },
    username(newVal: string){
        if(newVal && newVal.toString().length <= 5){
           this.error.username = 'No cumple con la longitud de caracteres de un usuario.'
        }else{
           this.error.username = ''
        }
    },
    password(newVal: string){
        if(newVal && newVal.toString().length <= 5){
           this.error.password = 'No cumple con la longitud de caracteres de una contraseña.'
        }else{
           this.error.password = ''
        }
    }
  },
  
})
</script>

<template>
    <div class="flex grid justify-items-stretch">
    <div class="pt-10 justify-self-center self-center">
        <div class="bg-white p-8 rounded shadow-md w-80">
            <h2 class="text-2xl font-semibold mb-4">Ingresar al sistema</h2>
            <!-- Login Form -->
            <form  @submit.prevent="submit">
                <div class="mb-4" :class="{ 'text-red-700': error.username}">
                    <label for="username" class="block text-sm font-medium">Usuario</label>
                    <input type="text" v-model="username" id="username" name="username" class="mt-1 p-2 w-full border rounded" placeholder="Ingresar un suario" required>
                    <p v-if="error.username">{{  error.username  }}</p>
                </div>
                <div class="mb-4" :class="{ 'text-red-700': error.password}">
                    <label for="password" class="block text-sm font-medium">Contraseña</label>
                    <input type="password" v-model="password" id="password" name="password" class="mt-1 p-2 w-full border rounded" placeholder="Ingresar una contraseña" required>
                    <p v-if="error.password">{{  error.password  }}</p>
                </div>
                <div class="flex items-center justify-end">
                    <button v-if="!loanding" :disabled="btnDisable" type="submit" class="text-white px-4 py-2 rounded" :class="{  'bg-purple-400':btnDisable, 'bg-purple-800': !btnDisable }">Ingresar</button>
                    <a v-else  class="bg-purple-400 text-white px-4 py-2 rounded"  >
                        Cargando...
                    </a>
                </div>
            </form>
        </div>
    </div>
</div>
</template>