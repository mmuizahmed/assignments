import inductionRaw from "./student-induction.json";
import progressRaw from "./course-progress.json";
import quizzesRaw from "./quizzes.json";
import paymentsRaw from "./payments.json";
import assignmentsRaw from "./assignments.json";
import classmatesRaw from "./classmates.json";

export const SLOT_ID = "6926fe56c74fda001503ae82";
export const STUDENT_ID = "691b81e913837c0015af3cf1";
export const INDUCTION_ID = "691b81ea13837c0015af3cf3";
export const TRAINER_ID = "68ee12917aa2ba0015ed7453";
export const COURSE_ID = "66c379b6c96ecb0015e4c5b1";
export const NEW_COURSE_ID = "69119a2b289718001534ae87";
export const CAMPUS_ID = "66e1320cb08e700015c2181c";
export const ROLL_NUMBER = "777251";

const SLOT_ALIASES = {
  slot_001: SLOT_ID,
};

export function resolveSlotId(value) {
  const id = String(value || "");
  return SLOT_ALIASES[id] || id;
}

const inductionStudent = inductionRaw.student_induction_list.student_id;
const inductionCourse = inductionRaw.student_induction_list.student_course_list[0];
const classmates = Array.isArray(classmatesRaw) ? classmatesRaw : [];
const rosterCount = 1 + classmates.length;

const teacher = {
  _id: TRAINER_ID,
  email: "teacher@example.local",
  password: "teacher",
  role: "trainer",
  isTrainer: true,
  isTeacher: true,
  employee_id: TRAINER_ID,
  image: "/assets/logo.6lrMPvRL.png",
  description: "<p>Trainer — Modern Web Application Development, Batch 20.</p>",
  phone_number: "",
  social_links: [],
  two_factor_enabled: false,
  en: { trainer_name: inductionCourse.slot.trainer.en.trainer_name },
};

const admin = {
  _id: "admin_0001",
  email: "admin@example.local",
  password: "admin1234",
  role: "admin",
  isAdmin: true,
  full_name: "Admin User",
  name: "Admin User",
  employee_id: "SMIT-ADMIN-01",
  image: "/assets/logo.6lrMPvRL.png",
  phone_number: "",
  designation: "System Administrator",
};

const course = {
  _id: COURSE_ID,
  course_slug: "WMA",
  en: { course_name: inductionCourse.course.en.course_name },
};

const campus = {
  _id: CAMPUS_ID,
  en: { campus_name: inductionCourse.slot.campus.en.campus_name },
  city: {
    _id: inductionCourse.city._id,
    en: { city_name: inductionCourse.city.en.city_name },
  },
};

const newCourse = {
  _id: NEW_COURSE_ID,
  batch_number: inductionCourse.batch_number,
  is_online: false,
  course,
};

const slotActive = {
  _id: SLOT_ID,
  status: inductionCourse.slot.status,
  class_type: inductionCourse.slot.is_online ? "Online" : "Onsite",
  gender: inductionCourse.slot.gender,
  is_online: inductionCourse.slot.is_online,
  enrolled_students: rosterCount,
  dropout_students: 0,
  completion_percentage: progressRaw.course_completion,
  schedule: inductionCourse.slot.schedule,
  start_date: "2025-12-01T09:00:00.000Z",
  campus,
  new_course: newCourse,
  trainer: inductionCourse.slot.trainer,
  whatsapp_link: "",
  capacity: 40,
  booked: rosterCount,
};

const student = {
  _id: STUDENT_ID,
  student_cnic: "1234512345671",
  password: "student",
  role: "student",
  full_name: inductionStudent.full_name,
  name: inductionStudent.full_name,
  father_name: inductionStudent.father_name,
  email: inductionStudent.email,
  image: inductionStudent.image,
  gender: "male",
  contact_number: "03306001126",
  full_address: "Karachi",
  last_qualification: "",
  dob: inductionStudent.date_of_birth,
  date_of_birth: inductionStudent.date_of_birth,
  laptop: inductionCourse.laptop,
  computer_proficiency: inductionCourse.metadata?.computer_proficiency,
};

