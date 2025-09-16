import { Routes, Route, Navigate } from "react-router";
import { LoginForm } from "./components/views/LoginFormView";
import { Dashboard } from "./components/views/DashboardView";
import { MilestonesView } from "./components/views/MilestonesView";
import { GanttViewPage } from "./components/views/GanttView";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { AuthService } from "./features/auth/services/auth.service";
import { ROUTES } from "@/constants/routes";

function App() {
  return (
    <Routes>
      <Route
        path={ROUTES.HOME}
        element={
          AuthService.isAuthenticated() ? (
            <Navigate to={ROUTES.DASHBOARD} replace />
          ) : (
            <Navigate to={ROUTES.LOGIN} replace />
          )
        }
      />

      <Route path={ROUTES.LOGIN} element={<LoginForm />} />

      <Route
        path={ROUTES.DASHBOARD}
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />

      <Route
        path="/projects/:projectId/milestones"
        element={
          <ProtectedRoute>
            <MilestonesView />
          </ProtectedRoute>
        }
      />

      <Route
        path="/projects/:projectId/milestones/:milestoneId/gantt"
        element={
          <ProtectedRoute>
            <GanttViewPage />
          </ProtectedRoute>
        }
      />

      <Route path="*" element={<Navigate to={ROUTES.HOME} replace />} />
    </Routes>
  );
}

export default App;
