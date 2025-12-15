import axios from 'axios';

const API_BASE_URL = 'https://localhost:7295/api';

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Entity operations factory
const createEntityClient = (entityName) => ({
    list: async (sort = '-created_date', limit = 100) => {
        const { data } = await api.get(`/${entityName}?sort=${sort}&limit=${limit}`);
        return data;
    },

    filter: async (filters, sort = '-created_date', limit = 100) => {
        const params = new URLSearchParams();
        Object.entries(filters).forEach(([key, value]) => {
            if (value) params.append(key, value);
        });
        const { data } = await api.get(`/${entityName}/filter?${params.toString()}`);
        return data;
    },

    create: async (entityData) => {
        const { data } = await api.post(`/${entityName}`, entityData);
        return data;
    },

    bulkCreate: async (entitiesData) => {
        const results = await Promise.all(
            entitiesData.map(entity => api.post(`/${entityName}`, entity))
        );
        return results.map(r => r.data);
    },

    update: async (id, entityData) => {
        await api.put(`/${entityName}/${id}`, entityData);
        return { id, ...entityData };
    },

    delete: async (id) => {
        await api.delete(`/${entityName}/${id}`);
        return { id };
    },

    schema: () => {
        // Return schema structure (optional)
        return {};
    }
});

// Main API client
export const apiClient = {
    entities: {
        Release: createEntityClient('releases'),
        Project: createEntityClient('projects'),
        Team: createEntityClient('teams'),
        ReleaseItem: createEntityClient('releaseitems'),
        User: createEntityClient('users'),
    },

    auth: {
        me: async () => {
            // Mock user for now - implement your auth logic
            return {
                id: '1',
                email: 'admin@example.com',
                full_name: 'Admin User',
                role: 'admin'
            };
        },

        isAuthenticated: async () => {
            return true;
        },

        updateMe: async (data) => {
            // Implement user update
            return data;
        },

        logout: (redirectUrl) => {
            if (redirectUrl) {
                window.location.href = redirectUrl;
            } else {
                window.location.reload();
            }
        },

        redirectToLogin: (nextUrl) => {
            // Implement login redirect
            window.location.href = '/login';
        }
    },

    integrations: {
        Core: {
            InvokeLLM: async ({ prompt, response_json_schema, add_context_from_internet }) => {
                // For now, return mock response
                // You can integrate with OpenAI API or other LLM services here
                return "This is a mock LLM response. Integrate with your preferred LLM service.";
            },

            SendEmail: async ({ to, subject, body, from_name }) => {
                console.log('Email:', { to, subject, body, from_name });
                return { success: true };
            },

            UploadFile: async ({ file }) => {
                const formData = new FormData();
                formData.append('file', file);
                const { data } = await api.post('/files/upload', formData, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                });
                return data;
            },

            GenerateImage: async ({ prompt, existing_image_urls }) => {
                // Integrate with image generation service
                return { url: 'https://via.placeholder.com/800x600' };
            }
        }
    }
};

export default apiClient;