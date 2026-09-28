import { useEffect, useState } from "react";
import {
  BookOpen,
  CalendarCheck,
  ChevronLeft,
  ChevronRight,
  ClipboardCheck,
  FileText,
  GraduationCap,
  Home,
  LayoutDashboard,
  LogOut,
  Moon,
  Sun,
  User,
  Wallet,
} from "lucide-react";
import { Outlet, useLocation, useNavigate, useParams } from "react-router-dom";
import { useApp } from "../context/AppContext";
import { useTheme } from "../context/ThemeContext";
import { db, findStudentCourse, resolveSlotId } from "../data/db";
import { LOGO } from "../lib/utils";
import { FeedbackButton } from "../components/widgets";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  Avatar,
  AvatarFallback,
  AvatarImage,
  Button,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  Skeleton,
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../components/ui";

function SidebarSkeleton() {
  return (
    <div className="h-screen w-52 max-md:hidden border-r bg-background p-4">
      <div className="mb-8 flex items-center gap-2">
        <Skeleton className="h-6 w-24" />
      </div>
      <div className="space-y-6">
        {Array.from({ length: 5 }).map((_, index) => (
          <div key={index} className="flex items-center gap-3">
            <Skeleton className="h-5 w-5 rounded-md" />
            <Skeleton className="h-5 w-24" />
          </div>
        ))}
      </div>
    </div>
  );
}

function StudentSidebar() {
  const { user, courses, selectedCourse, setSelectedCourse, logout, feePaid } = useApp();
  const [collapsed, setCollapsed] = useState(false);
  const [confirm, setConfirm] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { slotId } = useParams();
  const course =
    courses?.find((item) => item?.slot?._id === resolveSlotId(slotId)) || selectedCourse;
  const onProfile = location.pathname.includes("/profile");
  const { theme, toggleTheme } = useTheme();

  useEffect(() => {
    if (course) setSelectedCourse(course);
  }, [course, setSelectedCourse]);

  const items = [
    { path: `/dashboard/${slotId}`, label: "Dashboard", icon: LayoutDashboard, disabled: !!onProfile },
    { path: `/progress/${slotId}/${course?.course?._id}`, label: "Progress", icon: BookOpen, disabled: !!onProfile },
    { path: `/attendance/${slotId}`, label: "Attendance", icon: CalendarCheck, disabled: !!onProfile },
    { path: `/fee/${slotId}`, label: "Payment", icon: Wallet, disabled: !!onProfile },
    { path: `/assignment/${slotId}`, label: "Assignment", icon: FileText, disabled: !!onProfile },
    { path: `/quiz/${slotId}`, label: "Quiz", icon: ClipboardCheck, disabled: !!onProfile },
  ];
  let visible = items;
  if (!feePaid && course?.status !== "completed" && course?.status !== "certified") {
    visible = items.filter((item) => item.path.includes("/fee"));
  }

  return (
    <aside
      id="sidebar"
      className={`
        hidden md:flex sticky top-0 h-[100dvh] bg-white dark:bg-[#222222] shadow-sm border-r border-r-clr_blue_bg dark:border-r-[#2e2e2e]
        transition-all duration-300 ease-in-out overflow-y-auto
        ${collapsed ? "w-[70px]" : "w-[180px] lg:w-[200px]"}
        flex-col
      `}
    >
      <div className="flex items-center justify-between p-4 border-b border-clr_gray_light">
        {!collapsed && (
          <div className="flex-1 flex justify-center">
            <img src={LOGO} alt="Logo" className="h-14 w-auto" />
          </div>
        )}
        <button
          onClick={() => setCollapsed((value) => !value)}
          className="p-1.5 rounded-full hover:bg-clr_blue_bg dark:hover:bg-[#2a2a2a] text-clr_gray ml-auto"
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {collapsed ? <ChevronRight className="w-5 h-5" /> : <ChevronLeft className="w-5 h-5" />}
        </button>
      </div>
      <nav className="flex-1 py-4">
        <TooltipProvider delayDuration={0}>
          <ul className="space-y-1 px-2">
            {visible.map((item) => {
              const Icon = item.icon;
              const active = location.pathname === item.path;
              return (
                <li key={item.path}>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <button
                        onClick={() => !item.disabled && navigate(item.path)}
                        disabled={item.disabled}
                        className={`
                          w-full flex items-center px-3 py-2.5 rounded-md transition-colors
                          ${collapsed ? "justify-center" : ""}
                          ${item.disabled ? "text-clr_gray dark:text-gray-600 cursor-not-allowed" : active ? "bg-clr_blue_bg dark:bg-[#2a2a2a] text-clr_blue_darker dark:text-white font-medium" : "text-clr_gray_dark dark:text-gray-400 hover:bg-clr_blue_bg/50 dark:hover:bg-[#2a2a2a] hover:text-clr_blue_darker dark:hover:text-white"}
                        `}
                      >
                        <Icon className="w-5 h-5 min-w-5" />
                        {!collapsed && <span className="text-sm font-medium truncate ml-3">{item.label}</span>}
                      </button>
                    </TooltipTrigger>
                    {collapsed && <TooltipContent side="right">{item.label}</TooltipContent>}
                  </Tooltip>
                </li>
              );
            })}
          </ul>
        </TooltipProvider>
      </nav>
      <div className="mt-auto border-t border-clr_gray_light p-4">
        <div className={`flex items-center ${collapsed ? "justify-center" : "justify-between"}`}>
          {!collapsed && (
            <div className="flex flex-col">
              <p className="text-sm font-medium max-w-[120px] truncate break-all capitalize">
                {user?.full_name || "User"}
              </p>
            </div>
          )}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="rounded-full h-9 w-9 p-0">
                <Avatar className="h-9 w-9">
                  <AvatarImage src={user?.image || "/placeholder.svg"} alt={user?.full_name || user?.name || "User"} />
                  <AvatarFallback>{user?.full_name?.charAt(0) || user?.name?.charAt(0) || "U"}</AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="min-w-36">
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
          <AlertDialog open={confirm} onOpenChange={setConfirm}>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Confirm Logout</AlertDialogTitle>
                <AlertDialogDescription>Are you sure you want to log out?</AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  onClick={() => {
                    logout();
                    navigate("/login", { replace: true });
                  }}
                  className="bg-red-600 hover:bg-red-700 text-white"
                >
                  Log out
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>
    </aside>
  );
}

