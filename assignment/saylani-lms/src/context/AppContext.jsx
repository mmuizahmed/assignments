import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { db, hydrateSessionUser, loginAdmin, loginStudent, loginTrainer, publicUser } from "../data/db";
import { INTENDED_KEY, SESSION_KEY } from "../lib/utils";

const AppContext = createContext(null);

export function AppProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loader, setLoader] = useState(true);
  const [booting, setBooting] = useState(true);
  const [courses, setCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [trainerSlots, setTrainerSlots] = useState([]);
  const [trainerAuth, setTrainerAuth] = useState(null);
  const [assignmentModalOpen, setAssignmentModalOpen] = useState(false);
  const [feePaid, setFeePaid] = useState(true);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(SESSION_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        const hydrated = hydrateSessionUser(parsed);
        setUser(hydrated);
        if (hydrated) localStorage.setItem(SESSION_KEY, JSON.stringify(hydrated));
        if (hydrated?.role === "trainer") {
          setTrainerAuth(hydrated);
          setTrainerSlots(db.trainerSlots);
        } else if (hydrated) {
          setCourses(db.studentCourses);
        }
      }
    } catch {
      localStorage.removeItem(SESSION_KEY);
    } finally {
      setLoader(false);
      setBooting(false);
    }
  }, []);

  const persistUser = useCallback((next) => {
    setUser(next);
    if (next) localStorage.setItem(SESSION_KEY, JSON.stringify(next));
    else localStorage.removeItem(SESSION_KEY);
  }, []);

  const signInStudent = useCallback(
    (payload) => {
      const result = loginStudent(payload);
      if (result.error) return result;
      persistUser(result.user);
      setCourses(db.studentCourses);
      return result;
    },
    [persistUser],
  );

  const signInTrainer = useCallback(
    (payload) => {
      const result = loginTrainer(payload);
      if (result.error) return result;
      persistUser(result.user);
      setTrainerAuth(result.user);
      setTrainerSlots(db.trainerSlots);
      return result;
    },
    [persistUser],
  );

  const signInAdmin = useCallback(
    (payload) => {
      const result = loginAdmin(payload);
      if (result.error) return result;
      persistUser(result.user);
      return result;
    },
    [persistUser],
  );

  const logout = useCallback(() => {
    const theme = localStorage.getItem("theme");
    localStorage.clear();
    if (theme) localStorage.setItem("theme", theme);
    persistUser(null);
    setCourses([]);
    setSelectedCourse(null);
    setSelectedSlot(null);
    setTrainerSlots([]);
    setTrainerAuth(null);
  }, [persistUser]);

  const updateProfile = useCallback(
    (patch) => {
      if (!user) return;
      if (user.role === "trainer") {
        Object.assign(db.teacher, patch);
        const next = { ...publicUser(db.teacher), role: "trainer", isTrainer: true };
        persistUser(next);
        setTrainerAuth(next);
      } else {
        Object.assign(db.student, patch);
        const next = publicUser(db.student);
        persistUser(next);
      }
    },
    [persistUser, user],
  );

  const value = useMemo(
    () => ({
      user,
      loader,
      booting,
      courses,
      setCourses,
      selectedCourse,
      setSelectedCourse,
      selectedSlot,
      setSelectedSlot,
      trainerSlots,
      setTrainerSlots,
      trainerAuth,
      setTrainerAuth,
      assignmentModalOpen,
      setAssignmentModalOpen,
      feePaid,
      setFeePaid,
      signInStudent,
      signInTrainer,
      signInAdmin,
      logout,
      updateProfile,
      persistUser,
    }),
    [
      user,
      loader,
      booting,
      courses,
      selectedCourse,
      selectedSlot,
      trainerSlots,
      trainerAuth,
      assignmentModalOpen,
      feePaid,
      signInStudent,
      signInTrainer,
      signInAdmin,
      logout,
      updateProfile,
      persistUser,
    ],
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used within AppProvider");
  return ctx;
}

export function saveIntendedRoute(path) {
  if (path !== "/login" && path !== "/trainer/login" && path !== "/courses") {
    localStorage.setItem(INTENDED_KEY, path);
  }
}

export function consumeIntendedRoute() {
  const value = localStorage.getItem(INTENDED_KEY);
  localStorage.removeItem(INTENDED_KEY);
  return value;
}
