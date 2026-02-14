// Check if user is logged in
export const checkAuth = async () => {
  const token = localStorage.getItem('token');
  
  if (!token) {
    return null; // Not logged in
  }

  try {
    const response = await fetch('http://localhost:5001/me', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    if (response.ok) {
      const user = await response.json();
      return user; // User is logged in
    } else {
      localStorage.removeItem('token'); // Invalid token
      return null;
    }
  } catch (error) {
    console.error('Auth check failed:', error);
    return null;
  }
};

// Login function
export const login = async (email, password) => {
  const response = await fetch('http://localhost:5001/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
  });

  const data = await response.json();
  
  if (response.ok) {
    localStorage.setItem('token', data.token);
    return { success: true };
  } else {
    return { success: false, error: data.error };
  }
};

// Signup function
export const signup = async (name, email, password) => {
  const response = await fetch('http://localhost:5001/signup', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, email, password })
  });

  const data = await response.json();
  
  if (response.ok) {
    // Auto-login after signup
    return await login(email, password);
  } else {
    return { success: false, error: data.error };
  }
};

// Logout function
export const logout = () => {
  localStorage.removeItem('token');
  window.location.href = '/login'; // Redirect to login page
};