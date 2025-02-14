import {api} from '../boot/axios.js';

export const fetchMeetings = (room) => api.get('/meetings', {
    headers: {
      'Content-Type': 'application/json',
    },
    params: {room}
  });

  export const saveAllData = (obj) => api.post('/meetings', {
    headers: {
      'Content-Type': 'application/json',
    },
    body: {obj}
  });

  export const getByEmail = (email) => api.get('/get-by-email', {
    headers: {
      'Content-Type': 'application/json',
    },
    params: {email}
  });

  export default fetchMeetings
