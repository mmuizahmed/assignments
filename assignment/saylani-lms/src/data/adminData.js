let counter = 1;
const oid = () => (counter++).toString(16).padStart(24, "0");

export const CATEGORIES = [
  { _id: oid(), en: { category_name: "Development" }, ur: { category_name: "ڈیولپمنٹ" } },
  { _id: oid(), en: { category_name: "Design" }, ur: { category_name: "ڈیزائن" } },
  { _id: oid(), en: { category_name: "Marketing" }, ur: { category_name: "مارکیٹنگ" } },
  { _id: oid(), en: { category_name: "Cloud & DevOps" }, ur: { category_name: "کلاؤڈ" } },
  { _id: oid(), en: { category_name: "Data Science" }, ur: { category_name: "ڈیٹا سائنس" } },
];
const cat = (name) => CATEGORIES.find((c) => c.en.category_name === name);

const COURSE_DEFS = [
  ["Modern Web Application Development", "Development", "6 Months"],
  ["Mobile Application Development", "Development", "6 Months"],
  ["Full Stack Web Development (MERN)", "Development", "1 Year"],
  ["Python Programming", "Development", "3 Months"],
  ["Graphics Designing", "Design", "4 Months"],
  ["UI/UX Design", "Design", "4 Months"],
  ["Digital Marketing", "Marketing", "3 Months"],
  ["Amazon Virtual Assistant", "Marketing", "3 Months"],
  ["Cloud Computing with AWS", "Cloud & DevOps", "5 Months"],
  ["DevOps Engineering", "Cloud & DevOps", "6 Months"],
  ["Data Science with Python", "Data Science", "6 Months"],
  ["Artificial Intelligence", "Data Science", "6 Months"],
  ["Flutter Development", "Development", "4 Months"],
  ["WordPress Development", "Development", "2 Months"],
  ["Video Editing & Motion Graphics", "Design", "3 Months"],
];

export const COURSES = COURSE_DEFS.map(([name, category, duration], i) => ({
  _id: oid(),
  sequence: i + 1,
  slug: name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, ""),
  show_on_website: i % 5 !== 4,
  cover_image: "",
  en: {
    course_name: name,
    course_duration: duration,
    course_category: { _id: cat(category)._id, en: { category_name: category } },
  },
}));
const courseByName = (name) => COURSES.find((c) => c.en.course_name === name);

export const CITIES = [
  { _id: oid(), en: { city_name: "Karachi" } },
  { _id: oid(), en: { city_name: "Lahore" } },
  { _id: oid(), en: { city_name: "Islamabad" } },
  { _id: oid(), en: { city_name: "Hyderabad" } },
  { _id: oid(), en: { city_name: "Peshawar" } },
];
const cityByName = (name) => CITIES.find((c) => c.en.city_name === name);

export const CAMPUSES = [
  { _id: oid(), en: { campus_name: "Head Office Bahadurabad" }, city: cityByName("Karachi") },
  { _id: oid(), en: { campus_name: "Gulshan Campus" }, city: cityByName("Karachi") },
  { _id: oid(), en: { campus_name: "North Nazimabad Campus" }, city: cityByName("Karachi") },
  { _id: oid(), en: { campus_name: "Township Campus" }, city: cityByName("Lahore") },
  { _id: oid(), en: { campus_name: "Blue Area Campus" }, city: cityByName("Islamabad") },
  { _id: oid(), en: { campus_name: "Latifabad Campus" }, city: cityByName("Hyderabad") },
  { _id: oid(), en: { campus_name: "University Road Campus" }, city: cityByName("Peshawar") },
];

