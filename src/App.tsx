import { Routes, Route, Navigate } from "react-router";
import { LoginForm } from "./components/LoginForm";
import { Dashboard } from "./components/Dashboard";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { AuthService } from "./lib/services/auth";

function App() {
  return (
    <div className="min-h-screen bg-background">
      <Routes>
        <Route 
          path="/" 
          element={
            AuthService.isAuthenticated() ? 
            <Navigate to="/dashboard" replace /> : 
            <Navigate to="/login" replace />
          } 
        />

        <Route 
          path="/login" 
          element={
            <div className="flex items-center justify-center min-h-screen p-4">
              <div className="w-full max-w-md">
                <LoginForm />
              </div>
            </div>
          } 
        />

        <Route 
          path="/dashboard" 
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          } 
        />

        <Route 
          path="*" 
          element={<Navigate to="/" replace />} 
        />
      </Routes>
    </div>
  );
}

export default App;
