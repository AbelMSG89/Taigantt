import { Routes, Route, Navigate } from "react-router";
import { LoginForm } from "./components/LoginForm";
import { Dashboard } from "./components/Dashboard";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { AuthService } from "./features/auth/services/auth.service";

function App() {
  return (
    <Routes>
      <Route
        path="/"
        element={
          AuthService.isAuthenticated() ? (
            <Navigate to="/dashboard" replace />
          ) : (
            <Navigate to="/login" replace />
          )
        }
      />

      <Route path="/login" element={<LoginForm />} />

      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
