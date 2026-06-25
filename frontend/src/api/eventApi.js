import api from './axiosInstance';

export const fetchEvents    = ()         => api.get('/api/events');
export const createEvent    = (data)     => api.post('/api/events', data);
export const updateEvent    = (id, data) => api.put(`/api/events/${id}`, data);
export const removeEvent    = (id)       => api.delete(`/api/events/${id}`);