const TRAINER_DEFS = [
  ["Muhammad Muiz Ahmed", "Modern Web Application Development", "Karachi", true],
  ["Ahsan Raza", "Mobile Application Development", "Karachi", true],
  ["Fatima Noor", "UI/UX Design", "Karachi", false],
  ["Bilal Aslam", "Full Stack Web Development (MERN)", "Lahore", true],
  ["Sana Tariq", "Digital Marketing", "Islamabad", false],
  ["Usman Ghani", "Cloud Computing with AWS", "Karachi", true],
  ["Hira Shabbir", "Graphics Designing", "Hyderabad", false],
  ["Zeeshan Ali", "Python Programming", "Karachi", true],
  ["Ayesha Kamal", "Data Science with Python", "Lahore", false],
  ["Kamran Iqbal", "DevOps Engineering", "Islamabad", true],
  ["Nida Farooq", "Amazon Virtual Assistant", "Peshawar", false],
  ["Tariq Mehmood", "Artificial Intelligence", "Karachi", true],
];

export const TRAINERS = TRAINER_DEFS.map(([name, courseName, cityName, active], i) => {
  const course = courseByName(courseName);
  const city = cityByName(cityName);
  const first = name.split(" ")[0].toLowerCase();
  return {
    _id: oid(),
    en: { trainer_name: name },
    ur: { trainer_name: name },
    email: `${first}.trainer@smit.local`,
    employee_id: `SMIT-${(1200 + i).toString()}`,
    hourly_rate: 800 + (i % 5) * 150,
    phone_number: `+92 3${(10 + i).toString().padStart(2, "0")} ${1000000 + i * 13457}`,
    description: `Lead trainer for ${courseName}.`,
    image: `https://randomuser.me/api/portraits/${i % 3 === 2 ? "women" : "men"}/${20 + i}.jpg`,
    is_deleted: !active,
    courses: [{ _id: course._id, en: { course_name: courseName } }],
    city: [{ _id: city._id, en: { city_name: cityName } }],
    country: { _id: "pk", en: { country_name: "Pakistan" } },
  };
});
const trainerByCourse = (courseName) =>
  TRAINERS.find((t) => t.courses[0].en.course_name === courseName) || TRAINERS[0];

const FIRST_NAMES = [
  "Muhammad", "Ahmed", "Ali", "Hassan", "Hussain", "Bilal", "Usman", "Zain",
  "Abdullah", "Hamza", "Saad", "Faizan", "Owais", "Talha", "Umar", "Ayesha",
  "Fatima", "Zainab", "Maryam", "Hira", "Sana", "Nida", "Amna", "Iqra",
  "Areeba", "Rabia",
];
const LAST_NAMES = [
  "Ahmed", "Khan", "Raza", "Malik", "Sheikh", "Qureshi", "Siddiqui", "Ansari",
  "Butt", "Chaudhry", "Farooqi", "Hashmi", "Baig", "Memon", "Abbasi",
];
const PAYMENTS = ["paid", "pending", "unpaid"];
const STATUS_WEIGHTS = [
  "active", "active", "active", "active", "active", "active",
  "pending", "pending",
  "completed",
  "dropped",
];

function pick(arr, n) {
  return arr[n % arr.length];
}

export const STUDENTS = Array.from({ length: 45 }, (_, i) => {
  const first = pick(FIRST_NAMES, i * 3 + 1);
  const last = pick(LAST_NAMES, i * 5 + 2);
  const fatherFirst = pick(FIRST_NAMES, i * 7 + 4);
  const name = `${first} ${last}`;
  const fatherName = `${fatherFirst} ${last}`;
  const course = COURSES[i % COURSES.length];
  const campus = CAMPUSES[i % CAMPUSES.length];
  const cnicTail = (1234567890123 + i * 98713).toString().slice(0, 13);
  const status = pick(STATUS_WEIGHTS, i * 7 + 3);
  const payment = status === "dropped" ? "unpaid" : pick(PAYMENTS, i + 1);
  return {
    _id: oid(),
    roll_number: `SMIT-${course.en.course_name.slice(0, 3).toUpperCase()}-${(1001 + i).toString()}`,
    student_id: {
      _id: oid(),
      full_name: name,
      father_name: fatherName,
      student_cnic: `${cnicTail.slice(0, 5)}-${cnicTail.slice(5, 12)}-${cnicTail.slice(12) || "1"}`,
      contact_number: `+92 3${(20 + (i % 40)).toString().padStart(2, "0")}-${(1000000 + i * 24681).toString().slice(0, 7)}`,
      email: `${first}.${last}${i}@student.local`.toLowerCase(),
      gender: i % 2 === 0 ? "male" : "female",
    },
    new_course: {
      _id: oid(),
      course: { _id: course._id, en: { course_name: course.en.course_name } },
    },
    campus: { _id: campus._id, en: { campus_name: campus.en.campus_name } },
    city: campus.city,
    batch: 20 + (i % 4),
    status,
    payment_data: { status: payment, amount: 5000 + (i % 6) * 1000 },
    createdAt: new Date(2024, i % 12, (i % 27) + 1).toISOString(),
  };
});