const studentCourseEnrolled = {
  _id: INDUCTION_ID,
  status: inductionCourse.status,
  createdAt: inductionCourse.createdAt,
  progress_percentage: inductionCourse.progress_percentage,
  course_completion: progressRaw.course_completion,
  roll_number: ROLL_NUMBER,
  batch_number: inductionCourse.batch_number,
  is_sponsored: inductionCourse.is_sponsored,
  has_joined_whatsapp_group: inductionCourse.has_joined_whatsapp_group,
  laptop: inductionCourse.laptop,
  metadata: inductionCourse.metadata,
  course,
  new_course: {
    ...inductionCourse.new_course,
    course,
  },
  slot: {
    _id: SLOT_ID,
    schedule: slotActive.schedule,
    whatsapp_link: slotActive.whatsapp_link,
    status: slotActive.status,
    is_online: slotActive.is_online,
    gender: slotActive.gender,
    campus,
    trainer: inductionCourse.slot.trainer,
  },
  city: inductionCourse.city,
  trainer: inductionCourse.slot.trainer,
};

const studentCourses = [studentCourseEnrolled];

function rosterRow({ _id, full_name, email, image, roll_number, progress_percentage, fee_status }) {
  return {
    student_id: _id,
    student_full_name: full_name,
    student_email: email,
    student_image: image,
    roll_number: String(roll_number),
    status: "enrolled",
    slot_id: SLOT_ID,
    progress_percentage,
    fee_status: fee_status || "paid",
  };
}

const students = [
  rosterRow({
    _id: STUDENT_ID,
    full_name: student.full_name,
    email: student.email,
    image: student.image,
    roll_number: ROLL_NUMBER,
    progress_percentage: inductionCourse.progress_percentage,
    fee_status: "paid",
  }),
  ...classmates.map(rosterRow),
];

function hackathonName(assignment) {
  if (!assignment?.is_hackathon) return "";
  const title = String(assignment.title || "");
  if (/quickserve/i.test(title)) return "QUICKSERVE";
  if (/maintainiq/i.test(title)) return "MaintainIQ";
  if (/helplytics/i.test(title)) return "Helplytics";
  return title;
}

const assignments = (assignmentsRaw.formattedAssignments || []).map(({ assignment }) => ({
  _id: assignment._id,
  slot_id: SLOT_ID,
  course_id: NEW_COURSE_ID,
  title: assignment.title,
  description: assignment.description || "",
  topics: assignment.topics || [],
  links: assignment.links || [],
  images: assignment.images || [],
  submission_date: assignment.submission_date,
  createdAt: assignment.createdAt || assignment.submission_date,
  is_hackathon: !!assignment.is_hackathon,
  hackathon_name: hackathonName(assignment),
  status: assignment.status || "active",
}));

function detailsFor(person) {
  return {
    full_name: person.full_name,
    email: person.email,
    student_id: person._id,
    student_induction: person.induction_id || `ind_${person.roll_number}`,
    roll_number: String(person.roll_number),
    image: person.image,
  };
}

const studentDetails = detailsFor({
  _id: STUDENT_ID,
  full_name: student.full_name,
  email: student.email,
  roll_number: ROLL_NUMBER,
  image: student.image,
  induction_id: INDUCTION_ID,
});

const muizSubmissions = (assignmentsRaw.formattedAssignments || [])
  .filter((row) => row.submission)
  .map(({ assignment, submission }) => ({
    _id: submission._id,
    assignment_id: assignment._id,
    assignment: assignment._id,
    status: submission.status,
    submitted_date: submission.submitted_date,
    text: submission.text || "",
    files: submission.files || [],
    link: submission.link || "",
    marks: submission.marks || 0,
    trainer_feedback: submission.trainer_feedback || "",
    student_id: STUDENT_ID,
    student_details: studentDetails,
  }));

const muizSubmittedIds = new Set(muizSubmissions.map((row) => row.assignment_id));

