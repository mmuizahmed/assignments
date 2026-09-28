import { Navigate, Route, Routes, useLocation, useNavigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { consumeIntendedRoute, saveIntendedRoute, useApp } from "./context/AppContext";
import { useTheme } from "./context/ThemeContext";
import { StudentLayout } from "./layouts/StudentLayout";
import { TrainerLayout } from "./layouts/TrainerLayout";
import { BootSpinner } from "./components/ui";
import { ForgotPassword, ResetPassword, StudentLogin, TrainerLogin } from "./pages/public/AuthPages";
import {
  StudentAssignment,
  StudentAttendance,
  StudentCourses,
  StudentDashboard,
  StudentFee,
  StudentProfile,
  StudentProgress,
  StudentQuiz,
} from "./pages/student/StudentPages";
import {
  AssignmentSubmissions,
  QuizQuestions,
  QuizResults,
  SlotShell,
  TrainerAttendance,
  TrainerCalendar,
  TrainerDashboard,
  TrainerProfile,
  TrainerStudentDetail,
} from "./pages/trainer/TrainerPages";
import { lazy, Suspense, useEffect } from "react";

const AdminRoutes = lazy(() => import("./admin/AdminRoutes"));

function homeFor(role) {
  if (role === "trainer") return "/trainer";
  if (role === "admin") return "/admin";
  return "/courses";
}

function Guard({ allowedRoles, children }) {
  const { user, loader } = useApp();
  const location = useLocation();
  if (loader) return null;
  if (!user) {
    saveIntendedRoute(location.pathname + location.search);
    return <Navigate to="/login" replace />;
  }
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to={homeFor(user.role)} replace />;
  }
  return children;
}

export default function App() {
  const { user, loader, booting } = useApp();
  const { theme } = useTheme();
  const location = useLocation();
  const dark = theme === "dark";

  const navigate = useNavigate();

  useEffect(() => {
    if (user && !loader) {
      const intended = consumeIntendedRoute();
      if (
        intended &&
        intended !== location.pathname &&
        (location.pathname === "/login" || location.pathname === "/trainer/login")
      ) {
        navigate(intended, { replace: true });
      }
    }
  }, [user, loader, location.pathname, navigate]);

  if (booting) return <BootSpinner />;

  return (
    <>
      <Routes>
        <Route
          path="/login"
          element={user ? <Navigate to={user.role === "admin" ? "/admin" : user.role === "trainer" ? "/trainer" : "/"} replace /> : <StudentLogin />}
        />
        <Route
          path="/trainer/login"
          element={user ? <Navigate to={user.role === "admin" ? "/admin" : user.role === "trainer" ? "/trainer" : "/"} replace /> : <TrainerLogin />}
        />
        <Route path="/trainer/login/reset-password" element={<ForgotPassword />} />
        <Route path="/trainer/login/reset-password/:token" element={<ResetPassword />} />
        <Route
          element={
            <Guard>
              <StudentLayout />
            </Guard>
          }
        >
          <Route path="/dashboard/:slotId" element={<StudentDashboard />} />
          <Route path="/attendance/:slotId" element={<StudentAttendance />} />
          <Route path="/courses" element={<StudentCourses />} />
          <Route path="/progress/:slotId/:id" element={<StudentProgress />} />
          <Route path="/fee/:slotId" element={<StudentFee />} />
          <Route path="/quiz/:slotId" element={<StudentQuiz />} />
          <Route path="/profile" element={<StudentProfile />} />
          <Route path="/assignment/:slotId" element={<StudentAssignment />} />
        </Route>
        <Route
          element={
            <Guard allowedRoles={["trainer"]}>
              <TrainerLayout />
            </Guard>
          }
        >
          <Route path="/trainer" element={<TrainerDashboard />} />
          <Route path="/trainer/attendance" element={<TrainerAttendance />} />
          <Route path="/trainer/profile" element={<TrainerProfile />} />
          <Route path="/trainer/calendar" element={<TrainerCalendar />} />
          <Route path="/trainer/:id/:tabName" element={<SlotShell />} />
          <Route path="/trainer/:id/:tabName/result/:quizId" element={<QuizResults />} />
          <Route path="/trainer/:id/:tabName/questions/:quizId" element={<QuizQuestions />} />
          <Route path="/trainer/:id/:tabName/student/:roll_number" element={<TrainerStudentDetail />} />
          <Route path="/trainer/:id/:tabName/:assignmentId" element={<AssignmentSubmissions />} />
        </Route>
        <Route
          path="/admin/*"
          element={
            <Guard allowedRoles={["admin"]}>
              <Suspense fallback={<BootSpinner />}>
                <AdminRoutes />
              </Suspense>
            </Guard>
          }
        />
        <Route
          path="*"
          element={<Navigate to={user ? homeFor(user.role) : "/login"} replace />}
        />
      </Routes>
      <Toaster
        position="top-center"
        toastOptions={{
          style: {
            background: dark ? "#2a2a2a" : "#ffffff",
            color: dark ? "#f3f4f6" : "#111827",
            border: `1px solid ${dark ? "#3a3a3a" : "#e5e7eb"}`,
            borderRadius: "10px",
            fontSize: "14px",
          },
          success: { iconTheme: { primary: "#22c55e", secondary: dark ? "#2a2a2a" : "#ffffff" } },
          error: { iconTheme: { primary: "#ef4444", secondary: dark ? "#2a2a2a" : "#ffffff" } },
        }}
      />
    </>
  );
}
