import axios, { AxiosError } from 'axios';


// Create axios instance.
const signinAxiosInstance = axios.create({
    baseURL: 'https://signin.ellpo.ru',
    withCredentials: true
});


export default signinAxiosInstance;