function slugTitle(title) {
  return String(title || "assignment")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 40);
}

const classmateSubmissions = classmates.flatMap((mate) => {
  const skip = new Set(mate.skip_assignment_indexes || []);
  const late = new Set(mate.late_assignment_indexes || []);
  return assignments
    .map((assignment, index) => {
      if (skip.has(index)) return null;
      if (!muizSubmittedIds.has(assignment._id) && !late.has(index)) return null;
      const isLate = late.has(index);
      return {
        _id: `sub_${mate.roll_number}_${assignment._id.slice(-8)}`,
        assignment_id: assignment._id,
        assignment: assignment._id,
        status: isLate ? "late_submitted" : "approved",
        submitted_date: assignment.submission_date,
        text: `https://github.com/example/${mate.roll_number}/${slugTitle(assignment.title)}`,
        files: [],
        link: "",
        marks: isLate ? 0 : 75 + (index % 15),
        trainer_feedback: isLate ? "Submitted after deadline" : "Good work",
        student_id: mate._id,
        student_details: detailsFor(mate),
      };
    })
    .filter(Boolean);
});

const submissions = [...muizSubmissions, ...classmateSubmissions];
const formattedAssignments = assignments.map((assignment) => ({
  assignment,
  submission: muizSubmissions.find((row) => row.assignment_id === assignment._id) || null,
}));

const assignmentTotals = {
  total_assignments: assignments.length,
  total_submissions: submissions.length,
  approved: submissions.filter((row) => row.status === "approved").length,
  not_approved: submissions.filter((row) => row.status !== "approved").length,
};

const quizSchedules = (quizzesRaw.data || []).map((row) => {
  const quiz = {
    _id: row.quiz_id,
    title: row.title,
    course: [course],
    duration: row.duration,
    passing_percentage: row.passing_percentage,
    total_questions: row.total_questions,
  };
  const percentage = row.total_questions
    ? Math.round((Number(row.score) / Number(row.total_questions)) * 100)
    : null;
  return {
    _id: row.result_id || row.quiz_id,
    quiz,
    quiz_id: row.quiz_id,
    title: row.title,
    date: "2026-01-01T10:00:00.000Z",
    expiry: "2026-01-02T10:00:00.000Z",
    status: row.status,
    slot: row.slot_id || SLOT_ID,
    slot_id: row.slot_id || SLOT_ID,
    module: String(row.module_name || "").trim(),
    module_name: String(row.module_name || "").trim(),
    attempts: row.attempts,
    max_attempts: row.attempts_allowed,
    attempts_allowed: row.attempts_allowed,
    total_questions: row.total_questions,
    passing_percentage: row.passing_percentage,
    duration: row.duration,
    question_attempted: row.question_attempted ?? 0,
    percentage,
    score: row.score,
    time_used: row.time_used,
    special_access: !!row.special_access,
    note: `${row.score}/${row.total_questions} · ${row.time_used} min`,
    actionStatus: row.status === "passed" || row.status === "failed" ? "completed" : "start",
  };
});
const quizAttendanceToday = !!quizzesRaw.isTodayAttendanceMarked;

const quiz = quizSchedules[0]?.quiz || {
  _id: "quiz_placeholder",
  title: "Quiz",
  course: [course],
  duration: 50,
  passing_percentage: 70,
  total_questions: 40,
};

const quizQuestions = [];

function quizResultRow({ id, schedule, score, person, roll }) {
  const total = schedule.quiz.total_questions;
  const passing = schedule.quiz.passing_percentage || 70;
  const percentage = total ? Math.round((Number(score) / Number(total)) * 100) : 0;
  return {
    _id: id,
    quiz: schedule.quiz,
    status: percentage >= passing ? "passed" : "failed",
    score,
    total_questions: total,
    attempts: schedule.attempts || 1,
    createdAt: schedule.date,
    student_id: person._id,
    roll_number: String(roll),
    student_induction: {
      student_id: { full_name: person.full_name, email: person.email },
    },
  };
}

