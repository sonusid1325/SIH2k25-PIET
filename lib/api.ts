// Define interfaces for the data we'll be sending
interface RegisterUserData {
  name: string;
  email: string;
  password: string;
}

interface LoginCredentials {
  email: string;
  password: string;
}

/**
 * A generic helper function to make API calls to your backend.
 * It automatically adds the base URL and handles errors.
 */
async function fetchApi(endpoint: string, options: RequestInit = {}) {
  // Get the API URL from your environment variables
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  if (!apiUrl) {
    throw new Error("NEXT_PUBLIC_API_URL is not set in your .env.local file.");
  }
  
  const url = `${apiUrl}${endpoint}`;

  const defaultHeaders = {
    'Content-Type': 'application/json',
  };

  // Merge default options with any options passed to the function
  const config: RequestInit = {
    ...options,
    headers: {
      ...defaultHeaders,
      ...options.headers,
    },
    // This is crucial for sending/receiving cookies from the backend
    credentials: 'include', 
  };

  const response = await fetch(url, config);
  const data = await response.json();

  // If the response is not successful, throw an error with the message from the backend
  if (!response.ok) {
    throw new Error(data.message || 'An API error occurred');
  }

  return data;
}

// --- API Functions ---

/**
 * Sends registration data to the /users/register endpoint.
 */
export const registerUser = (userData: RegisterUserData) => {
  return fetchApi('/users/register', {
    method: 'POST',
    body: JSON.stringify(userData),
  });
};

/**
 * Sends login credentials to the /users/login endpoint.
 */
export const loginUser = (credentials: LoginCredentials) => {
  return fetchApi('/users/login', {
    method: 'POST',
    body: JSON.stringify(credentials),
  });
};

/**
 * Fetches the current user's data from the /users/me endpoint.
 * The browser automatically sends the httpOnly cookie.
 */
export const getCurrentUser = () => {
  return fetchApi('/users/me', {
    method: 'GET',
  });
};