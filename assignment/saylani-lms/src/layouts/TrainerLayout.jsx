import { useEffect, useState } from "react";
import {
  Calendar,
  CalendarCheck,
  ChevronsLeft,
  ChevronsRight,
  LayoutDashboard,
  LogOut,
  Menu,
  Moon,
  Sun,
  User,
  X,
} from "lucide-react";
import { Outlet, useNavigate, useLocation, useParams } from "react-router-dom";
import { useApp } from "../context/AppContext";
import { useTheme } from "../context/ThemeContext";
import { db, findSlot } from "../data/db";
import { he } from "../lib/toast";
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
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../components/ui";

const TRAINER_NAV = [
  { disabled: false, path: "/trainer", label: "Dashboard", icon: LayoutDashboard },
  { disabled: false, path: "/trainer/calendar", label: "Calendar", icon: Calendar },
  { disabled: false, path: "/trainer/attendance", label: "Attendance", icon: CalendarCheck },
];

function TrainerSidebar({ isOpen, setIsOpen }) {
  const [isMobile, setIsMobile] = useState(false);
  const [collapsed, setCollapsed] = useState(true);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useApp();
  const [confirm, setConfirm] = useState(false);
  const { theme, toggleTheme } = useTheme();

  useEffect(() => {
    const onResize = () => {
      setIsMobile(window.innerWidth < 768);
      if (window.innerWidth >= 768) setIsOpen(false);
    };
    onResize();
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [setIsOpen]);

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="md:hidden fixed top-4 left-4 z-30 p-2 rounded-md bg-white dark:bg-[#222222] shadow-md border border-clr_gray_light dark:border-[#2e2e2e]"
        aria-label="Open menu"
      >
        <Menu className="w-5 h-5 text-clr_blue_darker dark:text-gray-300" />
      </button>
      {isOpen && (
        <div
          role="button"
          tabIndex={0}
          className="md:hidden fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
          onClick={() => setIsOpen(false)}
          onKeyDown={(event) => {
            if (event.key === "Enter" || event.key === " ") setIsOpen(false);
          }}
        />
      )}
      <aside
        className={`
          fixed md:sticky top-0 h-[100dvh] bg-white dark:bg-[#222222] shadow-sm border-r border-r-clr_blue_bg dark:border-r-[#2e2e2e] z-50
          transition-all duration-300 ease-in-out overflow-y-auto
          ${isOpen ? "left-0" : "-left-full md:left-0"}
          ${collapsed ? "md:w-[70px]" : "w-[280px] sm:w-[320px] md:w-[220px] lg:w-[220px]"}
          flex flex-col
        `}
      >
        <div className="flex items-center justify-between p-4 border-b border-clr_gray_light dark:border-[#2e2e2e]">
          {!collapsed && (
            <div className="absolute left-1/3 transform -translate-x-1/2">
              <img src={LOGO} alt="Logo" className="h-14 w-auto" />
            </div>
          )}
          <div className="flex items-center gap-2 ml-auto">
            <button
              onClick={() => setIsOpen(false)}
              className="md:hidden p-1.5 rounded-full hover:bg-clr_blue_bg dark:hover:bg-[#2a2a2a] text-clr_gray"
              aria-label="Close menu"
            >
              <X className="w-5 h-5" />
            </button>
            <button
              onClick={() => setCollapsed((value) => !value)}
              className="hidden md:flex p-1.5 rounded-full hover:bg-clr_blue_bg dark:hover:bg-[#2a2a2a] text-clr_gray"
              aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
            >
              {collapsed ? <ChevronsRight className="w-5 h-5" /> : <ChevronsLeft className="w-5 h-5" />}
            </button>
          </div>
        </div>
        <nav className="flex-1 py-4">
          <TooltipProvider delayDuration={0}>
            <ul className="space-y-1 px-2">
              {TRAINER_NAV.map((item) => {
                const Icon = item.icon;
                const active = location.pathname === item.path;
                return (
                  <li key={item.path}>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <button
                          onClick={() => {
                            if (!item.disabled) {
                              navigate(item.path);
                              if (isMobile) setIsOpen(false);
                            }
                          }}
                          disabled={item.disabled}
                          className={`
                            w-full flex items-center px-3 py-2.5 rounded-md transition-colors
                            ${collapsed ? "justify-center" : ""}
                            ${item.disabled ? "text-clr_gray dark:text-gray-600 cursor-not-allowed" : active ? "bg-clr_blue_bg dark:bg-[#2a2a2a] text-clr_blue_darker dark:text-white font-medium" : "text-clr_gray_dark dark:text-gray-400 hover:bg-clr_blue_bg/50 dark:hover:bg-[#2a2a2a] hover:text-clr_blue_darker dark:hover:text-white"}
                          `}
                        >
                          <Icon className={`w-5 h-5 min-w-5 ${collapsed ? "" : "mr-3"}`} />
                          {!collapsed && <span className="text-sm font-medium truncate">{item.label}</span>}
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
        <div className="mt-auto border-t border-clr_gray_light dark:border-[#2e2e2e] p-4 cursor-pointer">
          <div className={`flex items-center ${collapsed ? "justify-center" : "justify-between"}`}>
            {!collapsed && (
              <div className="flex flex-col">
                <p className="text-sm font-medium truncate">{user?.en?.trainer_name || "Trainer"}</p>
                <p className="text-xs text-clr_gray capitalize">{user?.role}</p>
              </div>
            )}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="rounded-full h-9 w-9 p-0">
                  <Avatar className="h-9 w-9">
                    <AvatarImage src={user?.image} alt={user?.en?.trainer_name || "Trainer"} />
                    <AvatarFallback>{user?.en?.trainer_name?.charAt(0) || "T"}</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="min-w-36">
                <DropdownMenuItem onClick={() => navigate("/trainer/profile")}>
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
                      he("Logout Successfully!", "success");
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
    </>
  );
}

export function TrainerLayout() {
  const { user, setTrainerAuth, setTrainerSlots, setSelectedSlot } = useApp();
  const [open, setOpen] = useState(false);
  const { id } = useParams();

  useEffect(() => {
    if (user) setTrainerAuth(user);
    setTrainerSlots(db.trainerSlots);
    if (id) setSelectedSlot(findSlot(id) || db.slots.find((slot) => slot._id == id) || null);
  }, [user, id, setTrainerAuth, setTrainerSlots, setSelectedSlot]);

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50 dark:bg-[#141414]">
      <TrainerSidebar isOpen={open} setIsOpen={setOpen} />
      <div className="flex-1 flex flex-col min-h-0 min-w-0">
        <div className="md:hidden flex items-center p-4 border-b dark:border-b-[#2e2e2e] dark:bg-[#222222]">
          <button onClick={() => setOpen(true)} className="p-2 rounded-md text-icon_gray_dark shadow-sm">
            <Menu className="w-5 h-5 shadow-none" />
          </button>
        </div>
        <div className="flex-1 min-h-0 min-w-0 overflow-auto overscroll-contain p-4 bg-gray-50/50 dark:bg-[#141414] relative">
          <FeedbackButton userType="trainer" />
          <Outlet />
        </div>
      </div>
    </div>
  );
}