const muizQuizResults = quizSchedules.map((row) =>
  quizResultRow({
    id: row._id,
    schedule: row,
    score: row.score,
    person: student,
    roll: ROLL_NUMBER,
  }),
);

const classmateQuizResults = classmates.flatMap((mate) =>
  quizSchedules.map((row, index) => {
    const fallback = Math.max(10, Number(row.score || 28) - 6);
    const score = mate.quiz_scores?.[index] ?? fallback;
    return quizResultRow({
      id: `qr_${mate.roll_number}_${row.quiz._id.slice(-8)}`,
      schedule: row,
      score,
      person: mate,
      roll: mate.roll_number,
    });
  }),
);

const quizResults = [...muizQuizResults, ...classmateQuizResults];

const classAttendance = {
  [SLOT_ID]: [
    { roll_number: ROLL_NUMBER, full_name: student.full_name, status: "present" },
    ...classmates.map((mate) => ({
      roll_number: String(mate.roll_number),
      full_name: mate.full_name,
      status: mate.today_status || "present",
    })),
  ],
};

function attendanceRecord(person, stats) {
  return {
    student: { full_name: person.full_name },
    total_classes: stats.total_classes,
    total_present: stats.total_present,
    total_leave: stats.total_leave,
    total_absent: stats.total_absent,
    attendance: (stats.recent || []).map((row) => ({
      ...row,
      class: course.en.course_name,
    })),
  };
}

const studentAttendance = {
  [ROLL_NUMBER]: attendanceRecord(student, {
    total_classes: 48,
    total_present: 42,
    total_leave: 2,
    total_absent: 4,
    recent: [
      { date: "2026-09-18T13:00:00.000Z", status: "present" },
      { date: "2026-09-16T13:00:00.000Z", status: "present" },
      { date: "2026-09-14T13:00:00.000Z", status: "leave" },
      { date: "2026-09-11T13:00:00.000Z", status: "present" },
      { date: "2026-09-09T13:00:00.000Z", status: "absent" },
      { date: "2026-09-07T13:00:00.000Z", status: "present" },
    ],
  }),
};

for (const mate of classmates) {
  studentAttendance[String(mate.roll_number)] = attendanceRecord(mate, mate.attendance);
}

const trainerAttendanceRows = [
  {
    _id: "tatt_001",
    check_in: "2026-09-18T13:00:00.000Z",
    check_out: "2026-09-18T15:00:00.000Z",
    late_check_in_minutes: 0,
    early_check_out_minutes: 0,
    minutes: 120,
    status: "present",
  },
  {
    _id: "tatt_002",
    check_in: "2026-09-16T13:05:00.000Z",
    check_out: "2026-09-16T15:00:00.000Z",
    late_check_in_minutes: 5,
    early_check_out_minutes: 0,
    minutes: 115,
    status: "present",
  },
  {
    _id: "tatt_003",
    check_in: "2026-09-14T13:00:00.000Z",
    check_out: "2026-09-14T15:00:00.000Z",
    late_check_in_minutes: 0,
    early_check_out_minutes: 0,
    minutes: 120,
    status: "present",
  },
  {
    _id: "tatt_004",
    check_in: "2026-09-11T13:12:00.000Z",
    check_out: "2026-09-11T14:50:00.000Z",
    late_check_in_minutes: 12,
    early_check_out_minutes: 10,
    minutes: 98,
    status: "present",
  },
  {
    _id: "tatt_005",
    check_in: "2026-09-09T13:00:00.000Z",
    check_out: null,
    late_check_in_minutes: 0,
    early_check_out_minutes: 0,
    minutes: 0,
    status: "present",
  },
  {
    _id: "tatt_006",
    check_in: "2026-09-07T13:00:00.000Z",
    check_out: "2026-09-07T15:00:00.000Z",
    late_check_in_minutes: 0,
    early_check_out_minutes: 0,
    minutes: 120,
    status: "present",
  },
  {
    _id: "tatt_007",
    check_in: "2026-09-04T13:20:00.000Z",
    check_out: "2026-09-04T15:00:00.000Z",
    late_check_in_minutes: 20,
    early_check_out_minutes: 0,
    minutes: 100,
    status: "present",
  },
  {
    _id: "tatt_008",
    check_in: "2026-09-02T13:00:00.000Z",
    check_out: "2026-09-02T15:00:00.000Z",
    late_check_in_minutes: 0,
    early_check_out_minutes: 0,
    minutes: 120,
    status: "present",
  },
  {
    _id: "tatt_009",
    check_in: "2026-08-30T13:03:00.000Z",
    check_out: "2026-08-30T14:55:00.000Z",
    late_check_in_minutes: 3,
    early_check_out_minutes: 5,
    minutes: 112,
    status: "present",
  },
  {
    _id: "tatt_010",
    check_in: "2026-08-28T13:00:00.000Z",
    check_out: "2026-08-28T15:00:00.000Z",
    late_check_in_minutes: 0,
    early_check_out_minutes: 0,
    minutes: 120,
    status: "present",
  },
  {
    _id: "tatt_011",
    check_in: "2026-08-26T13:08:00.000Z",
    check_out: "2026-08-26T15:00:00.000Z",
    late_check_in_minutes: 8,
    early_check_out_minutes: 0,
    minutes: 112,
    status: "present",
  },
  {
    _id: "tatt_012",
    check_in: "2026-08-23T13:00:00.000Z",
    check_out: "2026-08-23T15:00:00.000Z",
    late_check_in_minutes: 0,
    early_check_out_minutes: 0,
    minutes: 120,
    status: "present",
  },
];

