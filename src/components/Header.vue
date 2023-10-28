<script lang="ts">
import { defineComponent  } from 'vue'
import { useRouter } from 'vue-router';
import AuthenticationService from '../services/AuthenticationService';
import Authentication from '../models/Authentication';
import { toast } from 'vue3-toastify';
export default defineComponent({  

  data() {
    return {
      auth: new Authentication(),
      username: 'Rodrigo',
      showDropdown: false,
      router:useRouter()
    }
  },
  mounted() {// type: number
  },
  methods: {
    toggleDropdown(){
        this.showDropdown = !this.showDropdown;
    },
    async logout() {
      try {
            await AuthenticationService.logout()
            toast.success( 'Session cerrada exitosamente!'); 
            this.router.push({ name: 'Login' });
            

        }catch(error: any){
            toast.error( error?.toString()); 
        }
      
    },
  }
})
</script>

<template>
    <nav class="bg-white p-4 flex justify-between items-center">
    <!-- Logo -->
    
    <div class="flex items-center flex-shrink-0 text-black mr-6">
      <img src="https://culqi.com/assets/images/brand/culqi-logo.png?v=1" alt="Logo" class="w-100 h-10 mr-2" />     
    </div>
    <div class="w-full block flex-grow lg:flex lg:items-center lg:w-auto">
      <div class="text-sm flex">
        <router-link to="/" class="block mt-4 lg:inline-block mt-0 text-black hover:text-black mr-4" >Solicitar Pago</router-link>
        <router-link to="/send-token" class="block mt-4 inline-block mt-0 text-black hover:text-black mr-4" >Enviar Token</router-link>
      </div>
    </div>
    <!-- User Info -->
    <div class="flex items-center text-sm mt-4">
      <span class="text-black mr-4 ">{{ auth.userName }}</span>
      <div class="relative">
        <button @click="toggleDropdown" class="focus:outline-none text-black ">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </button>
        
        <!-- Dropdown Menu -->
        <div
          v-if="showDropdown"
            @click="toggleDropdown"
            class=" bg-white absolute right-0 mt-2 py-2 w-48 border border-black-900 rounded-lg shadow-lg"
            >
          <button @click="logout" class="text-black block px-4 py-2  hover:bg-neutral-100 w-full text-left">
            Salir
          </button>
        </div>
      </div>
    </div>
  </nav>
</template>

