import axios from 'axios';

const instance = axios.create({
  baseURL: 'https://monorail.proxy.rlwy.net:13277',
  // No validar SSL - Solo para pruebas
  httpsAgent: new https.Agent({  
    rejectUnauthorized: false
  })
});

export default instance;
