
import  axios from 'axios';
const apideezer = axios.create({
    baseURL:"https://deezerdevs-deezer.p.rapidapi.com/search",
    params: {q: 'calvin harris'},
    headers:{
      'x-rapidapi-host': 'deezerdevs-deezer.p.rapidapi.com',
      'x-rapidapi-key': 'Aqui vai sua chave'
    }
});

export default apideezer;
