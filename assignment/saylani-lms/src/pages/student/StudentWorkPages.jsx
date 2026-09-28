import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { format } from "date-fns";
import {
  AlertTriangle,
  Award,
  BookOpen,
  Calendar,
  CheckCircle2,
  Clock,
  ExternalLink,
  Eye,
  FileText,
  Inbox,
  Info,
  Pencil,
  Send,
  Target,
  Upload,
  X,
} from "lucide-react";
import { useApp } from "../../context/AppContext";
import { db, findStudentCourse } from "../../data/db";
import { he } from "../../lib/toast";
import {
  Alert,
  AlertDescription,
  AlertTitle,
  AppBreadcrumb,
  Badge,
  Button,
  Card,
  CardContent,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  Input,
  Label,
  PaginationBar,
  StatusBadge,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  Textarea,
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../../components/ui";
import { StatCard } from "../../components/widgets";

const PAGE_SIZE = 10;

function formatDateOnly(value) {
  if (!value) return "N/A";
  return new Date(value).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
}

function isDueSoon(value) {
  if (!value) return false;
  const hours = (new Date(value).getTime() - Date.now()) / (1000 * 60 * 60);
  return hours > 0 && hours < 48;
}

function ellipsize(text, max = 40) {
  if (!text) return "";
  return text.length > max ? `${text.slice(0, max)}...` : text;
}

function quizPercent(row) {
  return row?.total_questions ? `${Math.round((row.score / row.total_questions) * 100)}%` : "0%";
}

function ActionTip({ label, children }) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>{children}</TooltipTrigger>
      <TooltipContent>
        <p>{label}</p>
      </TooltipContent>
    </Tooltip>
  );
}

