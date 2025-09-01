const API = (() => {
  const base = ''; // même origine (http://localhost:4000)
  const key = 'auth_token';
  const userKey = 'auth_user';

  const getToken = () => localStorage.getItem(key);
  const setToken = (t) => localStorage.setItem(key, t);
  const clearToken = () => localStorage.removeItem(key);

  const getUser = () => {
    try { return JSON.parse(localStorage.getItem(userKey) || 'null'); } catch { return null; }
  };
  const setUser = (u) => localStorage.setItem(userKey, JSON.stringify(u));
  const clearUser = () => localStorage.removeItem(userKey);

  async function request(path, { method='GET', body, auth=false } = {}) {
    const headers = { 'Content-Type': 'application/json' };
    if (auth) {
      const t = getToken();
      if (t) headers['Authorization'] = `Bearer ${t}`;
    }
    const res = await fetch(`${base}/api${path}`, { method, headers, body: body ? JSON.stringify(body) : undefined });
    if (!res.ok) {
      let msg = 'Erreur';
      try { const j = await res.json(); msg = j.message || msg; } catch {}
      throw new Error(msg);
    }
    return res.json();
  }

  return {
    auth: {
      me: () => request('/auth/me', { auth: true }),
      login: (email, password) => request('/auth/login', { method: 'POST', body: { email, password } }),
      register: (name, email, password) => request('/auth/register', { method: 'POST', body: { name, email, password } }),
      setToken, getToken, clearToken, setUser, getUser, clearUser
    },
    stats: () => request('/stats'),
    courses: {
      list: (q, category) => request(`/courses${q || category ? `?${new URLSearchParams({ q: q||'', category: category||'' })}`:''}`),
      one: (id) => request(`/courses/${id}`),
      create: (payload) => request('/courses', { method: 'POST', body: payload, auth: true }),
      remove: (id) => request(`/courses/${id}`, { method: 'DELETE', auth: true }),
      enroll: (id) => request(`/courses/${id}/enroll`, { method: 'POST', auth: true })
    },
    qcm: {
      categories: () => request('/qcm/categories'),
      questions: (categoryId, limit) => request(`/qcm/categories/${categoryId}/questions${limit?`?limit=${limit}`:''}`),
    },
    messages: {
      send: (name, email, message) => request('/messages', { method: 'POST', body: { name, email, message } })
    }
  };
})();
