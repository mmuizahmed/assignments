import { Route, Routes } from "react-router-dom";
import { AdminLayout } from "./AdminLayout";
import { AdminDataProvider } from "./AdminDataContext";
import { Dashboard } from "./pages/Dashboard";
import { Students } from "./pages/Students";
import { Courses } from "./pages/Courses";
import { Trainers } from "./pages/Trainers";
import { Quizzes } from "./pages/Quizzes";
import { QuizResults } from "./pages/QuizResults";
import { Profile } from "./pages/Profile";

export default function AdminRoutes() {
  return (
    <AdminDataProvider>
      <Routes>
        <Route element={<AdminLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="students" element={<Students />} />
          <Route path="courses" element={<Courses />} />
          <Route path="trainers" element={<Trainers />} />
          <Route path="quizzes" element={<Quizzes />} />
          <Route path="quiz-results" element={<QuizResults />} />
          <Route path="profile" element={<Profile />} />
        </Route>
      </Routes>
    </AdminDataProvider>
  );
}
