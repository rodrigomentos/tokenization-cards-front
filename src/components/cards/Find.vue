<script lang="ts">
import { defineComponent } from 'vue';

import { toast } from 'vue3-toastify';
import CardService from "../../services/CardService";
import { ICardInfoResponse } from '../interfaces/ICardInfoResponse';
import moment from 'moment';

export default defineComponent({
  data() {
    return {
        token: '',
        loanding: false,
        infoCard:  Object as ICardInfoResponse,
        cardService: new CardService(),
    }
  },
  methods: {
    async searchToken(){
        // this.card = {}
        
        try {
            this.loanding = true
            const card  = await this.cardService.getCardByToken(this.token)

            this.infoCard = card
            this.loanding = false

        }catch(error: any){
            this.infoCard = undefined
            this.loanding = false
            toast.error( error?.toString()); 
        }
        
    },
  },
  computed: {
    formatDate(): string {
      if(this.infoCard?.createdAt){
        return moment(this.infoCard?.createdAt).format('DD/MM/YYYY h:mm:ss a');
      }
        return ''
    },
  },
  
})
</script>
<template>
    <div class="pt-10 justify-self-center self-center">
        
        <div class="full-width  mx-auto p-6 bg-white shadow-md rounded-lg" >
            <h1 class="text-xl font-semibold mb-4 justify-items-center">Enviar Token</h1>
            <div class="columns-2">
                <div class="flex space-x-2">
                    <input
                    ref="token"
                    type="text"
                    placeholder="Buscar tarjeta por token"
                    class="form-input border rounded p-2 w-full"
                    v-model="token"
                    />
                    <button v-if="loanding" class="bg-purple-400 text-white px-4 py-2 rounded" >
                        Enviando...
                    </button>
                    <button v-else :disabled="!token" @click="searchToken" class="text-white px-4 py-2 rounded" :class="{  'bg-purple-400':!token, 'bg-purple-800': token }">
                        Enviar
                    </button>
                </div>
            </div>
            <div class="overflow-x-auto pt-8">
                <table class="min-w-full divide-y divide-gray-200">
                    <thead>
                    <tr>
                        <th class="px-6 py-3 bg-gray-50 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
                        #                           
                        </th>  
                        <th class="px-6 py-3 bg-gray-50 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
                        Token                           
                        </th>                     
                        <th class="px-6 py-3 bg-gray-50 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
                        Correo Electrónico
                        </th>
                        <th class="px-6 py-3 bg-gray-50 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
                        Tarjeta
                        </th>
                        <th class="px-6 py-3 bg-gray-50 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
                        Fecha y Hora
                        </th>
                    </tr>
                    </thead>
                    <tbody class="bg-white divide-y divide-gray-200" v-if="infoCard?.token">
                        <tr>
                            <td class="px-6 py-4 whitespace-no-wrap">
                                1
                            </td>
                            <td class="px-6 py-4 whitespace-no-wrap">
                                {{  infoCard?.token }}
                            </td>
                            <td class="px-6 py-4 whitespace-no-wrap">
                                {{  infoCard?.email }}
                            </td>
                            <td class="px-6 py-4 whitespace-no-wrap">
                                {{  infoCard?.card_number }}
                            </td>
                            <td class="px-6 py-4 whitespace-no-wrap">
                                {{ formatDate }}
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    </div>
</template>