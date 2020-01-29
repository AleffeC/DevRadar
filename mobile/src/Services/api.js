import axios from 'axios';

const api = axios.create({
    baseURL: 'http://10.0.2.2:3333', // endereço do expo com a porta da criada na API(3333) no estou usando emulador do android então devo usar localhost ou 10.0.2.2
});

export default api;