import { api } from '../boot/axios.js'

export const saveNewMeeting = (obj) =>
	api.post('/meetings', {
		headers: {
			'Content-Type': 'application/json',
		},
		body: { obj },
	})

export const fetchMeetings = (room) =>
	api.get('/meetings', {
		headers: {
			'Content-Type': 'application/json',
		},
		params: { room },
	})

export const updateMeeting = (meeting) =>
	api.put('/meetings', {
		headers: {
			'Content-Type': 'application/json',
		},
		body: { meeting },
	})

export const deleteMeeting = (id) =>
	api.delete('/meetings', {
		headers: {
			'Content-Type': 'application/json',
		},
		params: { id },
	})

export const getByEmail = (email) =>
	api.get('/get-by-email', {
		headers: {
			'Content-Type': 'application/json',
		},
		params: { email },
	})

export default fetchMeetings
