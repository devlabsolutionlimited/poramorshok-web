import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from './contexts/AuthContext';
import { AdminProvider } from './contexts/AdminContext';
import { ThemeProvider } from './components/theme/ThemeProvider';
import { LanguageProvider } from './contexts/LanguageContext';
import AppRoutes from './routes';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      staleTime: 1000 * 60 * 5, // 5 minutes
      refetchOnWindowFocus: false,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <ThemeProvider defaultTheme="system" storageKey="app-theme">
          <LanguageProvider>
            <AuthProvider>
              <AdminProvider>
                <div className="min-h-screen flex flex-col bg-background text-foreground">
                  <Navbar />
                  <main className="flex-grow">
                    <AppRoutes />
                  </main>
                  <Footer />
                </div>
              </AdminProvider>
            </AuthProvider>
          </LanguageProvider>
        </ThemeProvider>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;