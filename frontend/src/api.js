import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:3001';

const client = axios.create({
	baseURL: API_BASE,
	headers: { 'Content-Type': 'application/json' }
});

export async function getNotes() {
	const res = await client.get('/notes');
	if (!res.data?.success) throw new Error(res.data?.message || 'Failed');
	return res.data.data || [];
}

export async function createNote(payload) {
	const res = await client.post('/notes', payload);
	if (!res.data?.success) throw new Error(res.data?.message || 'Failed');
	return res.data.data;
}

export async function updateNote(id, payload) {
	const res = await client.put(`/notes/${id}`, payload);
	if (!res.data?.success) throw new Error(res.data?.message || 'Failed');
	return res.data.data;
}

export async function deleteNote(id) {
	const res = await client.delete(`/notes/${id}`);
	if (!res.data?.success) throw new Error(res.data?.message || 'Failed');
	return true;
}
