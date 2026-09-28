# Saylani LMS clone

Clone of saylani lms and admin panel.

A frontend-only clone of the Saylani / SMIT Learning Management System, covering the **Student**, **Teacher**, and **Admin** experiences. There is no backend and no external API. Authentication is simulated with `localStorage`, and every screen reads from local synthetic JSON datasets under `src/data/`. All names, records, and analytics are fake.

## Run

```bash
npm install
npm start
```

Dev server: **http://localhost:5173**

## Roles and logins

| Role | Path | Credentials |
|------|------|-------------|
| Student | `/login` | CNIC `1234512345671` · password `student` |
| Teacher | `/trainer/login` | `teacher@example.local` / `teacher` |
| Admin | `/login` (admin tab) | `admin@example.local` / `admin1234` |

Sessions are stored in `localStorage` under the key `lms_user`. Theme is controlled by `html.dark` plus `localStorage.theme`.

The student and teacher share one demo course: Modern Web Application Development (WMA), Batch 20, Karachi. The student dashboard lives at `/dashboard/:slotId`; the teacher class at `/trainer/:slotId/students`.

## Sections

- **Student** — courses, dashboard, attendance, course progress, fee vouchers, quizzes, assignments, and profile.
- **Teacher** — class roster, calendar, attendance, assignments, quizzes and results, student progress, and profile.
- **Admin** — dashboard analytics, students, courses, trainers, quizzes, quiz results, and profile, plus a feedback modal and light/dark theme toggle.

## Stack

- Vite + React 18 + react-router-dom 6
- Tailwind CSS 3 (`preflight: false`) with Radix UI primitives and lucide-react for the student/teacher UI
- Ant Design 5 + @ant-design/plots for the admin panel (lazy-loaded, scoped to `.admin-root`)
- react-hook-form, react-hot-toast, react-quill-new

## Notes

This is an educational UI clone built entirely on synthetic data. It never contacts a production server or any remote API.
