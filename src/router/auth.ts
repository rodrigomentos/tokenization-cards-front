import { reactive } from 'vue';
import Authentication from '../models/Authentication'
const authentication = new Authentication();

const state = reactive({
  isLoggedIn: (authentication.accessToken)?true: false,
});

export default state;