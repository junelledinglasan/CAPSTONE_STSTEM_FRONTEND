import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider }    from "./context/AuthContext";
import ProtectedRoute      from "./components/ProtectedRoute";

// Layouts
import AdminLayout         from "./layouts/AdminLayout";
import StaffLayout         from "./layouts/StaffLayout";
import MemberLayout        from "./layouts/MemberLayout";

// Public pages
import LandingPage         from "./pages/LandingPage";
import AdminLogin          from "./pages/AdminLogin";
import MemberLogin         from "./pages/MemberLogin";
import MemberRegister      from "./pages/MemberRegister";

// Admin components
import Dashboard           from "./components/admin/Dashboard";
import ManageMember        from "./components/admin/ManageMember";
import ManageStaff         from "./components/admin/ManageStaff";
import OnlineApplications  from "./components/admin/OnlineApplications";
import LoanApproval        from "./components/admin/LoanApproval";
import LoanPayment         from "./components/admin/LoanPayment";
import Announcement        from "./components/admin/Announcement";
import Reports             from "./components/admin/Reports";

// Staff components
import StaffHome           from "./components/staff/StaffHome";

// Member components
import MemberDashboard     from "./components/member/MemberDashboard";
import MyLoans             from "./components/member/MyLoans";
import Notifications       from "./components/member/Notifications";
import MemberAnnouncements from "./components/member/MemberAnnouncements";
import LoanApplication     from "./components/member/LoanApplication";
import MemberProfile       from "./components/member/MemberProfile";
import ApplyMembership     from "./components/member/ApplyMembership";

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>

          {/* ── Public Pages ── */}
          <Route path="/"            element={<LandingPage />}    />
          <Route path="/login"       element={<MemberLogin />}    />
          <Route path="/admin-login" element={<AdminLogin />}     />
          <Route path="/register"    element={<MemberRegister />} />

          {/* ── Admin Routes ── */}
          <Route
            path="/admin"
            element={
              <ProtectedRoute allowedRoles={["admin"]} loginPath="/admin-login">
                <AdminLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<Navigate to="dashboard" replace />} />
            <Route path="dashboard"     element={<Dashboard />} />
            <Route path="members"       element={<ManageMember />} />
            <Route path="staff"         element={<ManageStaff />} />
            <Route path="applications"  element={<OnlineApplications />} />
            <Route path="loan-approval" element={<LoanApproval />} />
            <Route path="loan-payment"  element={<LoanPayment />} />
            <Route path="announcement"  element={<Announcement />} />
            <Route path="reports"       element={<Reports />} />
          </Route>

          {/* ── Staff Routes ── */}
          <Route
            path="/staff"
            element={
              <ProtectedRoute allowedRoles={["staff"]} loginPath="/admin-login">
                <StaffLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<Navigate to="home" replace />} />
            <Route path="home"          element={<StaffHome />} />
            <Route path="members"       element={<ManageMember />} />
            <Route path="applications"  element={<OnlineApplications />} />
            <Route path="loan-approval" element={<LoanApproval />} />
            <Route path="loan-payment"  element={<LoanPayment />} />
            <Route path="announcement"  element={<Announcement />} />
          </Route>

          {/* ── Member Routes ── */}
          <Route
            path="/member"
            element={
              <ProtectedRoute allowedRoles={["member"]} loginPath="/login">
                <MemberLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<Navigate to="dashboard" replace />} />
            <Route path="dashboard"        element={<MemberDashboard />} />
            <Route path="my-loans"         element={<MyLoans />} />
            <Route path="notifications"    element={<Notifications />} />
            <Route path="announcements"    element={<MemberAnnouncements />} />
            <Route path="apply"            element={<LoanApplication />} />
            <Route path="profile"          element={<MemberProfile />} />
            <Route path="apply-membership" element={<ApplyMembership />} />
          </Route>

          {/* Catch all → Landing Page */}
          <Route path="*" element={<Navigate to="/" replace />} />

        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}