import axios from 'axios'
import { BASE_URL } from '.';

async function login(data) {
  return axios({
    url: `${BASE_URL}/login`,
    method: 'post',
    data: data
  })
}

export  {
  login
}
