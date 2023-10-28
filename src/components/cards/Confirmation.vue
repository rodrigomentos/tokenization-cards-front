<script lang="ts">
import { defineComponent, PropType } from 'vue';


export default defineComponent({
  name: 'TokenConfirmation',
  props: {
    token: {
      type: String as PropType<string>, 
      required: true
    },
  },
  setup(props) {

    const copyText = ()=> {
        const textArea = document.createElement("textarea");
        textArea.value = props.token.toString()
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand("copy");
        document.body.removeChild(textArea)
    }

    return {
      token: props.token, copyText,
    };
  },
});
</script>


<template>
    <div class="flex space-x-2">
    <input
      ref="token"
      type="text"
      class="form-input border rounded p-2 w-full"
      v-model="token"
    />
    <button @click="copyText" class="bg-purple-800 text-white px-4 py-2 rounded">
        Copiar
    </button>
  </div>
</template>