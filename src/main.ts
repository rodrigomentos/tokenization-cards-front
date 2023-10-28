import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import router from './router';
import auth from './router/auth';
import VueTheMask from 'vue-the-mask';
import Vue3Toastify, { type ToastContainerOptions } from 'vue3-toastify';
import AxiosAuth from './services/Axios';
import refreshToken from './services/RefreshToken';
import { toast } from 'vue3-toastify';

const app = createApp(App)

app.use(router)
app.use(Vue3Toastify, {
    autoClose: 3000,
} as ToastContainerOptions);
app.use(VueTheMask)


AxiosAuth.interceptors.request.use(
(config) => {
    return config;
},
(error) => Promise.reject(error)
);

AxiosAuth.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;
        if (error.response.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;
            try{

                const data = await refreshToken();
                localStorage.setItem('CULQI_DATA', JSON.stringify( data ));
                const newAccessToken = data.accessToken;
                originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
                return AxiosAuth(originalRequest);

            } catch (refreshError) {
                console.log(refreshError);
                
                delete AxiosAuth.defaults.headers.Authorization
                localStorage.removeItem('CULQI_DATA');
                localStorage.removeItem('tokenCommercial');                
                auth.isLoggedIn = false;
                toast.error('Tu session ha expirado');
                router.push({name:'Login'});    
                        
            }
        }
        return Promise.reject(error);
    }
);

app.mount('#app')