function TopicsModal({ open, onClose, assignmentTitle, topics }) {
  return (
    <Dialog open={open} onOpenChange={(next) => !next && onClose()}>
      <DialogContent className="sm:max-w-[550px] p-0 rounded-lg overflow-hidden border-none shadow-xl [&>button]:hidden">
        <DialogHeader className="px-6 py-4 bg-white dark:bg-[#222222] border-b dark:border-[#2e2e2e] flex flex-row items-center justify-between space-y-0">
          <div>
            <DialogTitle className="text-xl font-semibold text-gray-800 dark:text-gray-100 tracking-tight">
              Assignment Topics
            </DialogTitle>
            {assignmentTitle ? <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">{assignmentTitle}</p> : null}
          </div>
          <button type="button" onClick={onClose} className="rounded-sm opacity-70 hover:opacity-100 transition-opacity">
            <X className="h-5 w-5" />
          </button>
        </DialogHeader>
        <div className="max-h-[70vh] overflow-y-auto px-6 py-4">
          {topics.length > 0 ? (
            <ul className="space-y-3">
              {topics.map((topic) => (
                <li
                  key={topic._id}
                  className="flex items-start gap-3 p-3 rounded-md border border-gray-100 dark:border-[#2e2e2e] bg-gray-50 dark:bg-[#1a1a1a]"
                >
                  <BookOpen className="h-4 w-4 mt-0.5 text-blue-600 dark:text-blue-400 flex-shrink-0" />
                  <div>
                    <p className="font-medium text-gray-800 dark:text-gray-100 text-sm">{topic.title}</p>
                    {topic.description ? (
                      <p
                        className="text-xs text-gray-500 dark:text-gray-400 mt-1"
                        dangerouslySetInnerHTML={{ __html: topic.description }}
                      />
                    ) : null}
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-gray-500 dark:text-gray-400 text-center py-6">
              No topics have been added for this assignment.
            </p>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

function AssignmentFormModal({ mode, open, onClose, submission }) {
  const fileRef = useRef(null);
  const [link, setLink] = useState("");
  const [text, setText] = useState("");
  const [files, setFiles] = useState([]);
  const [existingFiles, setExistingFiles] = useState([]);
  const [busy, setBusy] = useState(false);

  const reset = () => {
    setLink(submission?.link || "");
    setText(submission?.text || "");
    setFiles([]);
    setExistingFiles(submission?.files || []);
    setBusy(false);
  };

  const isEdit = mode === "edit";

  useEffect(() => {
    if (open) reset();
  }, [open, submission]);

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        if (!next) onClose();
      }}
    >
      <DialogContent className="sm:max-w-[600px] rounded-lg [&>button]:hidden overflow-scroll overflow-y-auto max-h-[90vh]">
        <DialogHeader className="flex flex-row items-center justify-between space-y-0">
          <DialogTitle className="text-xl font-semibold text-gray-900">
            {isEdit ? "Edit Assignment" : "Submit Assignment"}
          </DialogTitle>
          <button type="button" onClick={onClose} className="rounded-sm opacity-70 hover:opacity-100 transition-opacity">
            <X className="h-5 w-5" />
          </button>
        </DialogHeader>
        <form
          className="px-1 py-4 space-y-6"
          onSubmit={(event) => {
            event.preventDefault();
            if (!text.trim()) {
              he("Submission text is required", "error");
              return;
            }
            setBusy(true);
            window.setTimeout(() => {
              setBusy(false);
              he(isEdit ? "Assignment updated successfully!" : "Assignment submitted successfully!", "success");
              onClose();
            }, 400);
          }}
        >
          <div className="space-y-2">
            <Label>Submission Link (Github, Notion ,Drive)</Label>
            <Input
              placeholder="e.g. https://github.com/your-work"
              value={link}
              onChange={(event) => setLink(event.target.value)}
              disabled={busy}
            />
          </div>
          <div className="space-y-3">
            <Label>Reference Images</Label>
            <div className="flex flex-wrap gap-3">
              {existingFiles.map((file, index) => (
                <div
                  key={`existing-${index}`}
                  className="relative group w-[120px] h-[120px] rounded-lg overflow-hidden border border-green-200 bg-green-50 shadow-sm hover:shadow-md transition-all duration-200"
                >
                  <img src={file} alt="" className="w-auto h-full object-cover" />
                </div>
              ))}
              {files.map((file, index) => (
                <div
                  key={`${file.name}-${index}`}
                  className="relative group w-[120px] h-[120px] rounded-lg overflow-hidden border border-green-200 bg-green-50 shadow-sm hover:shadow-md transition-all duration-200"
                >
                  <img src={URL.createObjectURL(file)} alt={file.name} className="w-auto h-full object-cover" />
                  <div className="absolute bottom-0 w-full bg-green-100 text-green-800 text-xs truncate px-2 py-1">{file.name}</div>
                  <button
                    type="button"
                    onClick={() => setFiles((current) => current.filter((_, item) => item !== index))}
                    disabled={busy}
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
                className="hidden"
                id="image-upload"
                disabled={busy || files.length >= 2}
                onChange={(event) => {
                  const picked = Array.from(event.target.files || []).filter((file) => file.type.startsWith("image/"));
                  if (picked.some((file) => file.size > 10 * 1024 * 1024)) {
                    he("Images must be smaller than 10 MB.", "error");
                    return;
                  }
                  if (files.length + picked.length > 2) {
                    he("You can upload only 2 images per submission", "error");
                    return;
                  }
                  setFiles((current) => [...current, ...picked]);
                  event.target.value = "";
                }}
              />
              <label
                htmlFor="image-upload"
                className="flex-1 border rounded-md px-3 py-2 text-sm cursor-pointer hover:bg-gray-50 flex items-center"
              >
                {files.length === 0 ? "No file chosen" : `${files.length} file(s) selected`}
              </label>
              <Button type="button" variant="outline" size="sm" className="h-9" disabled={busy} onClick={() => fileRef.current?.click()}>
                + Add Image
              </Button>
            </div>
          </div>
          <div className="space-y-2">
            <Label>Submission Text *</Label>
            <Textarea
              placeholder={"submit links and other details \n                        "}
              className="min-h-[100px]"
              value={text}
              onChange={(event) => setText(event.target.value)}
              disabled={busy}
            />
          </div>
          <DialogFooter className="gap-2">
            <Button type="button" variant="outline" onClick={onClose} disabled={busy}>
              Cancel
            </Button>
            <Button type="submit" disabled={busy} className="bg-blue-600 hover:bg-blue-700">
              {busy ? (
                isEdit ? (
                  "Updating..."
                ) : (
                  "Submitting..."
                )
              ) : isEdit ? (
                "Update Submission"
              ) : (
                <>
                  Submit <Send className="ml-2 h-4 w-4" />
                </>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

function AssignmentDetailModal({ open, onClose, row }) {
  if (!row) return null;
  const { assignment, submission } = row;
  const status =
    submission?.status === "not_approved" ? "rejected" : submission?.status || "not_submitted";
  return (
    <Dialog open={open} onOpenChange={(next) => !next && onClose()}>
      <DialogContent className="sm:max-w-[800px] p-0 rounded-lg overflow-hidden border-none shadow-xl [&>button]:hidden">
        <DialogHeader className="px-6 py-4 bg-white border flex flex-row items-center justify-between space-y-0">
          <DialogTitle className="text-xl font-semibold text-gray-800 tracking-tight">Assignment Information</DialogTitle>
          <button type="button" onClick={onClose} className="rounded-sm opacity-70 hover:opacity-100 transition-opacity">
            <X className="h-5 w-5" />
          </button>
        </DialogHeader>
        <div className="max-h-[75vh] m-0 overflow-y-auto overflow-x-auto">
          <div className="space-y-6 px-6 py-4">
            <section>
              <Card className="shadow-none">
                <CardContent className="p-4 space-y-4">
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-gray-500">Title</p>
                    <p className="font-semibold text-gray-800">{assignment?.title || "N/A"}</p>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <p className="text-sm font-medium text-gray-500">Due Date</p>
                      <div className="flex items-center gap-2 text-gray-800">
                        <Calendar className="h-4 w-4 text-gray-500" />
                        {assignment?.submission_date ? format(new Date(assignment.submission_date), "PPp") : "N/A"}
                      </div>
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm font-medium text-gray-500">Status</p>
                      <div className="flex items-center gap-2">
                        <StatusBadge status={status} />
                      </div>
                    </div>
                  </div>
                  {assignment?.links?.length > 0 ? (
                    <div className="space-y-1">
                      <p className="text-sm font-medium text-gray-500">Reference Links</p>
                      <div className="p-3 bg-gray-50 rounded-md border border-gray-100">
                        {assignment.links.map((href, index) => (
                          <div key={index} className="flex items-center gap-2">
                            <ExternalLink className="h-4 w-4 text-gray-500" />
                            <a href={href} target="_blank" rel="noopener noreferrer" className="text-gray-700 hover:underline break-all">
                              {href}
                            </a>
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : null}
                  {assignment?.description ? (
                    <div className="space-y-1">
                      <p className="text-sm font-medium text-gray-500">Description</p>
                      <div
                        className="text-sm text-gray-700 prose prose-sm max-w-none"
                        dangerouslySetInnerHTML={{ __html: assignment.description }}
                      />
                    </div>
                  ) : null}
                  {submission?.trainer_feedback ? (
                    <div className="space-y-1">
                      <p className="text-sm font-medium text-gray-500">Feedback</p>
                      <p className="text-sm text-gray-700">{submission.trainer_feedback}</p>
                    </div>
                  ) : null}
                </CardContent>
              </Card>
            </section>
            {submission ? (
              <section>
                <h3 className="text-md font-medium text-gray-700 mb-3 flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4" />
                  Submission Details
                </h3>
                <Card>
                  <CardContent className="p-4 space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <p className="text-sm font-medium text-gray-500">Submitted On</p>
                        <div className="flex items-center gap-2 text-gray-800">
                          <Calendar className="h-4 w-4 text-gray-500" />
                          {submission.submitted_date ? format(new Date(submission.submitted_date), "PPp") : "N/A"}
                        </div>
                      </div>
                    </div>
                    {submission.link ? (
                      <div className="space-y-2">
                        <p className="text-sm font-medium text-gray-500 flex items-center gap-2">
                          <ExternalLink className="h-4 w-4" />
                          Submission Link
                        </p>
                        <div className="flex items-center gap-2 bg-gray-50 p-3 rounded-lg border border-gray-100">
                          <ExternalLink className="h-4 w-4 text-blue-500 flex-shrink-0" />
                          <a
                            href={submission.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:text-blue-800 hover:underline break-all text-sm flex-1"
                          >
                            {submission.link}
                          </a>
                        </div>
                      </div>
                    ) : null}
                    {submission.files?.length > 0 ? (
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                        {submission.files.map((file, index) => (
                          <div key={index} className="aspect-video bg-gray-100 rounded-lg overflow-hidden border border-gray-200">
                            <img src={file} alt={`Submission file ${index + 1}`} className="w-full h-full object-cover" />
                          </div>
                        ))}
                      </div>
                    ) : null}
                    {submission.text ? (
                      <div className="space-y-1">
                        <p className="text-sm font-medium text-gray-500">Submission Notes</p>
                        <div className="p-3 bg-gray-50 rounded-md border border-gray-100">
                          <p className="text-gray-700 whitespace-pre-line text-sm">{submission.text}</p>
                        </div>
                      </div>
                    ) : null}
                  </CardContent>
                </Card>
              </section>
            ) : null}
          </div>
        </div>
        <DialogFooter className="px-6 py-2 border-t bg-gray-50">
          <Button variant="default" onClick={onClose} className="px-6 hover:bg-blue-600 bg-blue-700">
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function CertificateButton({ submission, assignment, size = "icon", rollNumber }) {
  if (!assignment?.is_hackathon || submission?.status !== "approved") return null;
  const full = size === "full";
  return (
    <ActionTip label="Download Hackathon Certificate">
      <Button
        variant="primary"
        size="sm"
        className={full ? "flex-1 h-8 bg-green-600 hover:bg-green-700 text-white" : "h-8 w-8 p-0 bg-green-600 hover:bg-green-700 text-white"}
        onClick={() => he("Certificate downloaded successfully", "success")}
      >
        <Award className="h-4 w-4" />
        {full ? <span className="ml-1">Certificate</span> : <span className="sr-only">Download Certificate</span>}
      </Button>
    </ActionTip>
  );
}

function AssignmentActions({ assignment, submission, size, onView, onSubmit, onEdit }) {
  const submitted = !!submission;
  const editable =
    submission?.status === "submitted" || submission?.status === "not_approved" || submission?.status === "late_submitted";
  const icon = size === "icon";
  const btnClass = icon ? "h-8 w-8 p-0" : "flex-1 h-8";
  if (assignment?.status !== "active") {
    return (
      <div className={icon ? "flex items-center justify-start" : "w-full"}>
        <span className="text-sm text-red-600 italic">Submissions closed</span>
      </div>
    );
  }
  return (
    <>
      <ActionTip label="View submission details">
        <Button variant="primary" size="sm" className={btnClass} onClick={onView}>
          <Eye className="h-4 w-4" />
          {icon ? <span className="sr-only">View details</span> : "View"}
        </Button>
      </ActionTip>
      <ActionTip label={submitted ? "Already submitted" : "Submit assignment"}>
        <Button variant="primary" size="sm" className={btnClass} onClick={onSubmit} disabled={submitted || assignment?.status !== "active"}>
          <Upload className="h-4 w-4" />
          {icon ? <span className="sr-only">Submit assignment</span> : "Submit"}
        </Button>
      </ActionTip>
      <ActionTip
        label={
          submission ? (editable && submission.status !== "late_submitted" ? "Edit your submission" : "Submission cannot be edited") : "No submission to edit"
        }
      >
        <Button variant="primary" size="sm" className={btnClass} onClick={onEdit} disabled={!submission || !editable}>
          <Pencil className="h-4 w-4" />
          {icon ? <span className="sr-only">Edit submission</span> : "Edit"}
        </Button>
      </ActionTip>
    </>
  );
}

function EmptyAssignments() {
  return (
    <div className="w-full flex flex-col items-center justify-center space-y-4">
      <div className="p-4 bg-gray-100 rounded-full">
        <Inbox className="w-6 h-6 text-gray-400" />
      </div>
      <h3 className="text-lg font-medium text-gray-900">No Assignments</h3>
      <p className="text-sm text-gray-500">You haven&apos;t been given any assignments yet.</p>
    </div>
  );
}

export function StudentAssignment() {
  const { slotId } = useParams();
  const { selectedCourse } = useApp();
  const course = selectedCourse || findStudentCourse(slotId);
  const name = course?.course?.en?.course_name || "Unknown Course";
  const rows = db.formattedAssignments || [];
  const assigned = db.assignmentTotals?.total_assignments || rows.length;
  const submittedCount = rows.filter(({ submission }) => !!submission).length;
  const pending = Math.max(assigned - submittedCount, 0);
  const [page, setPage] = useState(1);
  const [activeId, setActiveId] = useState(null);
  const [modal, setModal] = useState(null);
  const [topics, setTopics] = useState({ open: false, assignmentTitle: "", topics: [] });
  const totalPages = Math.ceil(assigned / PAGE_SIZE);
  const current = rows.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
  const activeRow = current.find((row) => row.assignment._id === activeId) || rows.find((row) => row.assignment._id === activeId);

  const openTopics = (title, list) => setTopics({ open: true, assignmentTitle: title, topics: list || [] });

  return (
    <TooltipProvider delayDuration={0}>
      <main className="px-2 pb-8 mx-auto">
        <div className="max-md:hidden pt-3 pb-7">
          <AppBreadcrumb
            items={[
              { title: "Home", href: "/courses" },
              { title: `${name}`, href: `/dashboard/${slotId}` },
              { title: "Assignment" },
            ]}
          />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <StatCard title="Assigned" value={assigned} icon={FileText} iconBg="bg-blue-100" iconColor="text-blue-600" />
          <StatCard title="Submitted" value={submittedCount} icon={CheckCircle2} iconBg="bg-green-100" iconColor="text-green-600" />
          <StatCard title="Pending" value={pending} icon={Clock} iconColor="text-yellow-600" iconBg="bg-yellow-100" />
        </div>
        <div className="shadow rounded-lg bg-white dark:bg-[#222222] pb-2">
          <div className="text-left">
            <div className="hidden md:block overflow-x-auto bg-white dark:bg-[#222222] rounded-lg shadow">
              <Table className="min-w-full text-left">
                <TableHeader>
                  <TableRow className="bg-slate-50 dark:bg-[#2a2a2a] hover:bg-slate-100 dark:hover:bg-[#2a2a2a]">
                    <TableHead className="px-4 text-left">Assignment</TableHead>
                    <TableHead className="max-md:hidden text-left">Topics</TableHead>
                    <TableHead className="sm:w-auto max-md:hidden text-left">Due Date</TableHead>
                    <TableHead className="text-left">Status</TableHead>
                    <TableHead className="text-left px-4">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {current.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="py-12 hover:bg-white dark:hover:bg-[#222222] text-center">
                        <EmptyAssignments />
                      </TableCell>
                    </TableRow>
                  ) : (
                    current.map(({ assignment, submission }) => (
                      <TableRow
                        key={assignment._id}
                        className={`font-medium py-4 px-4 text-left ${assignment.is_hackathon ? "bg-purple-50 dark:bg-purple-950/30 text-purple-800 dark:text-purple-300 hover:bg-purple-100 dark:hover:bg-purple-950/50" : "dark:hover:bg-[#2a2a2a]"}`}
                      >
                        <TableCell className="font-medium py-4 px-4 text-left">
                          <div className="flex flex-col items-start">
                            <span className="font-medium text-sm block">
                              {ellipsize(assignment.title, 40) || "Untitled"}
                              {assignment.is_hackathon ? (
                                <span className="ml-2">
                                  <StatusBadge status="hackathon" />
                                </span>
                              ) : null}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell className="py-4 max-md:hidden text-left">
                          {assignment.topics?.length > 0 ? (
                            <button
                              type="button"
                              onClick={() => openTopics(assignment.title, assignment.topics)}
                              className="inline-flex items-center gap-1 bg-blue-100 dark:bg-blue-900/40 text-blue-800 dark:text-blue-300 text-xs px-2 py-1 rounded-full hover:bg-blue-200 dark:hover:bg-blue-900/60 transition-colors"
                            >
                              {assignment.topics.length} Topic{assignment.topics.length > 1 ? "s" : ""}
                            </button>
                          ) : (
                            <span className="text-gray-400 text-sm">No topics</span>
                          )}
                        </TableCell>
                        <TableCell className="py-4 max-md:hidden text-left">
                          <div className={`flex items-start justify-start ${isDueSoon(assignment.submission_date) && !submission ? "text-red-500 font-medium" : ""}`}>
                            {formatDateOnly(assignment.submission_date)}
                          </div>
                        </TableCell>
                        <TableCell className="py-4 text-left">
                          <StatusBadge status={submission?.status === "not_approved" ? "rejected" : submission?.status || "not_submitted"} />
                        </TableCell>
                        <TableCell className="py-4 space-x-2 text-left px-2">
                          <div className="flex justify-start gap-2 max-md:gap-0">
                            <AssignmentActions
                              assignment={assignment}
                              submission={submission}
                              size="icon"
                              onView={() => {
                                setActiveId(assignment._id);
                                setModal("detail");
                              }}
                              onSubmit={() => {
                                setActiveId(assignment._id);
                                setModal("submit");
                              }}
                              onEdit={() => {
                                setActiveId(assignment._id);
                                setModal("edit");
                              }}
                            />
                            <CertificateButton submission={submission} assignment={assignment} size="icon" rollNumber={course?.roll_number} />
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
            <div className="md:hidden">
              <div className="space-y-4">
                {current.length === 0 ? (
                  <div className="py-12 flex flex-col items-center justify-center space-y-4">
                    <EmptyAssignments />
                  </div>
                ) : (
                  current.map(({ assignment, submission }) => (
                    <div
                      key={assignment._id}
                      className={`border rounded-lg p-4 ${assignment.is_hackathon ? "bg-purple-50 dark:bg-purple-950/30 border-purple-200 dark:border-purple-900" : "bg-white dark:bg-[#222222] border-gray-200 dark:border-[#2e2e2e]"}`}
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <h3 className="font-medium text-base">{assignment.title || "Untitled"}</h3>
                          {assignment.is_hackathon ? (
                            <div className="mt-1">
                              <StatusBadge status="hackathon" />
                            </div>
                          ) : null}
                        </div>
                      </div>
                      <p className="text-sm text-gray-600 mb-2">{name}</p>
                      <div className="mb-3">
                        <span className="text-sm text-gray-600">Due Date: </span>
                        <span className={`text-sm font-medium ${isDueSoon(assignment.submission_date) && !submission ? "text-red-500" : "text-gray-900"}`}>
                          {formatDateOnly(assignment.submission_date)}
                        </span>
                      </div>
                      <div className="mb-3">
                        <span className="text-sm text-gray-600">Status: </span>
                        <StatusBadge status={submission?.status || "not_submitted"}>
                          {submission?.status === "not_approved" ? "Rejected" : undefined}
                        </StatusBadge>
                      </div>
                      {assignment.topics?.length > 0 ? (
                        <div className="mb-3">
                          <button
                            type="button"
                            onClick={() => openTopics(assignment.title, assignment.topics)}
                            className="inline-flex items-center gap-1 bg-blue-100 dark:bg-blue-900/40 text-blue-800 dark:text-blue-300 text-xs px-2 py-1 rounded-full"
                          >
                            {assignment.topics.length} Topic{assignment.topics.length > 1 ? "s" : ""}
                          </button>
                        </div>
                      ) : null}
                      <div className="flex flex-wrap gap-2 pt-3 border-t">
                        <AssignmentActions
                          assignment={assignment}
                          submission={submission}
                          size="full"
                          onView={() => {
                            setActiveId(assignment._id);
                            setModal("detail");
                          }}
                          onSubmit={() => {
                            setActiveId(assignment._id);
                            setModal("submit");
                          }}
                          onEdit={() => {
                            setActiveId(assignment._id);
                            setModal("edit");
                          }}
                        />
                        <CertificateButton submission={submission} assignment={assignment} size="full" rollNumber={course?.roll_number} />
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
          {assigned > PAGE_SIZE ? (
            <PaginationBar
              currentPage={page}
              totalPages={totalPages}
              itemsCount={assigned}
              itemsPerPage={PAGE_SIZE}
              indexOfFirstItem={(page - 1) * PAGE_SIZE}
              onPageChange={setPage}
            />
          ) : null}
        </div>
        <TopicsModal
          open={topics.open}
          assignmentTitle={topics.assignmentTitle}
          topics={topics.topics}
          onClose={() => setTopics({ open: false, assignmentTitle: "", topics: [] })}
        />
        <AssignmentFormModal mode="submit" open={modal === "submit"} onClose={() => setModal(null)} submission={null} />
        <AssignmentFormModal mode="edit" open={modal === "edit"} onClose={() => setModal(null)} submission={activeRow?.submission} />
        <AssignmentDetailModal open={modal === "detail"} onClose={() => setModal(null)} row={activeRow} />
      </main>
    </TooltipProvider>
  );
}

function QuizStartDialog({ open, onClose, quiz, onStart }) {
  if (!quiz) return null;
  const used = quiz.attempts || 0;
  const allowed = quiz.attempts_allowed || 0;
  const remaining = allowed - used;
  const canContinue =
    !(quiz.status === "passed" || quiz.status === "failed") &&
    quiz.question_attempted > 0 &&
    quiz.question_attempted < quiz.total_questions;
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md md:max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-xl">{quiz.title}</DialogTitle>
          <DialogDescription>{quiz.module_name || "Module information not available"}</DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-2">
          <div className="grid grid-cols-2 gap-4">
            <Card>
              <CardContent className="p-4 flex flex-col items-center justify-center">
                <Target className="h-8 w-8 text-amber-500 mb-2" />
                <p className="text-sm text-muted-foreground">Passing Percentage</p>
                <p className="text-lg font-semibold">{quiz.passing_percentage}%</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 flex flex-col items-center justify-center">
                <BookOpen className="h-8 w-8 text-blue-500 mb-2" />
                <p className="text-sm text-muted-foreground">Questions</p>
                <p className="text-lg font-semibold">{quiz.total_questions}</p>
              </CardContent>
            </Card>
          </div>
          <Card>
            <CardContent className="p-4">
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <p className="text-sm font-medium">Attempts</p>
                </div>
                <div className="flex flex-wrap gap-2">
                  {Array.from({ length: allowed }).map((_, index) => {
                    const spent = index < used;
                    return (
                      <div
                        key={index}
                        className={`w-6 h-6 rounded-sm border flex items-center justify-center text-[10px] font-medium
                          ${spent ? "bg-gray-100 dark:bg-[#2a2a2a] border-gray-300 dark:border-[#3a3a3a] text-gray-400 dark:text-gray-600" : "bg-white dark:bg-[#1a1a1a] border-blue-400 dark:border-blue-600 text-blue-600 dark:text-blue-400"}`}
                      >
                        {index + 1}
                      </div>
                    );
                  })}
                </div>
                <div className="text-xs text-muted-foreground">Remaining: {remaining}</div>
              </div>
            </CardContent>
          </Card>
          <div className="flex items-start justify-center flex-col gap-2  p-1 rounded-md">
            <div className="space-y-2 p-1 rounded-md">
              <p className="text-sm text-amber-700 dark:text-amber-400 flex items-center gap-1">
                <AlertTriangle className="h-5 w-5 text-amber-500" />
                Make sure you&apos;re ready before starting. The quiz will open in fullscreen mode.
              </p>
            </div>
          </div>
        </div>
        <DialogFooter className="sm:justify-between">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button
            className="bg-clr_blue mb-2 hover:bg-clr_blue_dark text-white"
            onClick={() => onStart(quiz)}
            disabled={remaining <= 0}
          >
            {canContinue ? "Continue Quiz" : "Start Quiz"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function QuizActionButton({ row, attendanceMarked, className, onStart }) {
  const completed = row.status === "passed" || row.status === "failed";
  const remaining = (row.attempts_allowed || 0) - (row.attempts || 0);
  const canContinue = !completed && row.question_attempted > 0 && row.question_attempted < row.total_questions;
  const disabled = completed || remaining <= 0 || !(attendanceMarked || row.special_access);
  const label = completed ? "Completed" : canContinue ? "Continue" : "Start";
  let tip = "";
  if (completed) tip = "Quiz already completed";
  else if (remaining <= 0) tip = "No attempts remaining";
  else if (!attendanceMarked && !row.special_access) tip = "Your attendance needs to be marked as present.";
  const button = (
    <Button
      size="sm"
      onClick={() => {
        if (!disabled) onStart(row);
      }}
      className={`transition-all text-white bg-clr_blue hover:bg-clr_blue_dark hover:shadow-md ${className || ""}`}
      disabled={disabled}
      variant={disabled ? "outline" : "default"}
    >
      {label}
    </Button>
  );
  if (!tip) return button;
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <span>{button}</span>
      </TooltipTrigger>
      <TooltipContent>
        <p>{tip}</p>
      </TooltipContent>
    </Tooltip>
  );
}

function QuizNote({ row, attendanceMarked }) {
  const completed = row.status === "passed" || row.status === "failed";
  const remaining = (row.attempts_allowed || 0) - (row.attempts || 0);
  if (!completed && remaining <= 0) return <p className="text-sm text-red-600">No attempts remaining</p>;
  if (!completed && !(attendanceMarked || row.special_access)) return <p className="text-sm text-red-600">Please mark your attendance</p>;
  return "—";
}

export function StudentQuiz() {
  const { slotId } = useParams();
  const { selectedCourse } = useApp();
  const [selected, setSelected] = useState(null);
  const [open, setOpen] = useState(false);
  const [starting, setStarting] = useState(false);
  const course = selectedCourse || findStudentCourse(slotId);
  const name = course?.course?.en?.course_name || "Course";
  const rows = db.quizSchedules;
  const attendanceMarked = db.quizAttendanceToday;

  const onStart = (row) => {
    setSelected(row);
    setOpen(true);
  };

  const empty = !rows || rows.length === 0;

  if (starting) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] px-4">
        <p className="text-lg font-medium">Starting Quiz...</p>
        <p className="text-sm text-muted-foreground mt-2">Please wait while we prepare your questions</p>
      </div>
    );
  }

  return (
    <TooltipProvider delayDuration={0}>
      <div className="pb-8 mx-auto">
        <div className="w-full px-2 space-y-6">
          <div className="max-md:hidden pt-3 pb-2">
            <AppBreadcrumb
              items={[
                { title: "Home", href: "/courses" },
                { title: `${name}`, href: `/dashboard/${slotId}` },
                { title: "Quiz" },
              ]}
            />
          </div>
          <Alert variant="default" className="bg-muted/50 dark:bg-[#1e2a3a] border-primary/20 dark:border-[#2a3a4a] text-sm">
            <Info className="h-4 w-4 text-primary" />
            <AlertTitle className="text-base">Important Information</AlertTitle>
            <AlertDescription className="mt-1 sm:mt-2 text-xs sm:text-sm text-muted-foreground">
              <ul className="list-disc pl-4 sm:pl-5 space-y-1">
                <li>Once started, quizzes must be completed in one session</li>
                <li>Switching tabs or leaving the window will be recorded</li>
                <li>Ensure you have a stable internet connection</li>
                <li>The quiz will open in fullscreen mode</li>
              </ul>
            </AlertDescription>
          </Alert>
          <div>
            <Card className="w-full border-none shadow-none">
              <CardContent className="px-0 w-full pb-0">
                <div className="hidden md:block overflow-x-auto bg-white dark:bg-[#222222] rounded-lg shadow-sm border dark:border-[#2e2e2e]">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Title</TableHead>
                        <TableHead>Module</TableHead>
                        <TableHead className="hidden md:table-cell">Questions</TableHead>
                        <TableHead>Attempts</TableHead>
                        <TableHead>Percentage</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-start">Note</TableHead>
                        <TableHead className="text-left">Action</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {rows.map((row) => {
                        const completed = row.status === "passed" || row.status === "failed";
                        const remaining = (row.attempts_allowed || 0) - (row.attempts || 0);
                        return (
                          <TableRow key={row._id} className={`hover:bg-muted/50 transition-colors ${completed ? "bg-muted/20" : ""}`}>
                            <TableCell className="font-medium">{row.title || "N/A"}</TableCell>
                            <TableCell>{row.module_name || "N/A"}</TableCell>
                            <TableCell className="hidden md:table-cell">
                              <Badge variant="outline" className="bg-primary/5">
                                {row.total_questions || "N/A"}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <Badge
                                variant={remaining > 2 ? "outline" : "secondary"}
                                className={remaining <= 1 ? "bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400" : ""}
                              >
                                {row.attempts || 0} / {row.attempts_allowed || 0}
                              </Badge>
                            </TableCell>
                            <TableCell>{quizPercent(row)}</TableCell>
                            <TableCell>
                              <StatusBadge status={row.status}>{row.status || "pending"}</StatusBadge>
                            </TableCell>
                            <TableCell>
                              <QuizNote row={row} attendanceMarked={attendanceMarked} />
                            </TableCell>
                            <TableCell className="text-left">
                              <QuizActionButton row={row} attendanceMarked={attendanceMarked} onStart={onStart} />
                            </TableCell>
                          </TableRow>
                        );
                      })}
                      {empty ? (
                        <TableRow>
                          <TableCell colSpan={8} className="text-center py-6">
                            <p className="text-lg font-medium text-muted-foreground">No active quizzes available</p>
                            <p className="text-sm mt-2 text-muted-foreground">Check back later for upcoming assessments</p>
                          </TableCell>
                        </TableRow>
                      ) : null}
                    </TableBody>
                  </Table>
                </div>
                <div className="grid gap-4 md:hidden bg-[#F8FBFA] dark:bg-[#141414]">
                  {rows.map((row) => {
                    const completed = row.status === "passed" || row.status === "failed";
                    const remaining = (row.attempts_allowed || 0) - (row.attempts || 0);
                    return (
                      <Card key={row._id} className={`shadow-none ${completed ? "bg-muted/20" : ""}`}>
                        <CardContent className="p-4">
                          <div className="grid gap-3">
                            <div className="flex justify-between items-start">
                              <div>
                                <h3 className="font-semibold">{row.title || "N/A"}</h3>
                                {row.module_name ? <p className="text-sm text-muted-foreground">{row.module_name}</p> : null}
                              </div>
                              <StatusBadge status={row.status}>{row.status || "pending"}</StatusBadge>
                            </div>
                            <div className="grid grid-cols-2 gap-2 text-sm">
                              <div>
                                <p className="text-muted-foreground">Questions</p>
                                <Badge variant="outline" className="bg-primary/5 mt-1">
                                  {row.total_questions || "N/A"}
                                </Badge>
                              </div>
                              <div>
                                <p className="text-muted-foreground">Percentage</p>
                                <p className="font-medium mt-1">{quizPercent(row)}</p>
                              </div>
                              <div>
                                <p className="text-muted-foreground">Attempts</p>
                                <Badge
                                  variant="outline"
                                  className={`mt-1 ${remaining <= 1 ? "bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400" : ""}`}
                                >
                                  {row.attempts || 0} / {row.attempts_allowed || 0}
                                </Badge>
                              </div>
                            </div>
                            <div className="flex items-center justify-center gap-2">
                              {!completed && remaining <= 0 ? (
                                <p className="text-sm border border-red-300 dark:border-red-800 bg-red-50 dark:bg-red-900/20 rounded-lg px-3 py-1.5 text-red-600 dark:text-red-400">
                                  No attempts remaining
                                </p>
                              ) : null}
                              {!completed && remaining > 0 && !(attendanceMarked || row.special_access) ? (
                                <p className="text-sm border border-red-300 dark:border-red-800 bg-red-50 dark:bg-red-900/20 rounded-lg px-3 py-1.5 text-red-600 dark:text-red-400">
                                  Please mark your attendance
                                </p>
                              ) : null}
                            </div>
                            <div className="mt-2">
                              <div className="w-full">
                                <QuizActionButton row={row} attendanceMarked={attendanceMarked} className="w-full" onStart={onStart} />
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
                {empty ? (
                  <div className="py-6 w-full flex items-center justify-center md:hidden">
                    <div className="text-center py-2 text-muted-foreground">
                      <p className="text-lg font-medium">No active quizzes available</p>
                      <p className="text-sm mt-2">Check back later for upcoming assessments</p>
                    </div>
                  </div>
                ) : null}
              </CardContent>
            </Card>
          </div>
          <div className="text-center text-xs sm:text-sm text-muted-foreground">
            <p>Contact your instructor if you have any issues accessing your quizzes.</p>
          </div>
        </div>
        <QuizStartDialog
          open={open}
          quiz={selected}
          onClose={() => setOpen(false)}
          onStart={() => {
            setOpen(false);
            setStarting(true);
            window.setTimeout(() => setStarting(false), 800);
          }}
        />
      </div>
    </TooltipProvider>
  );
}
