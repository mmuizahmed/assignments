import { useEffect, useMemo, useRef, useState } from "react";
import { clsx } from "clsx";
import {
  ArrowLeft,
  BookOpen,
  Bug,
  Calendar,
  Check,
  CheckCheck,
  CheckCircle2,
  ChevronRight,
  Clock,
  Clock3,
  Copy,
  Hash,
  Lightbulb,
  MapPin,
  MessageSquare,
  MessageSquareText,
  Sparkles,
  User,
  Users,
} from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import { format } from "date-fns";
import { db } from "../data/db";
import { useApp } from "../context/AppContext";
import {
  formatBillingMonth,
  formatRelativeCompleted,
  parseScheduleParts,
  scheduleDayNames,
  useIsMobile,
  weekCells,
} from "../lib/format";
import { he } from "../lib/toast";
import { WHATSAPP } from "../lib/utils";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
  Badge,
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  Input,
  Label,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  StatusBadge,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
  Textarea,
} from "./ui";

const BAR_COLORS = { red: "bg-red-500", orange: "bg-orange-500", green: "bg-green-500" };
const SLOT_PALETTE = [
  "bg-green-100 dark:bg-green-950/60",
  "bg-blue-100 dark:bg-blue-950/60",
  "bg-slate-100 dark:bg-slate-800/60",
  "bg-rose-100 dark:bg-rose-950/60",
  "bg-cyan-100 dark:bg-cyan-950/60",
  "bg-indigo-100 dark:bg-indigo-950/60",
  "bg-purple-100 dark:bg-purple-950/60",
];

export function ProgressBar({ percentage, color }) {
  const resolved = () => (color && BAR_COLORS[color] ? color : percentage < 60 ? "red" : percentage < 75 ? "orange" : "green");
  return (
    <div className="w-full bg-gray-200 rounded h-2 overflow-hidden">
      <div className={`h-full transition-all duration-300 ${BAR_COLORS[resolved()]}`} style={{ width: `${percentage || 0}%` }} />
    </div>
  );
}

export function AttendanceOverview({ percentage }) {
  const value = Number.isNaN(percentage) || percentage == null ? 0 : Number(percentage);
  const color = value >= 75 ? "#16a34a" : value >= 60 ? "#d97706" : "#dc2626";
  return (
    <Card className="shadow-sm">
      <CardHeader className="pb-2 -mt-2">
        <CardTitle className="text-lg">Attendance Overview</CardTitle>
      </CardHeader>
      <CardContent className="pt-0 space-y-2">
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            {value >= 75 ? "Your attendance is good. Keep it up!" : "Your attendance is below 75%. Please improve."}
          </p>
          <span className="text-2xl font-bold" style={{ color }}>
            {value}%
          </span>
        </div>
        <ProgressBar percentage={value} />
      </CardContent>
    </Card>
  );
}

