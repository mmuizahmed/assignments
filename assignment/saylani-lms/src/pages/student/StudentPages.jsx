import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import {
  Book,
  CalendarDays,
  CircleCheck,
  CircleX,
  Clock,
  GraduationCap,
  LogOut,
  Moon,
  Search,
  Sun,
  User,
} from "lucide-react";
import { format } from "date-fns";
import { useApp } from "../../context/AppContext";
import { useTheme } from "../../context/ThemeContext";
import { db, findStudentCourse, ROLL_NUMBER } from "../../data/db";
import { currentMonthLabel, formatBillingMonth } from "../../lib/format";
import { he } from "../../lib/toast";
import { COVER } from "../../lib/utils";
import {
  Alert,
  AlertDescription,
  AlertTitle,
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AppBreadcrumb,
  Avatar,
  AvatarFallback,
  AvatarImage,
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  Input,
  Label,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Skeleton,
  StatusBadge,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  Textarea,
} from "../../components/ui";
import {
  AttendanceOverview,
  CourseCard,
  CourseModulesAccordion,
  FeedbackButton,
  PaymentList,
  StatCard,
  StudentScheduleWidget,
  TopicDetailView,
} from "../../components/widgets";
import { StudentAssignment, StudentQuiz } from "./StudentWorkPages";

export { StudentAssignment, StudentQuiz };

