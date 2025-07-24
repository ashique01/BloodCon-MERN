import { Routes, Route } from 'react-router-dom';
import HomePage from '../pages/HomePage';
import LoginPage from '../pages/LoginPage';
import RegisterPage from '../pages/RegisterPage';
import DashboardPage from '../pages/DashboardPage';
import AdminPanelPage from '../pages/AdminPanelPage';
import BloodRequestPage from '../pages/BloodRequestPage';
import DonationHistoryPage from '../pages/DonationHistoryPage';
import AddDonationPage from '../pages/AddDonationPage';
import DonorsPage from '../pages/DonorsPage';
import RequestBloodForSomeoneElsePage from '../pages/RequestBloodForSomeoneElsePage';
import RecentBloodRequestsPage from '../pages/RecentBloodRequestsPage';
import DonorDetailsPage from '../pages/DonorDetailsPage'; // Import the new DonorDetailsPage
import ProtectedRoute from '../components/ProtectedRoute';

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      
      {/* Protected Donor Routes */}
      <Route
        path="/donors"
        element={
          <ProtectedRoute>
            <DonorsPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/donors/:id"
        element={
          <ProtectedRoute>
            <DonorDetailsPage />
          </ProtectedRoute>
        }
      />

      <Route path="/recent-requests" element={<RecentBloodRequestsPage />} />
      
      {/* Other Protected Routes */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <DashboardPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin"
        element={
          <ProtectedRoute adminOnly>
            <AdminPanelPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/request-blood"
        element={
          <ProtectedRoute>
            <BloodRequestPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/donation-history"
        element={
          <ProtectedRoute>
            <DonationHistoryPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/add-donation"
        element={
          <ProtectedRoute>
            <AddDonationPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/request-blood-for-someone-else"
        element={
          <ProtectedRoute>
            <RequestBloodForSomeoneElsePage />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
};

export default AppRoutes;
