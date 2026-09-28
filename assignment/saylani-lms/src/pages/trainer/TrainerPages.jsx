import { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import {
  ArrowRight,
  Ban,
  BookOpenCheck,
  Calendar as CalendarIcon,
  CalendarCheck,
  ChevronLeft,
  ChevronRight,
  CircleCheckBig,
  CircleDashed,
  CircleX,
  ClipboardList,
  Clock,
  ExternalLink,
  Eye,
  FileCheck,
  FileQuestion,
  ImageOff,
  Loader2,
  Pencil,
  Plus,
  Timer,
  Trash2,
  TrendingUp,
  Users,
  X,
} from "lucide-react";
import { format } from "date-fns";
import ReactQuill from "react-quill-new";
import "react-quill-new/dist/quill.snow.css";
import { useApp } from "../../context/AppContext";
import { db, findSlot, getTrainerClassStats, SLOT_ID } from "../../data/db";
import { calendarScheduleMap, formatMinutes, formatDuration, formatClockTime, useIsMobile } from "../../lib/format";
import { cn } from "../../lib/utils";
import { he } from "../../lib/toast";
import { COVER } from "../../lib/utils";
import {
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
  Calendar,
  Label,
  PageTitle,
  PaginationBar,
  Popover,
  PopoverContent,
  PopoverTrigger,
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
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
  Textarea,
} from "../../components/ui";
import { EmptySlots, SlotCard, StatCard, StudentSearchFilter, TeachingSchedule } from "../../components/widgets";

export function TrainerDashboard() {
  const slots = db.trainerSlots;
  const active = slots.filter((item) => item.status === "active");
  const merged = slots.filter((item) => item.status === "merged");
  const completed = slots.filter((item) => item.status === "completed");
  const enrolled = slots.reduce((sum, item) => sum + item.enrolled_students, 0);
  const dropout = slots.reduce((sum, item) => sum + item.dropout_students, 0);
  const schedules = slots.map((item) => item.schedule);
  return (
    <div className="mb-8 mx-auto">
      <PageTitle title="Dashboard" />
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1">
          <div className="grid grid-cols-1 sm:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4 ">
            <StatCard title="Active Slots" value={active.length || 0} icon={TrendingUp} iconColor="text-green-600" iconBg="bg-green-100" />
            <StatCard title="Enrolled Students" value={enrolled || 0} icon={Users} iconColor="text-blue-600" iconBg="bg-blue-100" />
            <StatCard title="Dropout Students" value={`${dropout || 0}`} icon={Users} iconColor="text-purple-600" iconBg="bg-purple-100" />
          </div>
          <h2 className="pt-5 pb-2 px-2 font-bold">Slots</h2>
          <Tabs defaultValue="active">
            <TabsList>
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="active">Active</TabsTrigger>
              <TabsTrigger value="merged">Merged </TabsTrigger>
              <TabsTrigger value="completed">Completed</TabsTrigger>
            </TabsList>
            <TabsContent value="all">
              <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-2 gap-6 pt-3">
                {slots.length ? slots.map((slot, index) => <SlotCard key={slot._id} slot={slot} index={index} />) : (
                  <EmptySlots title="No training slots assigned" body="You don't have any training slots assigned yet. When you're assigned to a slot, it will appear here." />
                )}
              </div>
            </TabsContent>
            <TabsContent value="active">
              <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-2 gap-6 pt-3">
                {active.length ? active.map((slot, index) => <SlotCard key={slot._id} slot={slot} index={index} />) : (
                  <EmptySlots title="No active training slots" body="You don't have any active training slots right now. When you're assigned to a slot, it will appear here." />
                )}
              </div>
            </TabsContent>
            <TabsContent value="merged">
              <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-2 gap-6 pt-3">
                {merged.length ? merged.map((slot, index) => <SlotCard key={slot._id} slot={slot} index={index} />) : (
                  <EmptySlots title="No merged slots" body="Slots that have been merged will appear here." />
                )}
              </div>
            </TabsContent>
            <TabsContent value="completed">
              <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-2 gap-6 pt-3">
                {completed.length ? completed.map((slot, index) => <SlotCard key={slot._id} slot={slot} index={index} />) : (
                  <EmptySlots title="No completed slots" body="Slots that have been completed will appear here." />
                )}
              </div>
            </TabsContent>
          </Tabs>
        </div>
        <div className="md:w-[200px] lg:w-[300px] flex-shrink-0">
          <div className="flex flex-row gap-4 sticky top-4">
            <TeachingSchedule schedule={schedules} />
          </div>
        </div>
      </div>
    </div>
  );
}

export function TrainerCalendar() {
  const [cursor, setCursor] = useState(new Date());
  const active = db.trainerSlots.filter((item) => item.status === "active");
  const { dayIndexes, scheduleMap } = calendarScheduleMap(active);
  const month = cursor.getMonth();
  const year = cursor.getFullYear();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const startDay = new Date(year, month, 1).getDay();
  const names = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  const weekdays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const cells = [];
  for (let i = 0; i < startDay; i += 1) {
    cells.push(<div key={`empty-${i}`} className="h-24 md:h-32 border border-border/50 bg-muted/10" />);
  }
  for (let day = 1; day <= daysInMonth; day += 1) {
    const date = new Date(year, month, day);
    const isToday = date.toDateString() === new Date().toDateString();
    const weekday = date.getDay();
    const teaching = dayIndexes.includes(weekday);
    const chips = scheduleMap[weekday] || [];
    cells.push(
      <div
        key={day}
        className={cn(
          "h-24 md:h-32 border border-border/50 dark:border-[#2e2e2e] p-1 md:p-2 transition-colors dark:bg-[#222222]",
          isToday && "bg-primary/5 dark:bg-primary/10 border-primary/50 ring-1 ring-primary/30",
          teaching && !isToday && "bg-teal-50/50 dark:bg-teal-900/10",
        )}
      >
        <div className="text-sm font-medium">{day}</div>
        <div className="space-y-1 mt-1 overflow-hidden">
          {chips.slice(0, 2).map((chip, index) => (
            <div key={index} className="text-[10px] truncate bg-teal-600/80 text-white rounded px-1">
              {chip.courseName}
            </div>
          ))}
        </div>
      </div>,
    );
  }
  return (
    <div className="space-y-4">
      <PageTitle title="Calendar" />
      <div className="flex items-center justify-between">
        <Button variant="outline" size="icon" onClick={() => setCursor(new Date(year, month - 1, 1))}>
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <h3 className="text-lg font-semibold">
          {names[month]} {year}
        </h3>
        <Button variant="outline" size="icon" onClick={() => setCursor(new Date(year, month + 1, 1))}>
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
      <div className="grid grid-cols-7 gap-2">
        {weekdays.map((day) => (
          <div key={day} className="text-xs font-medium text-center py-2">
            {day}
          </div>
        ))}
        {cells}
      </div>
    </div>
  );
}

const ATTENDANCE_PAGE_SIZE = 10;

function AttendanceDatePicker({ label, date, onSelect, disabled }) {
  const [open, setOpen] = useState(false);
  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" disabled={disabled} className="w-full sm:w-[160px] justify-start text-left font-normal">
          <CalendarIcon className="mr-2 h-4 w-4" />
          {date ? format(date, "MMM dd") : label}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="p-0 w-auto" align="start">
        <Calendar
          selected={date}
          onSelect={(value) => {
            onSelect(value);
            setOpen(false);
          }}
        />
      </PopoverContent>
    </Popover>
  );
}