export function StudentCourses() {
  const { user, logout, setCourses } = useApp();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const [confirm, setConfirm] = useState(false);
  const list = db.studentCourses;
  const statuses = useMemo(() => Array.from(new Set(list.map((item) => item.status))), [list]);
  const [filter, setFilter] = useState("enrolled");
  const [search, setSearch] = useState("");

  useEffect(() => {
    setCourses(list);
    statuses.includes("enrolled") ? setFilter("enrolled") : setFilter("all");
  }, [list, setCourses, statuses]);

  const sorted = useMemo(
    () =>
      [...list].sort((a, b) =>
        a.status === "enrolled" && b.status !== "enrolled"
          ? -1
          : a.status !== "enrolled" && b.status === "enrolled"
            ? 1
            : new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
      ),
    [list],
  );
  const visible = useMemo(() => {
    const byStatus = filter === "all" || !filter ? sorted : sorted.filter((item) => item.status === filter);
    const term = search.trim().toLowerCase();
    return term
      ? byStatus.filter((item) => (item?.course?.en?.course_name || "").toLowerCase().includes(term))
      : byStatus;
  }, [sorted, filter, search]);

  return (
    <div className="w-full h-full">
      <div className="mx-auto px-6 max-md:!px-2">
        <div className="hidden md:flex items-center justify-between w-full py-2 gap-4">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="flex items-center gap-2 rounded-full pl-1 pr-3 h-11 flex-shrink-0 border dark:border-[#2e2e2e] hover:bg-clr_blue_bg/60 dark:hover:bg-[#2a2a2a]"
              >
                <Avatar className="h-8 w-8">
                  <AvatarImage src={user?.image || "/placeholder.svg"} alt={user?.full_name || user?.name || "User"} />
                  <AvatarFallback>{user?.full_name?.charAt(0) || user?.name?.charAt(0) || "U"}</AvatarFallback>
                </Avatar>
                <span className="text-sm font-medium max-w-[160px] truncate capitalize">
                  {user?.full_name || user?.name || "Account"}
                </span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="min-w-44">
              <DropdownMenuItem onClick={() => navigate("/profile")}>
                <User className="h-4 w-4" />
                <span>Profile</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={toggleTheme}>
                {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
                <span>{theme === "dark" ? "Light Mode" : "Dark Mode"}</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => setConfirm(true)}>
                <LogOut className="h-4 w-4" />
                <span>Log out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <div className="flex-1 flex justify-center">
            <div className="flex items-center gap-3">
              <div className="border dark:border-[#2e2e2e] rounded-lg flex items-center px-4 py-0 gap-2 w-80 dark:bg-[#222222]">
                <Input
                  placeholder="Search Course"
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  className="border-none shadow-none p-2 rounded-md w-full dark:bg-[#222222] focus-visible:ring-0 focus-visible:ring-offset-0"
                />
                <Search className="h-4 w-4 text-gray-400 flex-shrink-0" />
              </div>
              <div className="w-36">
                <Select onValueChange={setFilter} value={filter}>
                  <SelectTrigger className="w-full rounded-lg px-4 py-2 border dark:border-[#2e2e2e] gap-2">
                    <SelectValue placeholder={filter.toUpperCase()} />
                  </SelectTrigger>
                  <SelectContent className="border-none shadow-none">
                    <SelectItem value="all">All</SelectItem>
                    {statuses.map((status) => (
                      <SelectItem key={status} value={status}>
                        {status?.toUpperCase()}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
          <div className="flex-shrink-0">
            <FeedbackButton userType="student" inline />
          </div>
        </div>
        <AlertDialog open={confirm} onOpenChange={setConfirm}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Confirm Logout</AlertDialogTitle>
              <AlertDialogDescription>Are you sure you want to log out?</AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                className="bg-red-600 hover:bg-red-700 text-white"
                onClick={() => {
                  logout();
                  navigate("/login", { replace: true });
                }}
              >
                Log out
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
        <div className="md:hidden flex flex-col gap-2 pt-2">
          <div className="flex items-center gap-2">
            <div className="border dark:border-[#2e2e2e] rounded-lg flex items-center px-2 py-0 gap-2 flex-1 dark:bg-[#222222]">
              <Input
                placeholder="Search Course"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                className="border-none shadow-none p-2 rounded-md w-full dark:bg-[#222222] focus-visible:ring-0 focus-visible:ring-offset-0"
              />
              <Search className="h-4 w-4 text-gray-400 flex-shrink-0" />
            </div>
            <div className="w-32 flex-shrink-0">
              <Select onValueChange={setFilter} value={filter}>
                <SelectTrigger className="w-full rounded-lg px-3 py-2 border dark:border-[#2e2e2e] gap-2">
                  <SelectValue placeholder={filter.toUpperCase()} />
                </SelectTrigger>
                <SelectContent className="border-none shadow-none">
                  <SelectItem value="all">All</SelectItem>
                  {statuses.map((status) => (
                    <SelectItem key={status} value={status}>
                      {status?.toUpperCase()}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
        {visible.length === 0 ? (
          <div className="text-center py-16 text-muted-foreground">
            <p className="text-lg font-medium">No courses found</p>
            <p className="text-sm mt-1">Try a different search term or filter</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4 max-md:!gap-1 py-4">
            {visible.map((course) => (
              <div key={course._id} className="mb-1">
                <CourseCard data={course} />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export function StudentDashboard() {
  const { slotId } = useParams();
  const navigate = useNavigate();
  const { selectedCourse, setSelectedCourse } = useApp();
  const course = selectedCourse || findStudentCourse(slotId);
  useEffect(() => {
    if (course) setSelectedCourse(course);
  }, [course, setSelectedCourse]);
  const attendance = db.studentAttendance[ROLL_NUMBER] || { total_present: 0, attendance: [] };
  const payments = db.payments.filter((item) => item.course_id === course?._id);
  const latest = payments.length
    ? [
        payments.reduce((best, item) =>
          parseInt(item.billing_month) > parseInt(best.billing_month) ? item : best,
        ),
      ]
    : [];
  const approved = db.submissions.filter((item) => item.student_id === db.student._id && item.status === "approved").length;
  const name = course?.course?.en?.course_name || "Course Name";

  if (!course) return <Skeleton className="h-40 w-full" />;

  return (
    <div className="mx-auto px-2 space-y-3">
      <div className="max-md:hidden pt-3 pb-4">
        <AppBreadcrumb items={[{ title: "Home", href: "/courses" }, { title: `${name}` }]} />
      </div>
      <div className="flex flex-col lg:flex-row gap-4">
        <div className="flex-1 flex flex-col gap-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <StatCard
              title="Attendance"
              value={`${attendance.total_present}/${attendance.attendance.length}`}
              icon={Clock}
              iconColor="text-clr_emerald"
              iconBg="bg-clr_emerald_bg"
              className="cursor-pointer"
              onclick={() => navigate(`/attendance/${slotId}`)}
            />
            <StatCard
              title="Assignment"
              value={`${approved}/${db.assignments.length}`}
              icon={GraduationCap}
              iconColor="text-clr_purple"
              iconBg="bg-clr_purple_bg"
              className="cursor-pointer"
              onclick={() => navigate(`/assignment/${slotId}`)}
            />
          </div>
          <CardTitle className="p-2 -mb-3 font-semimedium">Active Course</CardTitle>
          <CourseCard data={course} />
          <CardTitle className="p-2 -mb-3 font-semimedium">Fee</CardTitle>
          <PaymentList payments={latest} />
        </div>
        <div className=" w-[30%] my-0 max-lg:w-full flex-col gap-4">
          <StudentScheduleWidget />
        </div>
      </div>
    </div>
  );
}

const monthKey = (value) => new Date(value).toLocaleDateString("en-US", { month: "short", year: "numeric" });
const formatAttendanceDate = (value) =>
  new Date(value).toLocaleDateString("en-US", { weekday: "short", day: "numeric", month: "short", year: "numeric" });

export function StudentAttendance() {
  const { slotId } = useParams();
  const { selectedCourse } = useApp();
  const course = selectedCourse || findStudentCourse(slotId);
  const record = db.studentAttendance[ROLL_NUMBER];
  const percent = Math.round((record.total_present / record.total_classes) * 100);
  const currentMonth = monthKey(new Date());
  const [month, setMonth] = useState(currentMonth);
  const distinctMonths = [...new Set(record.attendance.map((item) => monthKey(item.date)))];
  const monthOptions = distinctMonths.includes(currentMonth) ? distinctMonths : [currentMonth, ...distinctMonths];
  const rows = record.attendance.filter((item) => monthKey(item.date) === month);
  return (
    <div className="space-y-4 px-2 mb-4">
      <div className="mb-0 pb-2 pt-3 flex items-center justify-between max-md:hidden">
        <AppBreadcrumb
          items={[
            { title: "Home", href: "/courses" },
            { title: course?.course?.en?.course_name || "Course Name", href: `/dashboard/${slotId}` },
            { title: "Attendance" },
          ]}
        />
      </div>
      <div className="grid grid-cols-4 gap-4 max-md:grid-cols-2 max-md:gap-3">
        <StatCard title="Total Classes" value={record.total_classes || 0} icon={CalendarDays} iconColor="text-muted-foreground" />
        <StatCard title="Present" value={record.total_present || 0} icon={CircleCheck} iconColor="text-clr_green" />
        <StatCard title="Leave" value={record.total_leave || 0} icon={CircleX} iconColor="text-clr_amber" />
        <StatCard title="Absent" value={record.total_absent || 0} icon={CircleX} iconColor="text-clr_red" />
      </div>
      <AttendanceOverview percentage={percent} />
      <div>
        <div className="flex items-center justify-end mb-3">
          <div className="w-40">
            <Select value={month} onValueChange={setMonth}>
              <SelectTrigger className="h-8">
                <SelectValue placeholder="Select Month" />
              </SelectTrigger>
              <SelectContent>
                {monthOptions.map((option) => (
                  <SelectItem key={option} value={option}>
                    {option}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        <div className="overflow-x-auto rounded-xl border border-gray-200 dark:border-[#2e2e2e] shadow-sm bg-white dark:bg-[#222222] duration-300">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-left">Class</TableHead>
                <TableHead className="text-left">Date</TableHead>
                <TableHead className="text-left">Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.length > 0 ? (
                rows.map((row, index) => (
                  <TableRow key={index}>
                    <TableCell>{index + 1}</TableCell>
                    <TableCell>{formatAttendanceDate(row.date)}</TableCell>
                    <TableCell className="text-left">
                      <StatusBadge status={row.status}>{row.status}</StatusBadge>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={3} className="text-center py-6 text-muted-foreground">
                    No attendance records for this month
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}

export function StudentProgress() {
  const { slotId } = useParams();
  const { user, selectedCourse } = useApp();
  const modules = db.modules;
  const [topic, setTopic] = useState(null);
  const totals = {
    total: db.progressMeta?.total_topics ?? 0,
    completed: db.progressMeta?.completed_topics ?? 0,
    pending: 0,
  };
  totals.pending = (totals.total - totals.completed) || 0;
  const name = selectedCourse?.course?.en?.course_name || "Course Name";

  return (
    <div className="px-2">
      <div className="min-h-screen">
      <div className="max-md:hidden pb-4 pt-3 ">
        <AppBreadcrumb
          items={[
            { title: "Home", href: "/courses" },
            { title: `${name}`, href: `/dashboard/${slotId}` },
            { title: "Progress" },
          ]}
        />
      </div>
      <div className="flex flex-col w-full">
        {user?.role === "student" ? (
          <div className="-mt-2">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 py-4">
              <StatCard
                title="Total Topics"
                value={totals.total || 0}
                icon={Book}
                iconColor="text-clr_emerald"
                iconBg="bg-clr_emerald_bg"
                onclick={() => {}}
              />
              <StatCard
                title="Completed Topics"
                value={`${totals.completed || 0}`}
                icon={GraduationCap}
                iconColor="text-clr_purple"
                iconBg="bg-clr_purple_bg"
                onclick={() => {}}
              />
              <StatCard
                title="Pending Topics"
                value={totals.pending || 0}
                icon={Clock}
                iconColor="text-clr_red"
                iconBg="bg-clr_red_bg"
                onclick={() => {}}
              />
            </div>
          </div>
        ) : null}
        <main className="flex-1 ">
          {topic ? (
            <TopicDetailView topic={topic} onBack={() => setTopic(null)} />
          ) : (
            <CourseModulesAccordion modules={modules} onTopicClick={setTopic} canShowAssignment />
          )}
        </main>
      </div>
      </div>
    </div>
  );
}

export function StudentFee() {
  const { slotId } = useParams();
  const { selectedCourse, feePaid } = useApp();
  const [open, setOpen] = useState(false);
  const course = selectedCourse || findStudentCourse(slotId);
  const payments = db.payments.filter((item) => item.course_id === course?._id);
  const name = course?.course?.en?.course_name || "Course Name";
  const sponsored = !!course?.is_sponsored;
  const enrolledOrDropout = course?.status === "enrolled" || course?.status === "dropout";
  const currentLabel = currentMonthLabel();
  const hasCurrentMonthly = payments.some(
    (item) => formatBillingMonth(item.billing_month) === currentLabel && item.type === "monthly",
  );
  const showUnpaid = !sponsored && !feePaid && enrolledOrDropout;
  const showGenerate = !hasCurrentMonthly && enrolledOrDropout;
  const dashHref = feePaid || sponsored ? `/dashboard/${slotId}` : null;

  return (
    <div>
      <div className="shadow-none border-none w-full">
        <CardContent className="pt-0 px-2 gap-5">
          <div className="max-md:hidden pb-7 pt-3">
            <AppBreadcrumb
              items={[
                { title: "Home", href: "/courses" },
                { title: name, href: dashHref },
                { title: "Fee" },
              ]}
            />
          </div>
          <Alert className="bg-clr_blue_bg dark:bg-[#1e2a3a] border-clr_blue_bg dark:border-[#2a3a4a] mb-3 mt-2 md:mt-0">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <AlertDescription className="text-sm text-clr_blue_dark md:w-2/3">
                <p className="font-medium mb-2">To pay your fee via JazzCash:</p>
                <ol className="list-decimal ml-5 space-y-1">
                  <li>Open JazzCash app</li>
                  <li>
                    Click on <b>More</b>
                  </li>
                  <li>
                    Go to <b>Education</b> tab
                  </li>
                  <li>
                    Click <b>Universities</b>
                  </li>
                  <li>
                    Select <b>Saylani Education</b> from the list
                  </li>
                  <li>
                    Paste your <b>Voucher ID</b>
                  </li>
                  <li>Pay your fee</li>
                </ol>
                <div className="md:hidden mt-3">
                  <Button className="bg-clr_blue hover:bg-clr_blue_dark w-full" onClick={() => setOpen(true)}>
                    Watch JazzCash Guide Video
                  </Button>
                </div>
              </AlertDescription>
              <div className="hidden md:block shrink-0">
                <video
                  src="/saylani-jazzcash-guide.mp4"
                  controls
                  muted
                  className="rounded-lg border border-clr_blue_bg dark:border-[#2a3a4a] mx-auto"
                  style={{ aspectRatio: "9/16", width: "130px" }}
                />
              </div>
            </div>
          </Alert>
          {open ? (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60" onClick={() => setOpen(false)}>
              <div
                className="bg-white dark:bg-[#222222] rounded-lg p-4 max-w-xs w-full relative"
                onClick={(event) => event.stopPropagation()}
              >
                <button
                  className="absolute top-2 right-2 text-xl text-gray-600 hover:text-gray-900"
                  onClick={() => setOpen(false)}
                  aria-label="Close"
                  type="button"
                >
                  Ã—
                </button>
                <video
                  src="/saylani-jazzcash-guide.mp4"
                  controls
                  muted
                  className="rounded-lg mx-auto"
                  style={{ aspectRatio: "9/16", width: "160px" }}
                />
              </div>
            </div>
          ) : null}
          {showUnpaid ? (
            <Alert className="bg-clr_red_bg dark:bg-[#2a1a1a] border-clr_red_bg dark:border-[#4a2a2a] mb-3">
              <AlertDescription className="text-sm text-clr_red_dark">
                To access the portal, you need to pay the current month fee.
              </AlertDescription>
            </Alert>
          ) : null}
          <div className="flex flex-col sm:flex-row sm:justify-end gap-2 mb-4 mt-2 w-full">
            {showGenerate ? (
              <Button
                type="button"
                className="flex gap-2 items-center bg-clr_blue hover:bg-clr_blue_dark sm:w-auto w-fit ml-auto"
                variant="default"
              >
                Generate current month voucher
              </Button>
            ) : null}
          </div>
          <PaymentList payments={payments} />
        </CardContent>
      </div>
    </div>
  );
}


export function StudentProfile() {
  const { user, updateProfile, logout } = useApp();
  const navigate = useNavigate();
  const [editing, setEditing] = useState(false);
  const [confirmLogout, setConfirmLogout] = useState(false);
  const doLogout = () => {
    logout();
    navigate("/login", { replace: true });
  };
  const form = useForm({
    defaultValues: {
      full_name: user?.full_name || "",
      father_name: user?.father_name || "",
      email: user?.email || "",
      contact_number: user?.contact_number || "",
      full_address: user?.full_address || "",
      last_qualification: user?.last_qualification || "",
      gender: user?.gender || "",
      date_of_birth: user?.date_of_birth?.slice(0, 10) || "",
    },
  });
  return (
    <div className="mx-auto px-2 space-y-4">
      <AppBreadcrumb items={[{ title: "Home", href: "/courses" }, { title: "Profile" }]} />
      <div className="relative h-40 rounded-xl overflow-hidden">
        <img src={COVER} alt="" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-black/30" />
        <div className="absolute bottom-4 left-4 flex items-center gap-3">
          <Avatar className="h-20 w-20 border-4 border-white">
            <AvatarImage src={user?.image} />
            <AvatarFallback>{user?.full_name?.charAt(0)}</AvatarFallback>
          </Avatar>
          <div>
            <h2 className="text-white text-xl font-semibold">{user?.full_name}</h2>
            <StatusBadge status="enrolled">Student</StatusBadge>
          </div>
        </div>
      </div>
      <div className="flex justify-end gap-2">
        {editing ? (
          <>
            <Button variant="outline" onClick={() => setEditing(false)}>
              Cancel
            </Button>
            <Button
              className="bg-clr_navy"
              onClick={form.handleSubmit((values) => {
                updateProfile(values);
                he("Profile updated", "success");
                setEditing(false);
              })}
            >
              Save Changes
            </Button>
          </>
        ) : (
          <Button onClick={() => setEditing(true)}>Edit Profile</Button>
        )}
        <button
          type="button"
          onClick={() => setConfirmLogout(true)}
          className="hidden md:flex bg-red-600 hover:bg-red-700 text-white font-medium px-6 py-2 rounded-lg transition-colors items-center gap-2"
        >
          <LogOut size={18} />
          Logout
        </button>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Personal Information</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            ["full_name", "Full name"],
            ["father_name", "Father name"],
            ["email", "Email"],
            ["contact_number", "Contact number"],
            ["full_address", "Address"],
            ["last_qualification", "Last qualification"],
            ["gender", "Gender"],
            ["date_of_birth", "Date of birth"],
          ].map(([name, label]) => (
            <div key={name} className="space-y-1">
              <Label>{label}</Label>
              <Input disabled={!editing} {...form.register(name)} />
            </div>
          ))}
        </CardContent>
      </Card>
      <div className="md:hidden">
        <button
          type="button"
          onClick={() => setConfirmLogout(true)}
          className="w-full bg-red-600 hover:bg-red-700 text-white font-medium py-2 rounded-lg transition-colors flex items-center justify-center gap-2"
        >
          <LogOut size={18} />
          Logout
        </button>
      </div>
      <AlertDialog open={confirmLogout} onOpenChange={setConfirmLogout}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm Logout</AlertDialogTitle>
            <AlertDialogDescription>Are you sure you want to log out?</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={doLogout} className="bg-red-600 hover:bg-red-700 text-white">
              Log out
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
