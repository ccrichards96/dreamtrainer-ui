import apiClient from '../services/api/client';

/**
 * Hook that provides the configured API client
 * The API client is automatically configured with Auth0 tokens via the ApiProvider
 * 
 * @example
 * ```tsx
 * import { useApi } from '../hooks/useApi';
 * 
 * const MyComponent = () => {
 *   const api = useApi();
 *   
 *   const fetchData = async () => {
 *     try {
 *       const response = await api.get('/protected-endpoint');
 *       return response.data;
 *     } catch (error) {
 *       console.error('API error:', error);
 *       throw error;
 *     }
 *   };
 *   
 *   // ... rest of component
 * };
 * ```
 */
export const useApi = () => {
  return apiClient;
};
