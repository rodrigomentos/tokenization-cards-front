<script setup lang="ts">
import Header from './components/Header.vue'
import 'vue3-toastify/dist/index.css';
import auth from './router/auth';


</script>

<template>
  <div class="bg-gray-100 h-screen">
      <Header v-if="auth.isLoggedIn"/>
      <div class="container mx-auto">
          <router-view/>
    </div>
      
  </div>
</template>