const modules = progressRaw.modules.map((mod) => ({
  ...mod,
  _id: mod._id || mod.module_id,
  module_id: mod.module_id,
  module_name: mod.module_name,
  title: mod.title || mod.module_name,
  completed_topics: mod.completed_topics,
  total_topics: mod.total_topics,
  completion_percentage: mod.completion_percentage,
  topics: (mod.topics || []).map((topic) => ({
    ...topic,
    assignments: topic.assignments || [],
    description: topic.description || "",
  })),
}));

const muizPayments = (paymentsRaw.data || []).map((row) => ({
  ...row,
  student_id: row.student?._id || STUDENT_ID,
  course_id: row.student_induction?._id || INDUCTION_ID,
  amount: Number(row.amount) || row.amount,
  blinq_invoice_number: row.blinq_invoice_number || row.jazzcash_id,
  kuickpay_id: row.kuickpay_id || "",
  jazzcash_id: row.jazzcash_id,
}));

const unpaidInvoices = classmates
  .filter((mate) => mate.fee_status === "unpaid")
  .map((mate) => ({
    type: "monthly",
    _id: `pay_${mate.roll_number}_2609`,
    student: {
      _id: mate._id,
      full_name: mate.full_name,
      father_name: mate.father_name,
      email: mate.email,
    },
    student_induction: {
      _id: `ind_${mate.roll_number}`,
      course,
      batch_number: 20,
      roll_number: Number(mate.roll_number),
    },
    amount: 1000,
    format_amount: "1000",
    billing_month: "2609",
    due_date: "2026-09-08",
    status: "unpaid",
    student_id: mate._id,
    course_id: `ind_${mate.roll_number}`,
  }));

const payments = [...muizPayments, ...unpaidInvoices];
const certificates = [];
const enrollSlots = {};

export const db = {
  teacher,
  admin,
  student,
  slots: [slotActive],
  trainerSlots: [slotActive],
  students,
  assignments,
  formattedAssignments,
  submissions,
  assignmentTotals,
  quiz,
  quizSchedules,
  quizQuestions,
  quizResults,
  classAttendance,
  studentAttendance,
  trainerAttendanceRows,
  modules,
  progressMeta: {
    course_completion: progressRaw.course_completion,
    total_topics: progressRaw.total_topics,
    completed_topics: progressRaw.completed_topics,
    next_module: progressRaw.next_module,
  },
  course,
  newCourse,
  campus,
  studentCourses,
  payments,
  certificates,
  enrollSlots,
  generatedPasswords: {},
  isTodayAttendanceMarked: true,
  quizAttendanceToday,
};