const QUIZ_DEFS = [
  ["HTML & CSS Fundamentals", "Modern Web Application Development", "Module 1", 20, true],
  ["JavaScript Basics", "Modern Web Application Development", "Module 3", 25, true],
  ["React Components & Props", "Full Stack Web Development (MERN)", "Module 5", 15, true],
  ["Python Data Types", "Python Programming", "Module 2", 20, true],
  ["Design Principles", "UI/UX Design", "Module 1", 18, false],
  ["AWS Core Services", "Cloud Computing with AWS", "Module 4", 22, true],
  ["Digital Marketing Foundations", "Digital Marketing", "Module 1", 20, false],
  ["Pandas & NumPy", "Data Science with Python", "Module 6", 25, true],
];

export const QUIZZES = QUIZ_DEFS.map(([title, courseName, module, count, published], i) => {
  const course = courseByName(courseName);
  const t = trainerByCourse(courseName);
  return {
    _id: oid(),
    title,
    module,
    question_count: count,
    total_marks: count,
    duration: count * 2,
    status: published ? "published" : "draft",
    courses: [{ _id: course._id, en: { course_name: courseName } }],
    trainer: { _id: t._id, en: { trainer_name: t.en.trainer_name } },
    createdAt: new Date(2024, i % 12, (i % 27) + 1).toISOString(),
  };
});
const quizByCourse = (courseName) =>
  QUIZZES.find((q) => q.courses[0].en.course_name === courseName);

export const QUIZ_RESULTS = Array.from({ length: 40 }, (_, i) => {
  const student = STUDENTS[i % STUDENTS.length];
  const courseName = student.new_course.course.en.course_name;
  const quiz = quizByCourse(courseName) || QUIZZES[i % QUIZZES.length];
  const trainer = quiz.trainer;
  const scorePct = 45 + ((i * 7) % 56);
  const marks = Math.round((scorePct / 100) * quiz.total_marks);
  return {
    _id: oid(),
    quiz_date: new Date(2024, (i % 10) + 1, (i % 25) + 1).toISOString(),
    student: {
      _id: student._id,
      full_name: student.student_id.full_name,
      roll_number: student.roll_number,
    },
    trainer,
    quiz: { _id: quiz._id, title: quiz.title },
    total_marks: quiz.total_marks,
    obtained_marks: marks,
    score: scorePct,
    status: scorePct >= 50 ? "pass" : "fail",
  };
});

const enrolledCount = STUDENTS.filter((s) => s.status === "active").length;
const activeSlots = COURSES.filter((c) => c.show_on_website).length;

const campusAnalytics = CAMPUSES.map((camp) => ({
  name: `${camp.en.campus_name} (${camp.city?.en?.city_name})`,
  value: STUDENTS.filter((s) => s.campus._id === camp._id).length,
}));

const courseAnalytics = COURSES.map((c) => ({
  name: c.en.course_name,
  value: STUDENTS.filter((s) => s.new_course.course._id === c._id).length,
})).filter((c) => c.value > 0);

export const DASHBOARD_STATS = {
  total_students: STUDENTS.length,
  enrolled_students: enrolledCount,
  courses: COURSES.length,
  cities: CITIES.length,
  campuses: CAMPUSES.length,
  trainers: TRAINERS.filter((t) => !t.is_deleted).length,
  active_slots: activeSlots,
  registration_open: activeSlots,
};

export const CAMPUS_ANALYTICS = campusAnalytics;
export const COURSE_ANALYTICS = courseAnalytics;
