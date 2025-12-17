import { lazy, Suspense} from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Loader2 } from "lucide-react";

// Lazy load pages for code splitting
const MessagesPage = lazy(() => import("@/pages/MessagesPage").then(module => ({ default: module.MessagesPage })));
const ProfilePage = lazy(() => import("@/pages/ProfilePage").then(module => ({ default: module.ProfilePage })));
const EmployeesPage = lazy(() => import("@/pages/EmployeesPage").then(module => ({ default: module.EmployeesPage })));

// Loading fallback component
function PageLoader() {
  return (
    <div className="flex items-center justify-center min-h-[400px]">
      <div className="text-center space-y-4">
        <Loader2 className="h-8 w-8 animate-spin mx-auto text-primary" />
        <p className="text-sm text-muted-foreground">Loading...</p>
      </div>
    </div>
  );
}

function App() {

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<DashboardLayout />}>
          <Route index element={<Navigate to="/messages" replace />} />
          <Route 
            path="messages" 
            element={
              <Suspense fallback={<PageLoader />}>
                <MessagesPage />
              </Suspense>
            } 
          />
          <Route 
            path="profile" 
            element={
              <Suspense fallback={<PageLoader />}>
                <ProfilePage />
              </Suspense>
            } 
          />
          <Route 
            path="employees" 
            element={
              <Suspense fallback={<PageLoader />}>
                <EmployeesPage />
              </Suspense>
            } 
          />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