export function findSlot(slotId) {
  const id = resolveSlotId(slotId);
  return db.slots.find((item) => item._id === id) || null;
}

export function findStudentCourse(slotId) {
  const id = resolveSlotId(slotId);
  return db.studentCourses.find((item) => item?.slot?._id === id) || db.studentCourses[0] || null;
}

export function publicUser(user) {
  if (!user) return null;
  const { password, ...rest } = user;
  return rest;
}

export function hydrateSessionUser(parsed) {
  if (!parsed) return null;
  if (parsed.role === "admin" || parsed.isAdmin) {
    return { ...publicUser(db.admin), role: "admin", isAdmin: true };
  }
  const isTrainer = parsed.role === "trainer" || parsed.isTrainer || parsed.isTeacher;
  if (isTrainer) {
    return { ...publicUser(db.teacher), role: "trainer", isTrainer: true };
  }
  const fresh = publicUser(db.student);
  return {
    ...parsed,
    ...fresh,
    contact_number: parsed.contact_number || fresh.contact_number,
    full_address: parsed.full_address || fresh.full_address,
    last_qualification: parsed.last_qualification || fresh.last_qualification,
    full_name: fresh.full_name,
    name: fresh.full_name,
    father_name: fresh.father_name,
    email: fresh.email,
    image: fresh.image,
    student_cnic: fresh.student_cnic,
    _id: fresh._id,
    role: "student",
  };
}

export function getTrainerClassStats() {
  const roster = db.classAttendance[SLOT_ID] || [];
  const present = roster.filter((row) => row.status === "present").length;
  const absent = roster.filter((row) => row.status === "absent").length;
  const leave = roster.filter((row) => row.status === "leave").length;
  const now = new Date();
  let monthPresent = 0;
  let monthTotal = 0;
  Object.values(db.studentAttendance).forEach((record) => {
    (record.attendance || []).forEach((row) => {
      const date = new Date(row.date);
      if (date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear()) {
        monthTotal += 1;
        if (row.status === "present") monthPresent += 1;
      }
    });
  });
  return {
    slots: db.slots.length,
    enrolled: db.students.length,
    markedToday: !!db.isTodayAttendanceMarked,
    present,
    absent,
    leave,
    monthPresentPercent: monthTotal ? Math.round((monthPresent / monthTotal) * 100) : 0,
  };
}

export function normalizeCnic(value) {
  return String(value || "").replace(/\D/g, "");
}

export function loginStudent({ cnic, password }) {
  const digits = normalizeCnic(cnic);
  if (digits === db.student.student_cnic && password === db.student.password) {
    return { user: publicUser(db.student) };
  }
  return { error: "Invalid CNIC or password" };
}

export function loginTrainer({ email, password }) {
  if (
    String(email || "").toLowerCase() === db.teacher.email &&
    password === db.teacher.password
  ) {
    return {
      user: { ...publicUser(db.teacher), role: "trainer", isTrainer: true },
    };
  }
  return { error: "Invalid email or password" };
}

export function loginAdmin({ email, password }) {
  if (
    String(email || "").toLowerCase() === db.admin.email &&
    password === db.admin.password
  ) {
    return {
      user: { ...publicUser(db.admin), role: "admin", isAdmin: true },
    };
  }
  return { error: "Invalid email or password" };
}

export function generateStudentPassword({ cnic, dob, password }) {
  const digits = normalizeCnic(cnic);
  if (digits !== db.student.student_cnic) return { error: "Student not found" };
  if (!password || password.length < 6) return { error: "Password must be at least 6 characters" };
  const expected = new Date(db.student.dob).toISOString().slice(0, 10);
  const given = new Date(dob).toISOString().slice(0, 10);
  if (expected !== given) return { error: "CNIC and date of birth do not match" };
  db.generatedPasswords[digits] = password;
  db.student.password = password;
  return { ok: true };
}
