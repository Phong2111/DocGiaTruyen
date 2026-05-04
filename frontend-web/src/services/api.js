const BASE_URL = '/api';

const getAuthHeader = () => {
  const token = localStorage.getItem('token');
  return token ? { 'Authorization': `Bearer ${token}` } : {};
};

const handleResponse = async (response) => {
  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.message || `HTTP error! status: ${response.status}`);
  }
  const contentType = response.headers.get('content-type');
  if (contentType && contentType.indexOf('application/json') !== -1) {
    const data = await response.json();
    return { data };
  }
  return { data: null };
};

const formatUrl = (url) => {
  if (url.startsWith('/api')) return url;
  return `${BASE_URL}${url.startsWith('/') ? url : '/' + url}`;
};

const api = {
  get: async (url) => {
    const response = await fetch(formatUrl(url), {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeader()
      }
    });
    return handleResponse(response);
  },
  
  post: async (url, data) => {
    const response = await fetch(formatUrl(url), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeader()
      },
      body: JSON.stringify(data)
    });
    return handleResponse(response);
  },

  put: async (url, data) => {
    const response = await fetch(formatUrl(url), {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeader()
      },
      body: JSON.stringify(data)
    });
    return handleResponse(response);
  },

  delete: async (url) => {
    const response = await fetch(formatUrl(url), {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeader()
      }
    });
    return handleResponse(response);
  },

  postMultipart: async (url, formData) => {
    const response = await fetch(formatUrl(url), {
      method: 'POST',
      headers: {
        // NOTE: Do NOT set Content-Type header when sending FormData,
        // the browser will automatically set it with the correct boundary
        ...getAuthHeader()
      },
      body: formData
    });
    return handleResponse(response);
  }
};

export default api;