function BottomNav() {
  const location = useLocation();
  const navigate = useNavigate();
  const { courses, selectedCourse, feePaid } = useApp();
  const { slotId } = useParams();
  const course = courses?.find((item) => item?.slot?._id === resolveSlotId(slotId)) || selectedCourse;
  const hasCourse = course && Object.keys(course).length > 0;
  const completed = course?.status === "completed" || course?.status === "certified";

  const items = [{ path: "/courses", icon: Home, label: "Home", disabled: false }];
  if (!location.pathname.includes("/courses")) {
    items.push(
      { path: `/dashboard/${slotId}`, icon: LayoutDashboard, label: "Dashboard", disabled: !hasCourse || !slotId },
      { path: `/fee/${slotId}`, icon: Wallet, label: "Payment", disabled: !hasCourse || !slotId },
      { path: `/quiz/${slotId}`, icon: GraduationCap, label: "Quiz", disabled: !(hasCourse && (hasCourse || completed)) || !slotId },
      {
        path: `/progress/${slotId}/${course?.course?._id}`,
        icon: BookOpen,
        label: "Progress",
        disabled: !(hasCourse && (hasCourse || completed)) || !slotId,
      },
    );
  }
  let visible = items;
  if (!feePaid && course?.status !== "completed" && course?.status !== "certified") {
    visible = items.filter((item) => item.path.includes("/fee") || item.path === "/courses");
  }

  return (
    <nav
      id="bottom-nav"
      className="md:hidden fixed bottom-0 left-0 right-0 bg-white dark:bg-[#222222] border-t border-gray-200 dark:border-[#2e2e2e] z-50 safe-area-pb"
    >
      <div className="flex items-center justify-around  py-0">
        {visible.map((item) => {
          const Icon = item.icon;
          const active =
            location.pathname === item.path ||
            (item.path.includes("/dashboard") && location.pathname === "/") ||
            (item.path.includes("/courses") && location.pathname.includes("/course"));
          return (
            <div key={item.path} className="flex py-1 flex-col items-center justify-center space-y-1">
              <button
                onClick={() => !item.disabled && navigate(item.path)}
                disabled={item.disabled}
                className={`
                flex flex-col items-center justify-center  rounded-lg min-w-[60px] transition-all duration-200
                ${item.disabled ? "text-gray-400 cursor-not-allowed opacity-50" : active ? "text-clr_blue_darker dark:text-white" : "text-gray-600 dark:text-gray-400 hover:text-clr_blue_darker dark:hover:text-white"}
              `}
              >
                <div
                  className={`
                  p-2 flex items-center flex-col rounded-full transition-transform duration-200
                  ${active ? "bg-clr_blue text-white scale-110 shadow-lg" : item.disabled ? "" : "hover:font-bold"}
                `}
                >
                  <Icon className="w-4 h-4" />
                </div>
              </button>
              <span className="text-[10px]">{item.label}</span>
            </div>
          );
        })}
      </div>
    </nav>
  );
}

