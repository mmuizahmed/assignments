import { useEffect, useState } from "react";
import { format, parse } from "date-fns";

export function formatShortDate(value) {
  return value ? format(new Date(value), "MMM d, yyyy") : null;
}

export function formatBillingMonth(value) {
  if (!value || String(value).length < 4) return value;
  const year = `20${String(value).slice(0, 2)}`;
  const month = String(value).slice(2);
  const date = parse(`${year}-${month}-01`, "yyyy-MM-dd", new Date());
  if (Number.isNaN(date.getTime())) return String(value);
  return format(date, "MMM yyyy");
}

export function currentBillingMonth(d = new Date()) {
  const y = d.getFullYear().toString().slice(-2);
  const m = (d.getMonth() + 1).toString().padStart(2, "0");
  return `${y}${m}`;
}

export function parseScheduleParts(schedules) {
  if (!schedules || schedules.length === 0) return { days: [], times: [] };
  const days = [];
  const times = [];
  const labels = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  const list = Array.isArray(schedules) ? schedules : [schedules];
  list.forEach((item) => {
    String(item)
      .split("|")
      .map((part) => part.trim())
      .forEach((part) => {
        labels.forEach((label) => {
          if (part.startsWith(label)) {
            days.push(label);
            times.push(part.replace(label, "").trim());
          }
        });
      });
  });
  return { days: [...new Set(days)], times: [...new Set(times)] };
}

export function weekCells(activeDays = []) {
  const labels = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const now = new Date();
  const todayIndex = now.getDay();
  return labels.map((day, index) => {
    const date = new Date(now);
    date.setDate(now.getDate() - todayIndex + index);
    return {
      day,
      date: date.getDate().toString().padStart(2, "0"),
      isActive: activeDays.includes(day),
      isToday: date.getDate() === now.getDate(),
    };
  });
}

export function scheduleDayNames(schedule) {
  if (!schedule) return [];
  const found = [];
  ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].forEach((day) => {
    if (String(schedule).includes(day)) found.push(day);
  });
  return found;
}

export function calendarScheduleMap(slots) {
  if (!slots || slots.length === 0) return { dayIndexes: [], scheduleMap: {} };
  const labels = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const scheduleMap = {};
  const dayIndexes = [];
  slots.forEach((slot) => {
    const courseName = slot?.new_course?.course?.en?.course_name || "Unnamed Course";
    const batch = slot?.new_course?.batch_number;
    const schedule = slot?.schedule;
    (Array.isArray(schedule) ? schedule : typeof schedule === "string" ? [schedule] : []).forEach(
      (item) => {
        if (typeof item !== "string") return;
        item
          .split("|")
          .map((part) => part.trim())
          .forEach((part) => {
            labels.forEach((label, index) => {
              if (part.startsWith(label)) {
                if (!scheduleMap[index]) {
                  scheduleMap[index] = [];
                  dayIndexes.push(index);
                }
                scheduleMap[index].push({
                  courseName,
                  time: part.replace(label, "").trim(),
                  batch,
                });
              }
            });
          });
      },
    );
  });
  return { dayIndexes: [...new Set(dayIndexes)], scheduleMap };
}

export function formatMinutes(total) {
  const hours = Math.floor((total || 0) / 60);
  const minutes = (total || 0) % 60;
  if (!hours) return `${minutes} min`;
  return `${hours}h ${minutes}m`;
}

export function formatDuration(total = 0) {
  const hours = Math.floor(total / 60);
  const minutes = total % 60;
  return hours ? `${hours}h ${minutes}m` : `${minutes}m`;
}

export function formatClockTime(value) {
  return new Date(value).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

export function formatLongDate(value) {
  if (!value) return "";
  return new Date(value).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export function currentMonthLabel(d = new Date()) {
  return d.toLocaleDateString("en-US", { month: "short", year: "numeric" }).replace(",", "");
}

export function formatRelativeCompleted(value) {
  if (!value) return "";
  const date = new Date(value);
  const diffMs = Date.now() - date.getTime();
  const seconds = Math.floor(diffMs / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  if (seconds < 60) return "just now";
  if (minutes < 60) return `${minutes} minute${minutes > 1 ? "s" : ""} ago`;
  if (hours < 24) return `${hours} hour${hours > 1 ? "s" : ""} ago`;
  if (days === 1) return "1 day ago";
  if (days < 7) return `${days} days ago`;
  if (days === 7) return "1 week ago";
  return format(date, "MMM d, yyyy");
}

export function useIsMobile(breakpoint = 768) {
  const [mobile, setMobile] = useState(() => typeof window !== "undefined" && window.innerWidth < breakpoint);
  useEffect(() => {
    const media = window.matchMedia(`(max-width: ${breakpoint - 1}px)`);
    const onChange = () => setMobile(window.innerWidth < breakpoint);
    media.addEventListener("change", onChange);
    return () => media.removeEventListener("change", onChange);
  }, [breakpoint]);
  return mobile;
}