export function StatCard({ title, value, icon: Icon, iconColor = "text-slate-500", iconBg = "bg-slate-100", disabled = false, className = "", onclick = null }) {
  return (
    <Card
      onClick={onclick || undefined}
      className={clsx("shadow-sm hover:shadow-md transition-shadow", disabled && "pointer-events-none opacity-50", className)}
    >
      <CardContent className="p-4 sm:p-6">
        <div className="flex justify-between items-start">
          <div>
            <p className="text-lg sm:text-2xl font-medium">{value}</p>
            <h3 className="text-sm sm:text-md font-medium mt-1">{title}</h3>
          </div>
          {Icon && (
            <div className={clsx("p-2.5 rounded-full dark:bg-[#2a2a2a]", iconBg)}>
              <Icon className={clsx("h-5 w-5 sm:h-6 sm:w-6", iconColor)} />
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

export function CourseCard({ data }) {
  const hasSlot = !!data?.slot;
  const clickable =
    data?.status === "enrolled" ||
    data?.status === "completed" ||
    data?.status === "certified" ||
    data?.status === "dropout";
  const navigate = useNavigate();
  const { setSelectedCourse } = useApp();
  const progress = data?.progress_percentage || 0;
  const chips = data?.slot?.schedule ? data.slot.schedule.split(" | ") : [];
  const onCourses = useLocation().pathname.includes("/courses");
  const slug = data?.course?.course_slug || "";
  const [enrollOpen, setEnrollOpen] = useState(false);

  const goDashboard = () => {
    const slotId = data?.slot?._id || "";
    if (data?.status !== "passed" && hasSlot) {
      setSelectedCourse(data);
      navigate(`/dashboard/${slotId}`);
    }
  };

  return (
    <div
      className=""
      onClick={hasSlot && clickable ? goDashboard : undefined}
      onKeyDown={(event) => {
        if (hasSlot && clickable && (event.key === "Enter" || event.key === " ")) goDashboard();
      }}
      role={hasSlot && clickable ? "button" : undefined}
      tabIndex={hasSlot && clickable ? 0 : -1}
    >
      <Card className={`overflow-hidden border transition-shadow shadow-sm duration-300 ${hasSlot && onCourses ? "hover:shadow-sm cursor-pointer" : "cursor-default"}`}>
        <CardHeader className="pb-3 bg-blue-50/70">
          <div className="flex justify-between items-start">
            <CardTitle className="text-2xl font-semibold line-clamp-1">
              {data?.course?.en?.course_name || "Course Name"}
            </CardTitle>
            <StatusBadge status={data?.status} />
          </div>
          {slug ? (
            <div className="flex items-center mt-1">
              <BookOpen className="h-4 w-4 text-clr_slate mr-1" />
              <span className="text-sm text-slate-600">{slug}</span>
            </div>
          ) : null}
          {chips.length > 0 && !onCourses ? (
            <div className="py-2 rounded-md ">
              <div className="flex items-start ">
                <div className="mt-0.5" />
                <div className="flex-1 flex items-baseline">
                  <div className="flex flex-wrap items-center gap-1.5">
                    {chips.map((chip, index) => (
                      <Badge
                        key={index}
                        variant="outline"
                        className="bg-white dark:bg-[#2a2a2a] border-slate-200 dark:border-[#3a3a3a] text-slate-700 dark:text-gray-300 px-2.5 py-0.5 font-normal text-xs md:text-sm whitespace-nowrap"
                      >
                        {chip}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ) : null}
        </CardHeader>
        {data?.status == "enrolled" && (
          <div className=" px-6">
            <div className="flex items-end justify-between mt-2 mb-1">
              <span className="text-sm font-medium text-slate-600">Progress</span>
              <span className="text-sm font-medium text-slate-600">{progress}% Completed</span>
            </div>
            <ProgressBar percentage={progress} color="green" />
          </div>
        )}
        <CardContent className="py-4">
          {data?.status !== "passed" && (
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className="flex items-center gap-2">
                <Hash className="h-4 w-4 text-clr_slate" />
                <span className="text-sm font-medium">Batch:</span>
                <span className="text-sm text-slate-600">{data?.batch_number}</span>
              </div>
              <div className="flex items-center gap-2">
                <User className="h-4 w-4 text-clr_slate" />
                <span className="text-sm font-medium">Roll:</span>
                <span className="text-sm text-slate-600">{data?.roll_number}</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-clr_slate" />
                <span className="text-sm font-medium">Campus:</span>
                {data?.slot?.campus?.en?.campus_name && (
                  <span className="text-sm text-slate-600 line-clamp-1">{data.slot.campus.en.campus_name}</span>
                )}
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-clr_slate" />
                <span className="text-sm font-medium">City:</span>
                <span className="text-sm text-slate-600">{data?.city?.en?.city_name || "Not specified"}</span>
              </div>
            </div>
          )}
          {data?.status === "passed" && data?.new_course ? (
            <div className="mt-4">
              <Button
                className="w-full bg-sky-600 hover:bg-sky-700 text-white"
                onClick={(event) => {
                  event.stopPropagation();
                  setEnrollOpen(true);
                }}
              >
                Choose Your Time Slot
              </Button>
            </div>
          ) : null}
          {!hasSlot &&
          (data?.status === "enrolled" || data?.status === "completed" || data?.status === "certified") ? (
            <div className="mt-4">
              <Badge className="w-full bg-red-100 text-red-800 px-3 py-2 text-center font-medium hover:bg-red-100">
                Please contact your administrator to assign a slot
              </Badge>
            </div>
          ) : null}
          {onCourses && hasSlot && clickable ? (
            <div className="mt-4">
              <button
                type="button"
                className="border dark:border-[#3a3a3a] font-bold flex items-center justify-center rounded-xl p-2 w-full hover:bg-slate-50 dark:hover:bg-[#2a2a2a] transition-colors"
                onClick={(event) => {
                  event.stopPropagation();
                  goDashboard();
                }}
              >
                <Sparkles className="mr-2" /> View Details
              </button>
            </div>
          ) : null}
          {!onCourses && data?.slot?.whatsapp_link ? (
            <div className="mt-4 pt-4 flex items-center justify-between max-md:flex-col max-md:items-start max-md:justify-center border-t">
              <div className="flex items-center gap-3">
                <img src={WHATSAPP} alt="WhatsApp" className="h-5 w-5" />
                <div>
                  <p className="font-semibold text-slate-800 dark:text-slate-200">Class group on WhatsApp</p>
                  <p className="text-sm text-slate-500">Get announcements, notes & reminders</p>
                </div>
              </div>
              <button
                type="button"
                onClick={(event) => {
                  event.stopPropagation();
                  window.open(data.slot.whatsapp_link, "_blank", "noopener,noreferrer");
                }}
                className="flex items-center text-green-600 cursor-pointer max-md:self-end max-md:mt-2"
              >
                <span>Join group</span>
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          ) : null}
        </CardContent>
      </Card>
      <Dialog open={enrollOpen} onOpenChange={setEnrollOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Choose Your Time Slot</DialogTitle>
            <DialogDescription>Select a campus and slot to enroll.</DialogDescription>
          </DialogHeader>
          <div className="space-y-3">
            <Label>Campus</Label>
            <Input value="SMIT Gulshan" readOnly />
            <Label>Slot</Label>
            <Input value={db.enrollSlots.new_course_002?.[0]?.schedule || ""} readOnly />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEnrollOpen(false)}>
              Cancel
            </Button>
            <Button
              className="bg-clr_navy"
              onClick={() => {
                he("Congratulations! Your enrollment is now complete", "success");
                setEnrollOpen(false);
              }}
            >
              Enroll
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export function SlotCard({ slot, index = 0 }) {
  const navigate = useNavigate();
  const { setSelectedSlot } = useApp();
  const percent = slot?.completion_percentage;
  const palette = SLOT_PALETTE[index % SLOT_PALETTE.length];
  return (
    <Card
      onClick={() => {
        setSelectedSlot(slot);
        navigate(`/trainer/${slot?._id}/students`);
      }}
      className="cursor-pointer overflow-hidden space-y-1 hover:shadow-md shadow border-black/8 transition-shadow duration-300 bg-white dark:bg-[#222222]"
    >
      <div className={`min-h-24 relative overflow-hidden px-4 py-3 ${palette}`}>
        <div className="relative z-10 flex items-start justify-between gap-2">
          <div className="min-w-0">
            <h3 className="font-medium text-lg sm:text-xl lg:text-2xl text-gray-600 dark:text-gray-200 leading-tight break-words line-clamp-2">
              {slot?.new_course?.course?.en?.course_name || "Training Session"}
            </h3>
            <p className="text-xs mt-1 text-gray-600 dark:text-gray-400">
              {slot.class_type} | {slot.gender === "male" ? "Male" : "Female"}
            </p>
          </div>
          <div className="flex-shrink-0">
            <StatusBadge status={slot.status} />
          </div>
        </div>
        <div className="relative z-10 flex flex-col sm:flex-row sm:justify-between sm:items-end gap-1 mt-2">
          <p className="text-xs text-gray-500 dark:text-gray-400 break-words">
            {slot.campus?.en?.campus_name} {slot.campus?.city?.en?.city_name && `(${slot.campus.city.en.city_name})`}
          </p>
          <p className="text-xs text-gray-600 font-medium whitespace-nowrap">Batch {slot.new_course?.batch_number}</p>
        </div>
      </div>
      <div className="px-4 py-1">
        <div className="flex items-center mb-1 justify-between mt-2">
          <span className="text-sm font-medium text-gray-600 dark:text-gray-400 mr-2">Progress</span>
          <span className="text-sm font-medium text-gray-600 dark:text-gray-400 mr-2">{percent}% Completed</span>
        </div>
        <ProgressBar percentage={percent} color="green" />
      </div>
      <CardHeader className="pb-2 pt-3 px-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-4 text-gray-500 dark:text-gray-400">
            <p className="flex items-center gap-1">
              <Users className="h-4 w-4" />
              <span className="text-sm font-medium">Enrolled: {slot.enrolled_students}</span>
            </p>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pb-2 space-y-4 px-4">
        <p className="text-muted-foreground flex text-sm text-gray-500">
          <span>
            <Clock className="h-4 w-4 ml-0 m-1" />
          </span>
          <span className="font-medium">Schedule: {slot.schedule} </span>
        </p>
      </CardContent>
      {slot.start_date && (
        <CardContent className="pb-2 space-y-4 px-4">
          <p className="text-muted-foreground flex text-sm text-gray-500">
            <span>
              <Calendar className="h-4 w-4 ml-0 m-1" />
            </span>
            <span className="font-medium my-auto">Started On: {format(new Date(slot.start_date), "d MMM yyyy")}</span>
          </p>
        </CardContent>
      )}
    </Card>
  );
}

function capStatus(status) {
  if (!status) return "";
  return status.charAt(0).toUpperCase() + status.slice(1);
}

function voucherId(row) {
  return row?.blinq_invoice_number || row?.kuickpay_id || row?.jazzcash_id;
}

function paintPayment(status) {
  return status === "paid" ? "approved" : status === "expired" ? "inactive" : "pending";
}

export function CopyButton({
  text,
  className = "",
  variant = "outline",
  size = "sm",
  showText = false,
  successMessage = "Copied to clipboard!",
}) {
  const [copied, setCopied] = useState(false);
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(text || "");
      setCopied(true);
      he(successMessage, "success");
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      he("Failed to copy text", "error");
      console.error("Failed to copy text: ", error);
    }
  };
  return (
    <Button variant={variant} size={size} className={`flex items-center gap-2 ${className}`} onClick={copy} type="button">
      {copied ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
      {showText ? <span className="text-sm">{copied ? "Copied!" : "Copy"}</span> : null}
    </Button>
  );
}

export function PaymentList({ payments }) {
  const pathname = useLocation().pathname;
  const mobile = useIsMobile();
  const rows = useMemo(() => {
    const list = [...(payments || [])];
    return list.sort((a, b) => {
      const newest = new Date(formatBillingMonth(b.billing_month)).getTime();
      const oldest = new Date(formatBillingMonth(a.billing_month)).getTime();
      return newest - oldest;
    });
  }, [payments]);

  if (mobile) {
    if (!payments || payments.length === 0) {
      return (
        <div className="bg-white dark:bg-[#222222] rounded-xl border border-gray-200 dark:border-[#2e2e2e] shadow-sm p-4">
          <h3 className="font-medium text-gray-900 dark:text-gray-100 text-center">No Payment Records</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 text-center mt-2">
            There are no payment records available at this time.
          </p>
        </div>
      );
    }
    return (
      <div className="space-y-4">
        {rows.map((row, index) => (
          <div
            key={row._id || index}
            className="bg-white dark:bg-[#222222] rounded-lg border border-gray-200 dark:border-[#2e2e2e] shadow-sm p-4"
          >
            <div className="flex justify-between items-start mb-3">
              <div>
                <h3 className="font-medium text-gray-900 dark:text-gray-100">{formatBillingMonth(row.billing_month)}</h3>
                <p className="text-sm text-clr_gray">Due: {row.due_date_student}</p>
              </div>
              <StatusBadge status={paintPayment(row.status)}>{capStatus(row.status)}</StatusBadge>
            </div>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-clr_gray">Amount:</span>
                <span className="font-medium">Rs: {row.amount} /-</span>
              </div>
              <div className="flex justify-between">
                <span className="text-clr_gray">Type:</span>
                <span className="font-medium capitalize">{row.type}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-clr_gray">Voucher ID:</span>
                <div className="flex items-center gap-1">
                  <span className="font-medium truncate max-w-[120px]">{voucherId(row)}</span>
                  <CopyButton text={voucherId(row)} />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-xl border border-gray-200 dark:border-[#2e2e2e] shadow-sm bg-white dark:bg-[#222222] duration-300">
      <Table className="w-full">
        <TableHeader>
          <TableRow>
            <TableHead className="text-left">Month</TableHead>
            <TableHead>Amount</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Due date</TableHead>
            <TableHead>Voucher ID</TableHead>
            <TableHead>Status</TableHead>
            {pathname == "/fee" ? <TableHead>Actions</TableHead> : null}
          </TableRow>
        </TableHeader>
        <TableBody>
          {!payments || payments.length === 0 ? (
            <TableRow>
              <TableCell colSpan={7} className="text-center py-6">
                <h3 className="font-medium text-clr_gray_dark">No Payment Records</h3>
                <p className="text-sm text-clr_gray mt-1">There are no payment records available at this time.</p>
              </TableCell>
            </TableRow>
          ) : (
            rows.map((row, index) => (
              <TableRow key={row._id || index} className="hover:bg-muted/50">
                <TableCell>
                  <p className="font-normal mb-1">{formatBillingMonth(row.billing_month)}</p>
                </TableCell>
                <TableCell>
                  <p className="font-normal mb-1">Rs: {row.amount} /-</p>
                </TableCell>
                <TableCell className="capitalize">{row.type}</TableCell>
                <TableCell>{row.due_date_student}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-1">
                    <span>{voucherId(row)}</span>
                    <CopyButton text={voucherId(row)} />
                  </div>
                </TableCell>
                <TableCell>
                  <StatusBadge status={paintPayment(row.status)}>{capStatus(row.status)}</StatusBadge>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}

export function TeachingSchedule({ schedule }) {
  const parsed = parseScheduleParts(Array.isArray(schedule) ? schedule : schedule ? [schedule] : []);
  const cells = weekCells(parsed.days);
  return (
    <div className="flex gap-4 flex-col w-full">
      <Card className="shadow-sm">
        <CardHeader className="flex flex-col px-4 py-3 items-center text-center justify-between pb-2">
          <CardTitle className="text-lg flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Teaching Schedule
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4">
          <div className="grid grid-cols-7 md:grid-cols-1 lg:grid-cols-7 gap-2 mb-2">
            {cells.map((cell, index) => (
              <div
                key={index}
                className={`flex flex-col items-center justify-center p-2 rounded-md ${cell.isActive ? "text-icon_green text-white bg-green-500" : cell.isToday ? "bg-blue-100 border-blue-300 border" : "bg-white border-icon_slate_light border border-gray-300"}`}
              >
                <span className="text-xs font-medium">{cell.day}</span>
                <span className="text-xs font-medium">{cell.date}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export function StudentScheduleWidget() {
  const { selectedCourse } = useApp();
  const [days, setDays] = useState(() => weekCells([]));

  useEffect(() => {
    if (selectedCourse?.slot?.schedule) {
      const active = scheduleDayNames(selectedCourse.slot.schedule);
      setDays(weekCells(active));
    }
  }, [selectedCourse?.slot?.schedule]);

  return (
    <div className="flex gap-4 flex-col w-full">
      <Card className="shadow-sm rounded-lg">
        <CardHeader className="flex flex-row px-4 py-3 items-center justify-between pb-2">
          <CardTitle className="text-lg flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Class Schedule
          </CardTitle>
        </CardHeader>
        <CardContent className="p-2">
          <div className="grid grid-cols-7 gap-2 my-4">
            {days.map((cell, index) => (
              <div
                key={index}
                className={`flex flex-col items-center justify-center p-2 rounded-md ${cell.isActive ? "text-clr_green text-white bg-green-500 " : "bg-white border border-gray-300"}`}
              >
                <span className="text-xs font-medium">{cell.day}</span>
                <span className="text-xs font-medium">{cell.date}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
      <Card className="shadow-sm">
        <CardContent className="p-3">
          <Tabs defaultValue="quizzes" className="w-full">
            <TabsList className="grid w-full grid-cols-3 mb-3">
              <TabsTrigger className="text-xs" value="assignments">
                Assignments
              </TabsTrigger>
              <TabsTrigger className="text-xs" value="quizzes">
                Quizzes
              </TabsTrigger>
              <TabsTrigger className="text-xs" value="events">
                Events
              </TabsTrigger>
            </TabsList>
            <TabsContent value="assignments" className="space-y-4">
              <div className="text-center py-8 text-clr_slate">No pending assignments</div>
            </TabsContent>
            <TabsContent value="quizzes" className="space-y-3">
              <div className="text-center py-8 text-clr_slate">No upcoming quizzes</div>
            </TabsContent>
            <TabsContent value="events">
              <div className="text-center py-8 text-clr_slate">No upcoming events</div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}

const FEEDBACK_TYPES = [
  { value: "bug", icon: <Bug className="size-5 sm:size-6" /> },
  { value: "idea", icon: <Lightbulb className="size-5 sm:size-6" /> },
  { value: "other", icon: <MessageSquare className="size-5 sm:size-6" /> },
];

export function FeedbackButton({ hideOnShrink, userType, isHide, isHome, inline }) {
  const [open, setOpen] = useState(false);
  const [type, setType] = useState("");
  const [note, setNote] = useState("");
  const [images, setImages] = useState([]);
  const fileRef = useRef(null);
  const pathname = useLocation().pathname;
  const onCourses = pathname === "/courses";
  const homePos = "right-4 top-9 max-md:right-12 max-md:top-5";
  const otherPos = "right-4 top-4 max-md:right-12 max-md:top-5";
  void userType;

  const resetForm = () => {
    setType("");
    setNote("");
    setImages([]);
  };

  return (
    <div
      className={
        inline
          ? `${isHide ? "hidden" : ""}`
          : `absolute ${onCourses ? homePos : otherPos} ${isHome && "top-[20px]"} ${hideOnShrink && "max-md:hidden"} ${isHide && "hidden"}`
      }
    >
      <Button className="flex items-center gap-2" onClick={() => setOpen(true)} variant="outline">
        <MessageSquareText className="h-4 w-4" />
        Feedback
      </Button>
      <Dialog
        open={open}
        onOpenChange={(next) => {
          if (!next) {
            setOpen(false);
            resetForm();
          }
        }}
      >
        <DialogContent onOpenAutoFocus={(event) => event.preventDefault()} className="max-w-sm sm:max-w-lg">
          <DialogHeader className="border-b pb-4 flex items-center">
            <DialogTitle>Share Your Feedback</DialogTitle>
            <DialogDescription className="text-center">
              Let us know if we could do anything to improve your learning experience
            </DialogDescription>
          </DialogHeader>
          <form
            className="space-y-3"
            onSubmit={(event) => {
              event.preventDefault();
            }}
          >
            <div>
              <Label className="text-sm font-medium">Select Type *</Label>
              <div className="w-full flex items-center justify-around p-3 rounded-lg transition-all border border-transparent">
                {FEEDBACK_TYPES.map((item) => (
                  <div
                    key={item.value}
                    onClick={() => setType(item.value)}
                    className={`w-1/4 sm:w-1/5 flex flex-col items-center justify-center gap-3 py-2 sm:py-4 border-2 rounded-lg cursor-pointer transition-all hover:shadow-md ${type === item.value ? "border-blue-600 bg-blue-50" : "border-gray-200"}`}
                  >
                    {item.icon}
                    <span className="capitalize">{item.value}</span>
                  </div>
                ))}
              </div>
            </div>
            <Textarea
              id="feedback-textarea"
              placeholder="Your feedback"
              value={note}
              onChange={(event) => setNote(event.target.value)}
            />
            <div className="space-y-1">
              <Label>Reference Images</Label>
              <div className="flex flex-wrap gap-3">
                {images.map((file, index) => (
                  <div
                    key={`${file.name}-${index}`}
                    className="relative group w-[120px] h-[120px] rounded-lg overflow-hidden border border-green-200 bg-green-50 shadow-sm hover:shadow-md transition-all duration-200"
                  >
                    <img src={URL.createObjectURL(file)} alt={file.name} className="w-auto h-full object-cover" />
                    <div className="absolute bottom-0 w-full bg-green-100 text-green-800 text-xs truncate px-2 py-1">
                      {file.name}
                    </div>
                    <button
                      type="button"
                      onClick={() => setImages((list) => list.filter((_, i) => i !== index))}
                      className="absolute top-1 right-1 bg-green-100 text-green-800 rounded-full w-6 h-6 flex items-center justify-center duration-200"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
              <div className="flex gap-2 mt-2">
                <input
                  ref={fileRef}
                  type="file"
                  accept="image/*"
                  multiple
                  disabled={images.length >= 2}
                  className="hidden"
                  id="image-upload"
                  onChange={(event) => {
                    const files = Array.from(event.target.files || []).filter((file) => file.type.startsWith("image/"));
                    setImages((list) => [...list, ...files].slice(0, 2));
                    event.target.value = null;
                  }}
                />
                <label
                  htmlFor="image-upload"
                  className="flex-1 border rounded-md px-3 py-2 text-sm cursor-pointer hover:bg-gray-50 flex items-center"
                >
                  {images.length === 0 ? "No file chosen" : `${images.length} file(s) selected`}
                </label>
                <Button
                  variant="outline"
                  size="sm"
                  className="h-9"
                  type="button"
                  onClick={() => fileRef.current?.click()}
                >
                  + Add Image
                </Button>
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <Button className="bg-blue-600 hover:bg-blue-700" type="submit">
                Send feedback
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export function StudentSearchFilter({ searchTerm, setSearchTerm, statusFilter, setStatusFilter }) {
  return (
    <div className="flex items-center gap-2 w-full">
      <Input
        placeholder="Search by name, email or roll no..."
        value={searchTerm}
        onChange={(event) => setSearchTerm(event.target.value)}
        className="w-56"
      />
      <Select value={statusFilter} onValueChange={setStatusFilter}>
        <SelectTrigger className="w-36">
          <SelectValue placeholder="All" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All</SelectItem>
          <SelectItem value="enrolled">Enrolled</SelectItem>
          <SelectItem value="dropout">Dropout</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}

export function EmptySlots({ title, body }) {
  return (
    <Card className="col-span-full">
      <CardContent className="flex flex-col items-center justify-center py-16">
        <div className="rounded-full bg-slate-100 p-4 mb-4">
          <CheckCircle2 className="h-8 w-8 text-slate-400" />
        </div>
        <h3 className="text-xl font-medium mb-2">{title}</h3>
        <p className="text-muted-foreground text-center max-w-md mb-6">{body}</p>
      </CardContent>
    </Card>
  );
}

export function ProgressRing({
  percentage,
  size = 48,
  strokeWidth = 4,
  circleColor,
  progressColor = "#3B82F6",
  textColor = "#3B82F6",
  animationDuration = 1000,
}) {
  const dark = typeof document !== "undefined" && document.documentElement.classList.contains("dark");
  const track = circleColor ?? (dark ? "#333333" : "#E0E0E0");
  const [animated, setAnimated] = useState(0);
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (animated / 100) * circumference;

  useEffect(() => {
    const start = performance.now();
    let frame;
    const tick = (now) => {
      const progress = Math.min(1, (now - start) / animationDuration);
      setAnimated(percentage * progress);
      if (progress < 1) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [percentage, animationDuration]);

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      <circle stroke={track} fill="transparent" strokeWidth={strokeWidth} r={radius} cx={size / 2} cy={size / 2} />
      <circle
        stroke={progressColor}
        fill="transparent"
        strokeWidth={strokeWidth}
        strokeDasharray={circumference}
        strokeDashoffset={offset}
        strokeLinecap="round"
        r={radius}
        cx={size / 2}
        cy={size / 2}
        transform={`rotate(-90 ${size / 2} ${size / 2})`}
        style={{ transition: "stroke-dashoffset 0.3s linear" }}
      />
      <text
        x="50%"
        y="50%"
        dy=".3em"
        textAnchor="middle"
        fontSize={size / 4}
        fill={textColor}
        fontWeight="bold"
      >
        {`${Math.round(animated)}%`}
      </text>
    </svg>
  );
}

export function CourseModulesAccordion({ modules = [], onTopicClick, canShowAssignment = true }) {
  const { user } = useApp();
  const trainer = user?.role === "trainer";
  const [open, setOpen] = useState([]);
  const dark = typeof document !== "undefined" && document.documentElement.classList.contains("dark");

  return (
    <Accordion type="multiple" className="w-full" value={open} onValueChange={setOpen}>
      {modules.map((mod) => (
        <AccordionItem key={mod.module_id || mod._id} value={mod.module_id || mod._id} className="mb-2 border rounded-lg shadow-sm">
          <AccordionTrigger className="flex items-center justify-between p-3 gap-3 text-left hover:bg-gray-50 rounded-t-lg">
            <div className="flex items-center gap-4 flex-grow">
              <div
                className={`p-1 rounded-full ${mod.completion_percentage === 100 ? "bg-green-100 text-green-600" : "bg-yellow-100 text-yellow-600"}`}
              >
                {mod.completion_percentage === 100 ? (
                  <CheckCheck className="h-5 w-5" />
                ) : (
                  <Clock3 className="h-5 w-5" />
                )}
              </div>
              <div className="flex flex-col">
                <h3 className="text-lg font-semibold text-gray-900">{mod.module_name}</h3>
                <p className="text-sm text-gray-600">
                  Topics: {mod.completed_topics}/{mod.total_topics}
                </p>
              </div>
            </div>
            <div className="ml-auto">
              {mod.completion_percentage ? (
                <ProgressRing
                  percentage={mod.completion_percentage || 0}
                  size={40}
                  strokeWidth={4}
                  circleColor={dark ? "#333333" : "#E0E0E0"}
                  progressColor="#3B82F6"
                  textColor="#3B82F6"
                />
              ) : null}
            </div>
          </AccordionTrigger>
          <AccordionContent className="p-4 border-t bg-gray-50 dark:bg-[#1a1a1a] dark:border-[#2e2e2e] rounded-b-lg">
            <h4 className="text-md font-semibold mb-3 text-gray-800">Topics in {mod.module_name}:</h4>
            <ul className="space-y-3">
              {(mod.topics || []).map((topic) => (
                <li
                  key={topic._id}
                  className="border dark:border-[#2e2e2e] rounded-md p-3 bg-white dark:bg-[#222222] hover:shadow-md transition-shadow"
                >
                  <div className="flex items-center gap-3 justify-between w-full">
                    <button
                      type="button"
                      className="flex gap-2 cursor-pointer flex-grow text-left bg-transparent border-0 p-0 hover:opacity-80 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
                      onClick={() => onTopicClick?.(topic)}
                    >
                      {topic.status === "completed" ? (
                        <CheckCheck className="h-5 w-5 text-green-500 flex-shrink-0" />
                      ) : (
                        <Clock3 className="h-5 w-5 text-yellow-500 flex-shrink-0" />
                      )}
                      <div className="flex-grow">
                        <span className="font-medium text-gray-800 underline">{topic.title}</span>
                        {topic.status === "completed" && topic.completed_at ? (
                          <p className="text-xs text-gray-500 mt-0.5">
                            Completed: {formatRelativeCompleted(topic.completed_at)}
                          </p>
                        ) : null}
                      </div>
                    </button>
                  </div>
                  {canShowAssignment && topic.assignments && topic.assignments.length > 0 ? (
                    <div className="mt-3 pl-3 border-l-2 border-blue-300 bg-blue-50 rounded py-2 px-3">
                      <ul className="space-y-1">
                        {topic.assignments.map((assignment) => (
                          <li key={assignment._id} className="list-none">
                            <button
                              type="button"
                              disabled={!trainer}
                              className={`text-sm flex items-center gap-2 w-full text-left bg-transparent border-0 p-0 cursor-pointer hover:opacity-80 transition-opacity ${trainer ? "text-blue-600 hover:text-blue-800 hover:underline" : "text-gray-700 disabled:cursor-default"}`}
                            >
                              <span className="text-blue-500 flex-shrink-0">•</span>
                              {assignment.title}
                            </button>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ) : null}
                </li>
              ))}
            </ul>
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
}

export function TopicDetailView({ topic, onBack }) {
  if (!topic) {
    return <div className="text-center text-gray-500 py-10">No topic selected.</div>;
  }
  const statusLabel = topic.status ? topic.status.charAt(0).toUpperCase() + topic.status.slice(1) : "";
  return (
    <div className="space-y-4">
      <Button variant="outline" onClick={onBack} className=" bg-transparent">
        <ArrowLeft className="mr-2 h-4 w-4" /> Back to Modules
      </Button>
      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">{topic.title}</CardTitle>
        </CardHeader>
        <CardContent>
          <div
            className="prose prose-sm sm:prose lg:prose-lg xl:prose-xl max-w-none"
            dangerouslySetInnerHTML={{ __html: topic.description || "" }}
          />
          <div className="mt-4 space-y-2">
            <p className="text-sm text-gray-500">Status: {statusLabel}</p>
            {topic.status === "completed" && topic.completed_at ? (
              <p className="text-sm text-gray-500">Completed: {formatRelativeCompleted(topic.completed_at)}</p>
            ) : null}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