export function StudentLayout() {
  const { user, setCourses, setSelectedCourse } = useApp();
  const { slotId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [inactive, setInactive] = useState(false);
  const hideQuiz = !!location.pathname.startsWith("/quiz");
  const { theme, toggleTheme } = useTheme();

  useEffect(() => {
    setCourses(db.studentCourses);
    if (slotId) {
      const course = findStudentCourse(slotId);
      setSelectedCourse(course || null);
      const inactiveSlot = course?.slot?.status == "inactive";
      if (course?.status == "enrolled" && inactiveSlot && location.pathname != "/courses") setInactive(true);
    }
    if (location.pathname == "/courses") setInactive(false);
  }, [slotId, location.pathname, setCourses, setSelectedCourse]);

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-[#141414] relative">
      {location.pathname === "/courses" ? null : <StudentSidebar />}
      <div className="flex-1 flex flex-col">
        <div className="md:hidden bg-transparent flex items-center justify-between w-full px-2 py-2">
          <button
            className="rounded-3xl p-2"
            onClick={() => navigate("/profile")}
            onKeyDown={(event) => event.key === "Enter" && navigate("/profile")}
            aria-label="Go to profile"
          >
            <img src={user?.image || "/placeholder.svg"} className="h-10 w-10 rounded-3xl" alt="Profile" />
          </button>
          <div className="flex items-center gap-2 mr-2">
            <button
              onClick={toggleTheme}
              className="h-9 w-9 flex items-center justify-center rounded-md border border-input bg-background text-muted-foreground hover:bg-accent hover:text-accent-foreground transition-colors"
              aria-label="Toggle dark mode"
            >
              {theme === "dark" ? <Sun className="w-[18px] h-[18px]" /> : <Moon className="w-[18px] h-[18px]" />}
            </button>
            <FeedbackButton isHide={hideQuiz} userType="student" inline />
          </div>
        </div>
        <div className="flex-1 overflow-auto bg-gradient-to-r from-blue-50/5 to-green-50/10 dark:bg-none dark:bg-[#141414] mobile-content-spacing relative">
          <div className="px-2">
            <Outlet />
          </div>
          {location.pathname !== "/courses" && (
            <FeedbackButton isHide={hideQuiz} hideOnShrink userType="student" />
          )}
          {inactive && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
              <div className="mx-auto max-w-md rounded-lg bg-white p-8 shadow-lg">
                <h2 className="mb-4 text-center text-2xl font-semibold text-red-600">Slot Inactive</h2>
                <p className="mb-6 text-center leading-relaxed text-gray-700">
                  Your assigned slot is currently inactive, so you don’t have access at the moment. Please reach out to your{" "}
                  <span className="font-semibold">Administrator</span> to have it reactivated.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
      <BottomNav />
    </div>
  );
}