function AttendanceTable({ attendanceData = [], isLoading = false }) {
  if (isLoading) {
    return (
      <div className="space-y-3">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-full" />
      </div>
    );
  }
  if (!attendanceData.length) {
    return (
      <div className="flex flex-col items-center justify-center gap-3 py-10">
        <h1>No attendance records found.</h1>
      </div>
    );
  }
  const totalLate = attendanceData.reduce(
    (sum, row) => sum + ((row.early_check_out_minutes ?? 0) + (row.late_check_in_minutes ?? 0)),
    0,
  );
  const totalMinutes = attendanceData.reduce((sum, row) => sum + (row.minutes || 0), 0);
  return (
    <div className="overflow-x-auto bg-white dark:bg-[#222222] rounded-lg shadow">
      <Table>
        <TableHeader>
          <TableRow className="bg-gray-50 dark:bg-[#2a2a2a]">
            <TableHead className="font-semibold text-gray-700 dark:text-gray-300">Date</TableHead>
            <TableHead className="font-semibold text-gray-700 dark:text-gray-300">Check In</TableHead>
            <TableHead className="font-semibold text-gray-700 dark:text-gray-300">Check Out</TableHead>
            <TableHead className="font-semibold text-gray-700 dark:text-gray-300">Late (min)</TableHead>
            <TableHead className="font-semibold text-gray-700 dark:text-gray-300">Duration</TableHead>
            <TableHead className="font-semibold text-gray-700 dark:text-gray-300">Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {attendanceData.map((row, index) => (
            <TableRow
              key={row._id || index}
              className={`${index % 2 === 0 ? "bg-white dark:bg-[#222222]" : "bg-gray-25 dark:bg-[#252525]"} hover:bg-gray-50 dark:hover:bg-[#2a2a2a] px-6`}
            >
              <TableCell className="font-medium">{row.check_in ? format(new Date(row.check_in), "MMM d, yyyy") : "-"}</TableCell>
              <TableCell>
                <div className="flex items-start flex-col gap-1">
                  <span className="text-sm">{row.check_in ? formatClockTime(row.check_in) : "-"}</span>
                  {row.late_check_in_minutes > 0 && (
                    <span className="text-sm text-yellow-600 border rounded-sm px-1">Late: {row.late_check_in_minutes}m</span>
                  )}
                </div>
              </TableCell>
              <TableCell>
                {row.check_out ? (
                  <div className="flex items-start flex-col gap-1">
                    <span className="text-sm">{formatClockTime(row.check_out)}</span>
                    {row.early_check_out_minutes > 0 && (
                      <span className="text-sm text-yellow-600 border rounded-sm px-1">Early: {row.early_check_out_minutes}m</span>
                    )}
                  </div>
                ) : (
                  <Badge variant="outline">Not Checked Out</Badge>
                )}
              </TableCell>
              <TableCell>
                <span className="font-semibold">
                  {formatDuration((row.early_check_out_minutes ?? 0) + (row.late_check_in_minutes ?? 0))}
                </span>
              </TableCell>
              <TableCell>
                <span className="font-semibold">{formatDuration(row.minutes || 0)}</span>
              </TableCell>
              <TableCell>
                <StatusBadge status={row.status} />
              </TableCell>
            </TableRow>
          ))}
          <TableRow className="bg-gray-50 dark:bg-[#2a2a2a] font-medium">
            <TableCell colSpan={3} className="text-right pr-4">
              Totals:
            </TableCell>
            <TableCell>
              <span className="font-semibold">{formatDuration(totalLate)}</span>
            </TableCell>
            <TableCell>
              <span className="font-semibold">{formatDuration(totalMinutes)}</span>
            </TableCell>
            <TableCell />
          </TableRow>
        </TableBody>
      </Table>
    </div>
  );
}

