import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.jsx';
import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      staleTime: 1000 * 60 * 5,
      retry: 1,
      queryFn: async () => {
        try {
          const res = await fetch('/api/auth/me');
          const data = await res.json();
          if (data.error) return null;
          if (!res.ok) {
            throw new Error(data.error || 'Something went wrong!');
          }
          console.log('completely fetched the authUser:', data);
          return data;
        } catch (error) {
          throw new Error(error);
        }
      },
    },
  },
});

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <QueryClientProvider client={queryClient}>
        <App />
      </QueryClientProvider>
    </BrowserRouter>
  </StrictMode>
);
