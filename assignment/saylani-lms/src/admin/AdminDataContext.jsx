import { createContext, useCallback, useContext, useMemo, useState } from "react";
import {
  STUDENTS,
  COURSES,
  TRAINERS,
  QUIZZES,
  QUIZ_RESULTS,
} from "../data/adminData";

const AdminDataContext = createContext(null);

let idSeq = 100000;
const newId = () => `local_${(idSeq++).toString(16)}`;

export function AdminDataProvider({ children }) {
  const [students, setStudents] = useState(STUDENTS);
  const [courses, setCourses] = useState(COURSES);
  const [trainers, setTrainers] = useState(TRAINERS);
  const [quizzes, setQuizzes] = useState(QUIZZES);
  const [quizResults, setQuizResults] = useState(QUIZ_RESULTS);

  const makeCrud = useCallback(
    (setter) => ({
      add: (record) => setter((list) => [{ _id: newId(), ...record }, ...list]),
      update: (id, patch) =>
        setter((list) => list.map((row) => (row._id === id ? { ...row, ...patch } : row))),
      remove: (id) => setter((list) => list.filter((row) => row._id !== id)),
    }),
    [],
  );

  const value = useMemo(
    () => ({
      students,
      courses,
      trainers,
      quizzes,
      quizResults,
      studentCrud: makeCrud(setStudents),
      courseCrud: makeCrud(setCourses),
      trainerCrud: makeCrud(setTrainers),
      quizCrud: makeCrud(setQuizzes),
      quizResultCrud: makeCrud(setQuizResults),
    }),
    [students, courses, trainers, quizzes, quizResults, makeCrud],
  );

  return <AdminDataContext.Provider value={value}>{children}</AdminDataContext.Provider>;
}

export function useAdminData() {
  const ctx = useContext(AdminDataContext);
  if (!ctx) throw new Error("useAdminData must be used within AdminDataProvider");
  return ctx;
}