export function TrainerAttendance() {
  const activeSlots = useMemo(() => db.trainerSlots.filter((item) => item.status === "active"), []);
  const now = new Date();
  const [from, setFrom] = useState(() => new Date(now.getFullYear(), now.getMonth() - 1, 20));
  const [to, setTo] = useState(() => new Date(now.getFullYear(), now.getMonth(), 20));
  const [slotId, setSlotId] = useState(() => activeSlots?.[0]?._id || "");
  const [page, setPage] = useState(1);
  const [mode, setMode] = useState("overall");

  useEffect(() => {
    setPage(1);
  }, [slotId, from, to]);

  const slot = useMemo(() => db.trainerSlots.find((item) => item._id === slotId), [slotId]);
  const courseName = slot?.new_course?.course?.en?.course_name;
  const schedule = slot?.schedule;

  const filteredRows = useMemo(() => {
    if (!slotId) return [];
    return db.trainerAttendanceRows.filter((row) => {
      const when = new Date(row.check_in).getTime();
      const start = new Date(from.getFullYear(), from.getMonth(), from.getDate()).getTime();
      const end = new Date(to.getFullYear(), to.getMonth(), to.getDate(), 23, 59, 59).getTime();
      return when >= start && when <= end;
    });
  }, [slotId, from, to]);

  const totalClasses = filteredRows.length;
  const totalPages = Math.max(1, Math.ceil(totalClasses / ATTENDANCE_PAGE_SIZE));
  const pageRows = useMemo(
    () => filteredRows.slice((page - 1) * ATTENDANCE_PAGE_SIZE, page * ATTENDANCE_PAGE_SIZE),
    [filteredRows, page],
  );

  const aggregate = (rows) => ({
    attendance_count: rows.length,
    total_minutes: rows.reduce((sum, row) => sum + (row.minutes || 0), 0),
    total_late_minutes: rows.reduce((sum, row) => sum + (row.late_check_in_minutes || 0), 0),
    total_early_minutes: rows.reduce((sum, row) => sum + (row.early_check_out_minutes || 0), 0),
  });
  const stats = mode === "overall" ? aggregate(filteredRows) : aggregate(pageRows);

  return (
    <div className="min-h-screen bg-gray-50/50 dark:bg-[#141414]">
      <div className="mb-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 sm:pr-[150px]">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Attendance</h1>
        </div>
        <div className="w-full sm:w-auto">
          <Select value={slotId} onValueChange={setSlotId}>
            <SelectTrigger className="h-9 w-full sm:w-[280px] [&>span]:min-w-0 [&>span]:flex-1">
              {slotId ? (
                <span className="block truncate text-left">
                  <span className="font-medium">{courseName}</span>
                  <span className="ml-2 text-xs text-gray-500">{schedule || ""}</span>
                </span>
              ) : (
                <SelectValue placeholder="Choose a slot" />
              )}
            </SelectTrigger>
            <SelectContent className="max-w-2xl">
              {activeSlots.map((item) => (
                <SelectItem key={item._id} value={item._id}>
                  <div className="flex flex-col min-w-0 text-left">
                    <span className="text-sm font-medium truncate">{item.new_course?.course?.en?.course_name}</span>
                    <span className="text-xs text-gray-500 truncate">{item.schedule}</span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
        <div>
          <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-100">
            {mode === "overall" ? "Overall Stats" : "This Slot Stats"}
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
            {format(from, "dd MMM yyyy")} — {format(to, "dd MMM yyyy")}
          </p>
        </div>
        <div className="inline-flex rounded-lg border border-gray-200 dark:border-[#2e2e2e] bg-gray-100 dark:bg-[#2a2a2a] p-1">
          <button
            onClick={() => setMode("overall")}
            className={`px-4 py-1.5 text-sm font-medium rounded-md transition-all ${mode === "overall" ? "bg-white dark:bg-[#383838] text-gray-900 dark:text-white shadow-sm" : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"}`}
          >
            Overall
          </button>
          <button
            onClick={() => setMode("this_slot")}
            className={`px-4 py-1.5 text-sm font-medium rounded-md transition-all ${mode === "this_slot" ? "bg-white dark:bg-[#383838] text-gray-900 dark:text-white shadow-sm" : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"}`}
          >
            This Slot
          </button>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-4">
        <StatCard title="Total Classes" value={stats.attendance_count || 0} icon={CalendarIcon} iconColor="text-blue-700" iconBg="bg-blue-100" />
        <StatCard title="Total Time Served" value={formatDuration(stats.total_minutes || 0)} icon={Timer} iconColor="text-green-700" iconBg="bg-green-100" />
        <StatCard
          title="Total Late Minutes"
          value={formatDuration((stats.total_late_minutes || 0) + (stats.total_early_minutes || 0))}
          icon={Timer}
          iconColor="text-red-700"
          iconBg="bg-red-100"
        />
      </div>
      <div className="mb-8">
        <div className="flex flex-col md:flex-row md:items-center justify-end gap-4 mb-3">
          <div className="flex flex-wrap items-end gap-2 bg-gray-100 dark:bg-[#2a2a2a] border border-gray-200 dark:border-[#2e2e2e] rounded-xl px-4 py-3">
            <div className="flex flex-col gap-1">
              <span className="text-xs font-semibold text-gray-500 dark:text-gray-400 tracking-wide">From</span>
              <AttendanceDatePicker label="Pick start date" date={from} onSelect={setFrom} />
            </div>
            <div className="text-gray-400 dark:text-gray-500 pb-2">
              <ArrowRight className="h-4 w-4" />
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-xs font-semibold text-gray-500 dark:text-gray-400 tracking-wide">To</span>
              <AttendanceDatePicker label="Pick end date" date={to} onSelect={setTo} />
            </div>
          </div>
        </div>
        <div className="relative overflow-x-auto rounded-xl border border-gray-200 dark:border-[#2e2e2e] shadow-sm bg-white dark:bg-[#222222]">
          <AttendanceTable attendanceData={pageRows} isLoading={false} />
        </div>
      </div>
      {totalPages > 1 && (
        <PaginationBar
          currentPage={page}
          totalPages={totalPages}
          itemsCount={totalClasses}
          itemsPerPage={ATTENDANCE_PAGE_SIZE}
          indexOfFirstItem={(page - 1) * ATTENDANCE_PAGE_SIZE}
          onPageChange={setPage}
          pageName="records"
        />
      )}
    </div>
  );
}

export function TrainerProfile() {
  const { user, updateProfile } = useApp();
  const [edit, setEdit] = useState(false);
  const [bio, setBio] = useState(user?.description || "");
  const [phone, setPhone] = useState(user?.phone_number || "");
  const stats = getTrainerClassStats();
  return (
    <div className="bg-gray-50 py-8 mt-6 dark:bg-[#141414]">
      <div className="relative h-48 md:h-64 rounded-xl overflow-hidden">
        <img src={COVER} alt="" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-blue-900/30" />
      </div>
      <div className="px-4 -mt-12 relative z-10 flex items-end gap-4">
        <Avatar className="h-24 w-24 md:h-28 md:w-28 ring-4 ring-white">
          <AvatarImage src={user?.image} />
          <AvatarFallback>{user?.en?.trainer_name?.charAt(0)}</AvatarFallback>
        </Avatar>
        <div className="pb-2">
          <h2 className="text-2xl font-bold">{user?.en?.trainer_name}</h2>
          <Badge className="capitalize">{user?.role}</Badge>
        </div>
        <div className="ml-auto flex gap-2 pb-2">
          <Button onClick={() => setEdit(true)}>Edit Profile</Button>
          <Button variant="outline" onClick={() => he("Download started", "success")}>
            Download Card
          </Button>
        </div>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-3 gap-4 p-4">
        <StatCard title="Active Slots" value={stats.slots} icon={TrendingUp} iconColor="text-green-600" iconBg="bg-green-100" />
        <StatCard title="Enrolled Students" value={stats.enrolled} icon={Users} iconColor="text-blue-600" iconBg="bg-blue-100" />
        <StatCard
          title="Marked Today"
          value={stats.markedToday ? "Yes" : "No"}
          icon={CalendarCheck}
          iconColor="text-teal-600"
          iconBg="bg-teal-100"
        />
        <StatCard title="Present" value={stats.present} icon={Users} iconColor="text-green-700" iconBg="bg-green-100" />
        <StatCard title="Absent" value={stats.absent} icon={Users} iconColor="text-red-700" iconBg="bg-red-100" />
        <StatCard title="Leave" value={stats.leave} icon={Users} iconColor="text-amber-700" iconBg="bg-amber-100" />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 px-4 pb-2">
        <StatCard
          title="This Month Present"
          value={`${stats.monthPresentPercent}%`}
          icon={CalendarCheck}
          iconColor="text-blue-700"
          iconBg="bg-blue-100"
        />
      </div>
      <div className="grid md:grid-cols-2 gap-4 p-4">
        <Card>
          <CardHeader>
            <CardTitle>Personal Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <p>Email: {user?.email}</p>
            <p>Employee ID: {user?.employee_id}</p>
            <p>Phone: {user?.phone_number}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Two-Factor Authentication</CardTitle>
          </CardHeader>
          <CardContent>
            <StatusBadge status={user?.two_factor_enabled ? "active" : "inactive"}>
              {user?.two_factor_enabled ? "Enabled" : "Disabled"}
            </StatusBadge>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Update Password</CardTitle>
          </CardHeader>
          <CardContent>
            <Button variant="outline">Change password</Button>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Bio</CardTitle>
          </CardHeader>
          <CardContent>
            <div dangerouslySetInnerHTML={{ __html: user?.description || "" }} />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Social Links</CardTitle>
          </CardHeader>
          <CardContent>
            {(user?.social_links || []).map((link) => (
              <a key={link.name} href={link.url} className="text-blue-600 block">
                {link.name}
              </a>
            ))}
          </CardContent>
        </Card>
      </div>
      <Dialog open={edit} onOpenChange={setEdit}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit Profile</DialogTitle>
          </DialogHeader>
          <Label>Phone</Label>
          <Input value={phone} onChange={(event) => setPhone(event.target.value)} />
          <Label>Bio</Label>
          <div className="quill-editor-height">
            <ReactQuill theme="snow" value={bio} onChange={setBio} />
          </div>
          <DialogFooter>
            <Button
              className="bg-[#285192]"
              onClick={() => {
                updateProfile({ phone_number: phone, description: bio });
                he("Profile updated", "success");
                setEdit(false);
              }}
            >
              Save
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function SlotStudents({ searchTerm, statusFilter, slotId }) {
  const navigate = useNavigate();
  const { tabName } = useParams();
  const resolvedSlot = findSlot(slotId)?._id || slotId;
  const rows = db.students.filter((item) => item.slot_id === resolvedSlot).filter((item) => {
    const term = searchTerm.trim().toLowerCase();
    const matchesTerm =
      !term ||
      item.student_full_name.toLowerCase().includes(term) ||
      item.student_email.toLowerCase().includes(term) ||
      item.roll_number.toLowerCase().includes(term);
    const matchesStatus = statusFilter === "all" || item.status === statusFilter;
    return matchesTerm && matchesStatus;
  });
  return (
    <div className="rounded-xl border overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="bg-slate-50 dark:bg-[#2a2a2a]">
            <TableHead>Name</TableHead>
            <TableHead>Roll Number</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Fee</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {rows.map((row) => (
            <TableRow
              key={row.roll_number}
              className="cursor-pointer"
              onClick={() => navigate(`/trainer/${slotId}/${tabName || "students"}/student/${row.roll_number}`)}
            >
              <TableCell>
                <div className="flex items-center gap-2">
                  <img src={row.student_image} alt="" className="w-8 h-8 rounded-full" />
                  {row.student_full_name}
                </div>
              </TableCell>
              <TableCell>{row.roll_number}</TableCell>
              <TableCell>{row.student_email}</TableCell>
              <TableCell>
                <StatusBadge status={row.fee_status || "paid"} />
              </TableCell>
              <TableCell>
                <StatusBadge status={row.status} />
              </TableCell>
              <TableCell>
                <Button size="sm" variant="outline">
                  View
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

function SlotAttendance() {
  const { id } = useParams();
  const slot = findSlot(id);
  const rows = db.classAttendance[slot?._id || SLOT_ID] || [];
  const present = rows.filter((item) => item.status === "present").length;
  const absent = rows.filter((item) => item.status === "absent").length;
  const leave = rows.filter((item) => item.status === "leave").length;
  return (
    <div className="space-y-4">
      <div>
        <Label>Select a Date</Label>
        <Input type="date" defaultValue={new Date().toISOString().slice(0, 10)} className="w-56 mt-1" />
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard title="Total Students" value={rows.length} icon={Users} iconColor="text-blue-700" iconBg="bg-blue-100" />
        <StatCard title="Present" value={present} icon={Users} iconColor="text-green-700" iconBg="bg-green-100" />
        <StatCard title="Absent" value={absent} icon={Users} iconColor="text-red-700" iconBg="bg-red-100" />
        <StatCard title="Leave" value={leave} icon={Users} iconColor="text-amber-700" iconBg="bg-amber-100" />
      </div>
      <div className="rounded-xl border overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Roll #</TableHead>
              <TableHead>Full Name</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.map((row) => (
              <TableRow key={row.roll_number}>
                <TableCell>{row.roll_number}</TableCell>
                <TableCell>{row.full_name}</TableCell>
                <TableCell>
                  <StatusBadge status={row.status} />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

function SlotAssignments({ slotId }) {
  const navigate = useNavigate();
  const { tabName } = useParams();
  const { assignmentModalOpen, setAssignmentModalOpen } = useApp();
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  return (
    <div>
      <div className="rounded-xl border overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Topics</TableHead>
              <TableHead>Due Date</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {db.assignments.map((item) => (
              <TableRow key={item._id} className={item.is_hackathon ? "bg-purple-50 dark:bg-purple-950/20" : ""}>
                <TableCell>{item.title}</TableCell>
                <TableCell className="max-w-xs truncate" dangerouslySetInnerHTML={{ __html: item.description }} />
                <TableCell>{(item.topics || []).map((topic) => topic.title).join(", ")}</TableCell>
                <TableCell>{format(new Date(item.submission_date), "MMM d, yyyy")}</TableCell>
                <TableCell className="flex gap-2">
                  <Button size="icon" variant="ghost" onClick={() => navigate(`/trainer/${slotId}/${tabName || "assignments"}/${item._id}`)}>
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Button size="icon" variant="ghost">
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button size="icon" variant="ghost">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      <Dialog open={assignmentModalOpen} onOpenChange={setAssignmentModalOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>New Assignment</DialogTitle>
          </DialogHeader>
          <Input placeholder="Title" value={title} onChange={(event) => setTitle(event.target.value)} />
          <div className="quill-editor-height">
            <ReactQuill theme="snow" value={body} onChange={setBody} />
          </div>
          <DialogFooter>
            <Button
              className="bg-blue-600 hover:bg-blue-700 text-white"
              onClick={() => {
                he("Assignment created", "success");
                setAssignmentModalOpen(false);
              }}
            >
              Create
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function SlotQuizzes() {
  const navigate = useNavigate();
  const { id, tabName } = useParams();
  return (
    <div className="rounded-xl border overflow-hidden">
      <Table className="min-w-[700px]">
        <TableHeader>
          <TableRow>
            <TableHead>Quiz</TableHead>
            <TableHead>Course(s)</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Expiry</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {db.quizSchedules.map((row) => (
            <TableRow key={row._id}>
              <TableCell>{row.quiz.title}</TableCell>
              <TableCell>{row.quiz.course.map((item) => item.en.course_name).join(", ")}</TableCell>
              <TableCell>{format(new Date(row.date), "MMM d, yyyy")}</TableCell>
              <TableCell>{format(new Date(row.expiry), "MMM d, yyyy")}</TableCell>
              <TableCell>
                <StatusBadge status={row.status} />
              </TableCell>
              <TableCell className="flex gap-2">
                <Button size="sm" variant="outline" onClick={() => he("Status updated", "success")}>
                  Change Status
                </Button>
                <Button size="icon" variant="ghost" onClick={() => navigate(`/trainer/${id}/${tabName}/questions/${row.quiz._id}`)}>
                  <FileQuestion className="h-4 w-4" />
                </Button>
                <Button size="icon" variant="ghost" onClick={() => navigate(`/trainer/${id}/${tabName}/result/${row.quiz._id}`)}>
                  <Eye className="h-4 w-4" />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

function SlotProgress() {
  return (
    <div className="space-y-3">
      <Select defaultValue={SLOT_ID}>
        <SelectTrigger className="w-72">
          <SelectValue placeholder="Compare slot" />
        </SelectTrigger>
        <SelectContent>
          {db.trainerSlots.map((slot) => (
            <SelectItem key={slot._id} value={slot._id}>
              {slot.new_course?.course?.en?.course_name} · {slot.status}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      {db.modules.map((mod) => (
        <Card key={mod._id}>
          <CardHeader>
            <CardTitle>
              {mod.module_name} · {mod.completed_topics}/{mod.total_topics}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {mod.topics.map((topic) => (
              <div key={topic._id} className="flex items-center justify-between border rounded-md p-3">
                <span>{topic.title}</span>
                <div className="flex items-center gap-2">
                  <StatusBadge status={topic.status} />
                  <Button size="sm" variant="outline" onClick={() => he("Topic updated", "success")}>
                    {topic.status === "completed" ? "Revert" : "Complete"}
                  </Button>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

export function SlotShell() {
  const { id, tabName } = useParams();
  const [tab, setTab] = useState(tabName || "students");
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");
  const { selectedSlot, setSelectedSlot, assignmentModalOpen, setAssignmentModalOpen } = useApp();
  const slot = selectedSlot || findSlot(id);
  const courseName = slot?.new_course?.course?.en?.course_name || "";
  const navigate = useNavigate();

  useEffect(() => {
    setTab(tabName || "students");
    if (slot) setSelectedSlot(slot);
  }, [tabName, slot, setSelectedSlot]);

  const go = (next) => {
    setTab(next);
    navigate(`/trainer/${id}/${next}`);
  };
  const tabClass = (name) =>
    `${tab === name ? "border-blue-500 text-gray-900 dark:text-white" : "border-transparent text-gray-500 dark:text-gray-400 hover:border-gray-300 dark:hover:border-gray-600 hover:text-gray-700 dark:hover:text-gray-200"} whitespace-nowrap inline-flex items-center px-3 pt-1 border-b-2 text-sm font-medium min-w-max`;

  return (
    <div>
      <div className="border-gray-200 ">
        <div className="px-0 sm:px-0 pb-4">
          <AppBreadcrumb items={[{ title: "Dashboard", href: "/trainer" }, { title: courseName || "Slot" }]} />
        </div>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between px-0 sm:px-0 mb-4 sm:mb-6">
          <PageTitle title={courseName || "Course Name"} />
          <div className="flex items-center rounded-md py-4 sm:py-0">
            {tab === "assignments" && (
              <Button
                onClick={() => setAssignmentModalOpen(!assignmentModalOpen)}
                className="bg-blue-600 hover:bg-blue-700 w-full text-white shadow-sm transition-colors duration-200"
              >
                <Plus className="w-4 h-4 mr-2" />
                New Assignment
              </Button>
            )}
            {tab === "students" && (
              <StudentSearchFilter searchTerm={search} setSearchTerm={setSearch} statusFilter={status} setStatusFilter={setStatus} />
            )}
          </div>
        </div>
      </div>
      <header className="shadow-[0_3px_1px_-2px_rgba(0,0,0,0.1)] ">
        <div className=" pb-0 px-0 sm:px-0">
          <div className="flex justify-between h-auto sm:h-8">
            <div className="flex w-auto min-w-0 overflow-x-auto no-scrollbar ">
              <nav className="flex pb-0 ">
                <button onClick={() => go("students")} className={tabClass("students")}>
                  <Users className="mr-1 sm:mr-2 h-4 w-4 sm:h-5 sm:w-5 flex-shrink-0" />
                  <span>Students</span>
                </button>
                <button onClick={() => go("attendance")} className={tabClass("attendance")}>
                  <CalendarCheck className="mr-1 sm:mr-2 h-4 w-4 sm:h-5 sm:w-5 flex-shrink-0" />
                  <span>Attendance</span>
                </button>
                <button onClick={() => go("assignments")} className={tabClass("assignments")}>
                  <ClipboardList className="mr-1 sm:mr-2 h-4 w-4 sm:h-5 sm:w-5 flex-shrink-0" />
                  <span>Assignments</span>
                </button>
                <button onClick={() => go("quiz")} className={tabClass("quiz")}>
                  <BookOpenCheck className="mr-1 sm:mr-2 h-4 w-4 sm:h-5 sm:w-5 flex-shrink-0" />
                  <span>Quizzes</span>
                </button>
                <button onClick={() => go("progress")} className={tabClass("progress")}>
                  <BookOpenCheck className="mr-1 sm:mr-2 h-4 w-4 sm:h-5 sm:w-5 flex-shrink-0" />
                  <span>Course Progress</span>
                </button>
              </nav>
            </div>
          </div>
        </div>
      </header>
      <main className="mx-auto  w-full sm:w-full ">
        <div className="py-3 sm:py-5 ">
          {tab === "students" && <SlotStudents searchTerm={search} statusFilter={status} slotId={id} />}
          {tab === "assignments" && <SlotAssignments slotId={id} />}
          {tab === "quiz" && <SlotQuizzes />}
          {tab === "attendance" && <SlotAttendance />}
          {tab === "progress" && <SlotProgress />}
        </div>
      </main>
    </div>
  );
}

export function QuizResults() {
  const { id, tabName, quizId } = useParams();
  const [review, setReview] = useState(false);
  const schedule = db.quizSchedules.find((row) => row.quiz._id === quizId);
  const quiz = schedule?.quiz || db.quiz;
  const results = db.quizResults.filter((row) => row.quiz._id === quizId);
  return (
    <div className="space-y-4">
      <AppBreadcrumb
        items={[
          { title: "Dashboard", href: "/trainer" },
          { title: findSlot(id)?.new_course?.course?.en?.course_name || "Course", href: `/trainer/${id}/${tabName}` },
          { title: quiz.title },
        ]}
      />
      <h2 className="text-2xl font-bold">Quiz Results</h2>
      <div className="rounded-xl border overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Quiz Title</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Score</TableHead>
              <TableHead>Attempts</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {results.length ? (
              results.map((row) => (
                <TableRow key={row._id}>
                  <TableCell>{row.student_induction.student_id.full_name}</TableCell>
                  <TableCell>{row.student_induction.student_id.email}</TableCell>
                  <TableCell>{row.quiz.title}</TableCell>
                  <TableCell>
                    <StatusBadge status={row.status} />
                  </TableCell>
                  <TableCell>
                    {row.score}/{row.total_questions}
                  </TableCell>
                  <TableCell>{row.attempts}</TableCell>
                  <TableCell>{format(new Date(row.createdAt), "MMM d, yyyy")}</TableCell>
                  <TableCell>
                    <Button size="sm" variant="outline" onClick={() => setReview(true)}>
                      Review
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={8} className="text-center py-6">
                  No results yet
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <Dialog open={review} onOpenChange={setReview}>
        <DialogContent className="max-h-[90vh] max-w-6xl overflow-y-auto p-4 sm:p-6">
          <DialogHeader className="pr-8">
            <DialogTitle className="flex items-center gap-2">Quiz Review</DialogTitle>
          </DialogHeader>
          {db.quizQuestions.map((question) => (
            <div key={question._id} className="border rounded-md p-3 mb-2">
              <p className="font-medium">{question.text}</p>
              {question.options.map((opt) => (
                <p key={opt._id} className={opt.is_correct ? "text-green-600" : ""}>
                  {opt.text}
                </p>
              ))}
            </div>
          ))}
        </DialogContent>
      </Dialog>
    </div>
  );
}

export function QuizQuestions() {
  const { id, tabName, quizId } = useParams();
  const quiz = db.quizSchedules.find((row) => row.quiz._id === quizId)?.quiz || db.quiz;
  return (
    <div className="space-y-4">
      <AppBreadcrumb
        items={[
          { title: "Dashboard", href: "/trainer" },
          { title: "Slot", href: `/trainer/${id}/${tabName}` },
          { title: quiz.title },
        ]}
      />
      <h2 className="text-2xl font-bold flex items-center gap-2">
        Quiz Questions <Badge>{db.quizQuestions.length}</Badge>
      </h2>
      {db.quizQuestions.length ? (
        db.quizQuestions.map((question) => (
          <Card key={question._id}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                {question.text} <StatusBadge status="pending">{question.type}</StatusBadge>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-1">
              {question.options.map((opt) => (
                <p key={opt._id} className={opt.is_correct ? "text-green-600" : ""}>
                  {opt.text}
                </p>
              ))}
            </CardContent>
          </Card>
        ))
      ) : (
        <p>No questions found for this quiz.</p>
      )}
    </div>
  );
}

export function TrainerStudentDetail() {
  const { id, roll_number, tabName } = useParams();
  const [tab, setTab] = useState("attendance");
  const student = db.students.find((item) => item.roll_number === roll_number);
  const attendance = db.studentAttendance[roll_number];
  const courseName = findSlot(id)?.new_course?.course?.en?.course_name || "Unknown Course";
  return (
    <div className="space-y-4">
      <AppBreadcrumb
        items={[
          { title: "Dashboard", href: "/trainer" },
          { title: courseName, href: `/trainer/${id}/${tabName}` },
          { title: student?.student_full_name || roll_number },
        ]}
      />
      <div className="flex gap-2">
        {["attendance", "assignments", "quiz"].map((value) => (
          <button
            key={value}
            type="button"
            onClick={() => setTab(value)}
            className={`px-3 py-1 border-b-2 capitalize ${tab === value ? "border-blue-500" : "border-transparent text-gray-500"}`}
          >
            {value === "quiz" ? "Quizzes" : value}
          </button>
        ))}
      </div>
      {tab === "attendance" && attendance && (
        <div className="space-y-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <StatCard title="Total Classes" value={attendance.total_classes} icon={CalendarCheck} />
            <StatCard title="Present" value={attendance.total_present} icon={Users} />
            <StatCard title="Leave" value={attendance.total_leave} icon={Users} />
            <StatCard title="Absent" value={attendance.total_absent} icon={Users} />
          </div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {attendance.attendance.map((row, index) => (
                <TableRow key={index}>
                  <TableCell>{format(new Date(row.date), "MMM d, yyyy")}</TableCell>
                  <TableCell>
                    <StatusBadge status={row.status} />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
      {tab === "assignments" && (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>#</TableHead>
              <TableHead>Title</TableHead>
              <TableHead>Due Date</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Feedback</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {db.assignments.map((item, index) => {
              const sub = db.submissions.find((row) => row.assignment_id === item._id && row.student_details.roll_number === roll_number);
              return (
                <TableRow key={item._id}>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell>
                    {item.title} {item.is_hackathon && <StatusBadge status="hackathon">Hackathon</StatusBadge>}
                  </TableCell>
                  <TableCell>{format(new Date(item.submission_date), "MMM d, yyyy")}</TableCell>
                  <TableCell>
                    <StatusBadge status={sub?.status || "not_submitted"} />
                  </TableCell>
                  <TableCell>{sub?.trainer_feedback || "-"}</TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      )}
      {tab === "quiz" && (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>#</TableHead>
              <TableHead>Quiz Title</TableHead>
              <TableHead>Score</TableHead>
              <TableHead>Total Questions</TableHead>
              <TableHead>Percentage</TableHead>
              <TableHead>Attempts</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Date</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {db.quizResults
              .filter((row) => String(row.roll_number) === String(roll_number))
              .map((row, index) => (
              <TableRow key={row._id}>
                <TableCell>{index + 1}</TableCell>
                <TableCell>{row.quiz.title}</TableCell>
                <TableCell>{row.score}</TableCell>
                <TableCell>{row.total_questions}</TableCell>
                <TableCell>{Math.round((row.score / row.total_questions) * 100)}%</TableCell>
                <TableCell>{row.attempts}</TableCell>
                <TableCell>
                  <StatusBadge status={row.status} />
                </TableCell>
                <TableCell>{format(new Date(row.createdAt), "MMM d, yyyy")}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  );
}

const SUBMISSION_LIST_BADGE = {
  approved: "bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 border-green-200 dark:border-green-800",
  not_approved: "bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300 border-red-200 dark:border-red-800",
  submitted: "bg-blue-50 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 border-blue-100 dark:border-blue-800",
  pending: "bg-blue-100 dark:bg-[#2a2a2a] text-gray-800 dark:text-gray-300 border-gray-200 dark:border-gray-700",
  late_submitted:
    "bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300 border-yellow-200 dark:border-yellow-800",
};

const SUBMISSION_DETAIL_BADGE = {
  approved:
    "bg-green-100 hover:bg-green-100 dark:bg-green-900/30 dark:hover:bg-green-900/30 text-green-800 dark:text-green-300 border-green-200 dark:border-green-800",
  not_approved:
    "bg-red-100 hover:bg-red-100 dark:bg-red-900/30 dark:hover:bg-red-900/30 text-red-800 dark:text-red-300 border-red-200 dark:border-red-800",
  submitted:
    "bg-blue-100 hover:bg-blue-100 dark:bg-blue-900/30 dark:hover:bg-blue-900/30 text-blue-800 dark:text-blue-300 border-blue-200 dark:border-blue-800",
  pending:
    "bg-gray-100 hover:bg-gray-100 dark:bg-[#2a2a2a] dark:hover:bg-[#2a2a2a] text-gray-800 dark:text-gray-300 border-gray-200 dark:border-gray-700",
  late_submitted:
    "bg-yellow-100 hover:bg-yellow-100 dark:bg-yellow-900/30 dark:hover:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300 border-yellow-200 dark:border-yellow-800",
};

function SubmissionStatusIcon({ status }) {
  switch (status) {
    case "approved":
      return <CircleCheckBig className="h-4 w-4 text-green-600" />;
    case "not_approved":
      return <CircleX className="h-4 w-4 text-red-600" />;
    case "submitted":
      return <CircleDashed className="h-4 w-4 text-blue-600" />;
    case "late_submitted":
      return <Clock className="h-4 w-4 text-yellow-600" />;
    case "pending":
    default:
      return <Clock className="h-4 w-4 text-gray-400" />;
  }
}

function submissionStatusLabel(status) {
  return status === "not_approved" ? "Rejected" : String(status || "").replace("_", " ");
}
function SubmissionsList({ submissions, selectedId, onSelect }) {
  const [search, setSearch] = useState("");
  const filtered = submissions.filter((row) => {
    const query = search.toLowerCase();
    const details = row?.student_details || {};
    return (
      details.full_name?.toLowerCase().includes(query) ||
      details.email?.toLowerCase().includes(query) ||
      String(details.roll_number ?? "").includes(query)
    );
  });
  return (
    <div className="bg-white dark:bg-[#222222] rounded-lg shadow-sm border dark:border-[#2e2e2e] h-[calc(100vh-50px)] flex flex-col">
      <div className="p-4 rounded-t-lg border-b dark:border-[#2e2e2e] bg-gray-50 dark:bg-[#2a2a2a] flex-shrink-0 flex items-center justify-between">
        <h2 className="font-semibold text-gray-900 dark:text-white">Submissions</h2>
        <div className="w-full sm:w-64">
          <Input
            type="text"
            placeholder="Search by name, email or roll no..."
            className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            onChange={(event) => setSearch(event.target.value)}
          />
        </div>
      </div>
      <div className="flex-1 overflow-y-auto p-3 space-y-3">
        {filtered.map((row) => {
          const active = row?._id === selectedId;
          return (
            <Card
              key={row?._id}
              onClick={() => onSelect(row)}
              className={`cursor-pointer transition-all duration-200 ${active ? "ring-2 ring-inset ring-blue-500 shadow-md bg-blue-50 dark:bg-blue-900/20" : "hover:shadow-md hover:bg-gray-50 dark:hover:bg-[#2a2a2a]"}`}
            >
              <CardContent className="p-4 h-full flex flex-col">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center space-x-2 min-w-0 flex-1">
                    <div className="flex items-center gap-3">
                      <img
                        src={row?.student_details.image}
                        alt={row?.student_details.full_name}
                        className="w-8 h-8 rounded-full object-cover"
                      />
                      <div className="min-w-0">
                        <span className="block font-medium text-sm text-gray-900 dark:text-gray-100 truncate">
                          {row?.student_details.full_name}
                        </span>
                        <span className="block text-xs text-gray-500 dark:text-gray-400 truncate">
                          {row?.student_details.roll_number}
                        </span>
                      </div>
                    </div>
                  </div>
                  <Badge
                    variant="outline"
                    className={`h-8 ${SUBMISSION_LIST_BADGE[row.status] || SUBMISSION_LIST_BADGE.pending} capitalize hover:bg-none flex items-center justify-center px-3`}
                  >
                    <SubmissionStatusIcon status={row.status} />
                    <span className="ml-1">{submissionStatusLabel(row.status)}</span>
                  </Badge>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
function SubmissionDetail({ submission, onGrade, onDeleteClick }) {
  const [feedback, setFeedback] = useState("");
  const [expanded, setExpanded] = useState(false);
  const [pendingAction, setPendingAction] = useState(null);
  const [editingFeedback, setEditingFeedback] = useState(false);
  const [savingFeedback, setSavingFeedback] = useState(false);

  useEffect(() => {
    setFeedback(submission?.trainer_feedback || "");
    setEditingFeedback(false);
  }, [submission]);

  if (!submission) return null;

  const applyStatus = (nextStatus) => {
    setPendingAction(nextStatus);
    onGrade(submission._id, { status: nextStatus, trainer_feedback: feedback.trim() || submission.trainer_feedback });
    he("Assignment graded successfully!", "success");
    setFeedback("");
    setPendingAction(null);
  };

  const saveFeedback = () => {
    if (!feedback.trim()) return;
    setSavingFeedback(true);
    onGrade(submission._id, { trainer_feedback: feedback.trim() });
    he("Assignment graded successfully!", "success");
    setSavingFeedback(false);
    setEditingFeedback(false);
  };

  const longText =
    (submission.text?.split("\n").length || 0) > 3 || (submission.text?.length || 0) > 200;

  return (
    <div className="bg-white dark:bg-[#222222] rounded-lg border dark:border-[#2e2e2e] shadow-lg h-[calc(100vh-50px)] flex flex-col overflow-hidden">
      <div className="px-6 py-4 border-b dark:border-[#2e2e2e] bg-white dark:bg-[#222222] flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white truncate">
            {submission.student_details.full_name}
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 truncate">{submission.student_details.email}</p>
          {submission.submitted_date && (
            <p className="flex items-center gap-1 text-xs text-gray-400 dark:text-gray-500 mt-1">
              <CalendarIcon className="h-3 w-3" />
              Submitted:{" "}
              {new Date(submission.submitted_date).toLocaleString("en-PK", {
                dateStyle: "medium",
                timeStyle: "short",
              })}
            </p>
          )}
        </div>
        <div className="flex items-center space-x-2">
          <Badge className={`${SUBMISSION_DETAIL_BADGE[submission.status]} capitalize h-8 flex items-center px-3`}>
            <SubmissionStatusIcon status={submission.status} />
            <span className="ml-1">{submissionStatusLabel(submission.status)}</span>
          </Badge>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-slate-600 hover:text-clr_blue"
                  aria-label="View submission logs"
                >
                  <Eye className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>View submission logs</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </div>
      <div className="overflow-y-auto p-6 space-y-4">
        {submission.link && (
          <section>
            <h3 className="text-base font-medium text-gray-900 dark:text-gray-100 mb-2 border-b dark:border-[#2e2e2e]">
              Link
            </h3>
            <a
              href={submission.link}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center space-x-1 text-blue-600 hover:text-blue-600 group"
            >
              <ExternalLink className="h-4 w-4 transition-transform group-hover:scale-110" />
              <span className="underline break-all text-sm">{submission.link}</span>
            </a>
          </section>
        )}
        {submission.text && (
          <section>
            <h3 className="text-base font-medium text-gray-900 dark:text-gray-100 mb-2 border-b dark:border-[#2e2e2e]">
              Description
            </h3>
            <div className="relative">
              <p
                className={`text-black dark:text-gray-200 rounded-md bg-gray-100 dark:bg-[#2a2a2a] p-2 leading-relaxed whitespace-pre-wrap transition-all text-sm ${!expanded && longText ? "max-h-[2.9em] overflow-hidden" : ""}`}
              >
                {submission.text}
              </p>
              {longText && !expanded && (
                <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-10 bg-gradient-to-t from-white dark:from-[#222222]" />
              )}
            </div>
            {longText && (
              <button onClick={() => setExpanded((value) => !value)} className="mt-2 text-blue-400 hover:underline text-sm">
                {expanded ? "Show less" : "See more"}
              </button>
            )}
          </section>
        )}
        <section>
          <h3 className="text-base font-medium text-gray-900 mb-2 border-b">Files</h3>
          {submission.files.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
              {submission.files.map((file, index) => (
                <div key={index} className="relative group cursor-pointer rounded overflow-hidden">
                  <a href={file} target="_blank" rel="noopener noreferrer">
                    <img
                      src={file}
                      alt={`File ${index + 1}`}
                      className="w-full h-28 sm:h-32 object-cover rounded-md shadow-sm group-hover:shadow-md transition-shadow duration-200"
                    />
                    <span className="absolute bottom-1 right-1 bg-black bg-opacity-50 text-white text-xs px-1 rounded">
                      {index + 1}
                    </span>
                  </a>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-6">
              <ImageOff className="h-8 w-8 text-gray-400 mb-2" />
              <p className="text-sm text-gray-500">No files found for this submission.</p>
            </div>
          )}
        </section>
      </div>
      <div className="px-6 py-4 border-t dark:border-[#2e2e2e] bg-white dark:bg-[#222222] space-y-3 flex-shrink-0">
        <div className="space-y-1">
          <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
            Feedback <span className="text-gray-400 dark:text-gray-500 font-normal">(optional)</span>
          </p>
          {submission.trainer_feedback && !editingFeedback ? (
            <div className="flex items-start gap-2">
              <p className="flex-1 text-sm text-gray-700 dark:text-gray-300 bg-gray-50 dark:bg-[#2a2a2a] rounded-md px-3 py-2 border border-gray-200 dark:border-[#333]">
                {submission.trainer_feedback}
              </p>
              <Button
                size="sm"
                variant="ghost"
                className="h-8 w-8 p-0 shrink-0 hover:bg-blue-50 dark:hover:bg-blue-900/20"
                onClick={() => setEditingFeedback(true)}
              >
                <Pencil className="h-4 w-4 text-blue-500" />
              </Button>
            </div>
          ) : (
            <Textarea
              value={feedback}
              onChange={(event) => setFeedback(event.target.value)}
              placeholder="Provide feedback for the submission"
              className="min-h-[60px] bg-gray-50 dark:bg-[#2a2a2a]"
            />
          )}
        </div>
        <div className="flex items-center justify-end gap-2">
          <Button
            size="sm"
            variant="ghost"
            className="h-8 w-8 p-0 hover:bg-red-50 dark:hover:bg-red-900/20 mr-auto"
            onClick={(event) => {
              event.stopPropagation();
              onDeleteClick(submission);
            }}
          >
            <Trash2 className="h-4 w-4 text-red-500" />
          </Button>
          {editingFeedback ? (
            <>
              <Button
                size="sm"
                variant="secondary"
                disabled={savingFeedback}
                onClick={() => {
                  setFeedback(submission.trainer_feedback || "");
                  setEditingFeedback(false);
                }}
                className="bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
              >
                <X className="h-4 w-4 mr-1" />
                Cancel
              </Button>
              <Button
                size="sm"
                disabled={savingFeedback || !feedback.trim()}
                onClick={saveFeedback}
                className="bg-blue-600 hover:bg-blue-700 text-white font-medium"
              >
                {savingFeedback ? <Loader2 className="h-4 w-4 mr-1 animate-spin" /> : <Pencil className="h-4 w-4 mr-1" />}
                Update
              </Button>
            </>
          ) : (
            <>
              <Button
                size="sm"
                disabled={submission.status === "not_approved" || pendingAction !== null}
                onClick={() => applyStatus("not_approved")}
                variant="outline"
                className="border border-red-200 dark:border-red-800 bg-white dark:bg-transparent text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 font-medium"
              >
                {pendingAction === "not_approved" ? <Loader2 className="h-4 w-4 mr-1 animate-spin" /> : <CircleX className="h-4 w-4 mr-1" />}
                Reject
              </Button>
              <Button
                size="sm"
                disabled={submission.status === "approved" || pendingAction !== null}
                onClick={() => applyStatus("approved")}
                className="bg-green-600 hover:bg-green-700 dark:bg-green-700 dark:hover:bg-green-600 text-white font-medium"
              >
                {pendingAction === "approved" ? <Loader2 className="h-4 w-4 mr-1 animate-spin" /> : <CircleCheckBig className="h-4 w-4 mr-1" />}
                Approve
              </Button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
function SubmissionsSplit({ submissions, onGrade, onDelete }) {
  const [rows, setRows] = useState([]);
  const [selected, setSelected] = useState(null);
  const [pendingDelete, setPendingDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [showDetailOnMobile, setShowDetailOnMobile] = useState(false);
  const isMobile = useIsMobile();

  useEffect(() => {
    if (Array.isArray(submissions) && submissions.length > 0) {
      setRows(submissions);
      setSelected((current) => submissions.find((row) => row._id === current?._id) || submissions[0]);
    } else {
      setRows([]);
      setSelected(null);
    }
  }, [submissions]);

  const handleGrade = (submissionId, patch) => {
    setRows((current) => current.map((row) => (row._id === submissionId ? { ...row, ...patch } : row)));
    setSelected((current) => (current && current._id === submissionId ? { ...current, ...patch } : current));
    onGrade(submissionId, patch);
  };

  const confirmDelete = () => {
    if (!pendingDelete) return;
    setDeleting(true);
    try {
      onDelete(pendingDelete);
      setRows((current) => current.filter((row) => row._id !== pendingDelete._id));
      if (selected?._id === pendingDelete._id) {
        setSelected(rows.find((row) => row._id !== pendingDelete._id) || null);
      }
    } finally {
      setDeleting(false);
      setPendingDelete(null);
    }
  };

  const list = (
    <SubmissionsList
      submissions={rows}
      selectedId={selected?._id}
      onSelect={(row) => {
        setSelected(row);
        setShowDetailOnMobile(true);
      }}
    />
  );

  return (
    <div className="min-h-screen bg-gray-50 mt-4">
      <div className="mx-auto">
        {isMobile ? (
          showDetailOnMobile ? (
            <div className="space-y-3">
              <Button variant="outline" onClick={() => setShowDetailOnMobile(false)}>
                ← Back to list
              </Button>
              <SubmissionDetail submission={selected} onGrade={handleGrade} onDeleteClick={setPendingDelete} />
            </div>
          ) : (
            list
          )
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-5">{list}</div>
            <div className="lg:col-span-7">
              {selected ? (
                <SubmissionDetail submission={selected} onGrade={handleGrade} onDeleteClick={setPendingDelete} />
              ) : (
                <p className="p-6 text-center text-gray-500">No submission selected.</p>
              )}
            </div>
          </div>
        )}
      </div>
      <Dialog open={!!pendingDelete} onOpenChange={() => setPendingDelete(null)}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>Delete Submission</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete <strong> {pendingDelete?.student_details.full_name}</strong>'s submission?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setPendingDelete(null)} disabled={deleting}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={confirmDelete} disabled={deleting}>
              {deleting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin mr-2" /> Deleting…
                </>
              ) : (
                "Delete"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export function AssignmentSubmissions() {
  const { id, tabName, assignmentId } = useParams();
  const location = useLocation();
  const assignmentData = location.state?.assignmentData || db.assignments.find((item) => item._id === assignmentId) || {};
  const slot = findSlot(id);
  const courseName = slot?.new_course?.course?.en?.course_name || "";

  const [submissions, setSubmissions] = useState(() =>
    [...db.submissions.filter((item) => item.assignment_id === assignmentId)].sort((a, b) =>
      a.status === "submitted" && b.status !== "submitted"
        ? -1
        : a.status !== "submitted" && b.status === "submitted"
          ? 1
          : 0,
    ),
  );

  const approved = submissions.filter((item) => item.status === "approved").length;
  const rejected = submissions.filter((item) => item.status === "not_approved").length;
  const unreviewed = submissions.length - approved - rejected;

  const handleGrade = (submissionId, patch) => {
    setSubmissions((current) => current.map((row) => (row._id === submissionId ? { ...row, ...patch } : row)));
  };

  const handleDelete = (submission) => {
    setSubmissions((current) => current.filter((row) => row._id !== submission._id));
    he("Submission deleted successfully", "success");
  };

  return (
    <div className="mx-auto px-0 sm:px-0">
      <div className="mb-4">
        <AppBreadcrumb
          items={[
            { title: "Dashboard", href: "/trainer" },
            { title: courseName || "Slot", href: `/trainer/${id}/${tabName}` },
            { title: "Submissions" },
          ]}
        />
      </div>
      <div className="flex items-center justify-between">
        <div>
          <PageTitle title="Assignment Submissions" />
          <p className="text-gray-600 mb-3 -mt-[12px]">
            <span className="font-medium">{assignmentData?.title}</span>.
          </p>
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-1">
        <StatCard title="Submissions" value={`${submissions.length}`} icon={FileCheck} iconColor="text-blue-600" iconBg="bg-blue-100" />
        <StatCard title="Approved" value={`${approved}`} icon={CircleCheckBig} iconColor="text-green-600" iconBg="bg-green-100" />
        <StatCard title="Rejected" value={`${rejected}`} icon={Ban} iconColor="text-red-600" iconBg="bg-red-100" />
        <StatCard title="Unreviewed" value={`${unreviewed}`} icon={Clock} iconColor="text-yellow-600" iconBg="bg-yellow-100" />
      </div>
      <SubmissionsSplit submissions={submissions} onGrade={handleGrade} onDelete={handleDelete} />
    </div>
  );
}
