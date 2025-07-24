import { BrowserRouter, useLocation } from 'react-router-dom';
import AppRoutes from "./appRoutes/AppRoutes";
import Navbar from "./components/Navbar";
import { AuthProvider } from "./contexts/AuthContext";
import Footer from './components/Footer';
import { ToastContainer } from 'react-toastify';
import { ThemeProvider } from './contexts/ThemeContext';

function App() {
  return (
    <AuthProvider>
      <ThemeProvider>
        <BrowserRouter>
          <AppContent />
        </BrowserRouter>
      </ThemeProvider>
    </AuthProvider>
  );
}

function AppContent() {
  const location = useLocation();
  const showNavbar = !location.pathname.startsWith('/admin');
  const showFooter = !location.pathname.startsWith('/admin');

  return (
    <div className="flex flex-col min-h-screen">
      {showNavbar && <Navbar />}
      <main className="flex-grow">
        <AppRoutes />
        <ToastContainer position="bottom-right" autoClose={5000} hideProgressBar={false} />
      </main>
      {showFooter && <Footer />}
    </div>
  );
}

export default App;
