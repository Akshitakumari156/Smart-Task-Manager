import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/login";
import Signup from "./pages/Signup";
import ManagerLayout from "./pages/Manager/ManagerLayout";
import ManagerHome from "./pages/Manager/ManagerHome";
import ManagerTask from "./pages/Manager/ManagerTask";
// import EmployeeLayout from "./pages/Employee/EmployeeLayout";
// import EmployeeHome from "./pages/Employee/EmployeeHome";
// import EmployeeTasks from "./pages/Employee/EmployeeTasks";
import ProtectedRoute from "./pages/ProtectedRoute";
import PublicRoute from "./pages/PublicRoute";
import ManagerProfile from "./pages/Manager/ManagerProfile";
import TeamsSection from "./pages/Manager/TeamsSection";
function App() {
  return (
    <Routes>
      {/* Default redirect */}
      <Route path="/" element={<Navigate to="/login" replace />} />

      {/* Public Routes */}
      <Route
        path="/login"
        element={
          <PublicRoute>
            <Login />
          </PublicRoute>
        }
      />
      <Route
        path="/signup"
        element={
          <PublicRoute>
            <Signup />
          </PublicRoute>
        }
      />

      {/* -------- MANAGER ROUTES -------- */}
      <Route
        element={
          <ProtectedRoute allowedRoles={["manager"]}>
            <ManagerLayout />
          </ProtectedRoute>
        }
      >
        <Route path="/home-manager" element={<ManagerHome />} />
        <Route path="/tasks-manager" element={<ManagerTask />} />
        <Route path="/profile-manager" element={<ManagerProfile/>}/>
        <Route path="/teams" element={<TeamsSection/>}/>
      </Route>

      -------- EMPLOYEE ROUTES --------
      <Route
        element={
          <ProtectedRoute allowedRoles={["employee"]}>
            <EmployeeLayout />
          </ProtectedRoute>
        }
      >
        <Route path="/home-employee" element={<EmployeeHome />} />
        <Route path="/tasks-employee" element={<EmployeeTasks />} />
      </Route>
    </Routes>
  );
}

export default App;
