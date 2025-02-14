import {api} from '../boot/axios.js';

export const authUser = (obj) => api.post('/login', {
  headers: {
    'Content-Type': 'application/json',
  },
  body: obj
});

  export const createUser = (obj) => api.post('/register', {
    headers: {
      'Content-Type': 'application/json',
    },
    body: obj
  });

  export default authUser
