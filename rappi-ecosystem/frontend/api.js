// Export the base API URL pulled from Vite's environment variables
export const API_BASE = import.meta.env.VITE_API_URL;

// Optional: You can add reusable fetch wrappers here in the future
export const authorizedFetch = async (endpoint, options = {}, userId) => {
    const headers = {
        'Content-Type': 'application/json',
        ...options.headers,
    };
    if (userId) {
        headers['x-user-id'] = userId;
    }

    return fetch(`${API_BASE}${endpoint}`, {
        ...options,
        headers,
    });
};
