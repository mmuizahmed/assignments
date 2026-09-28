import { useState } from "react";
import { App as AntApp, Button, Modal, Input, Upload } from "antd";
import { BugOutlined, BulbOutlined, CommentOutlined } from "@ant-design/icons";

const TYPES = [
  { value: "bug", label: "Bug", icon: <BugOutlined /> },
  { value: "idea", label: "Idea", icon: <BulbOutlined /> },
  { value: "other", label: "Other", icon: <CommentOutlined /> },
];
const MAX_IMAGES = 3;

export function FeedbackModal({ open, onClose }) {
  const { message } = AntApp.useApp();
  const [type, setType] = useState("");
  const [note, setNote] = useState("");
  const [files, setFiles] = useState([]);
  const [submitting, setSubmitting] = useState(false);

  const reset = () => {
    setType("");
    setNote("");
    setFiles([]);
    setSubmitting(false);
  };

  const close = () => {
    if (submitting) return;
    reset();
    onClose();
  };

  const submit = () => {
    if (!type) {
      message.error("Please select a feedback type");
      return;
    }
    if (note.trim().length < 10) {
      message.error("Please write at least 10 characters");
      return;
    }
    setSubmitting(true);
    setTimeout(() => {
      message.success("Feedback received, thanks for helping us improve!");
      reset();
      onClose();
    }, 400);
  };

  return (
    <Modal
      title="Share Your Feedback"
      open={open}
      onCancel={close}
      footer={null}
      destroyOnClose
      maskClosable={!submitting}
      getContainer={() => document.querySelector(".admin-root") || document.body}
    >
      <p className="feedback_modal_subtitle">
        Let us know if we could do anything to improve your experience.
      </p>
      <label className="feedback_modal_label">Select Type *</label>
      <div className="feedback_type_row">
        {TYPES.map((t) => (
          <div
            key={t.value}
            className={`feedback_type_card ${type === t.value ? "feedback_type_card--active" : ""}`}
            onClick={() => !submitting && setType(t.value)}
          >
            <span className="feedback_type_icon">{t.icon}</span>
            <span>{t.label}</span>
          </div>
        ))}
      </div>
      <label className="feedback_modal_label">Note *</label>
      <Input.TextArea
        rows={4}
        value={note}
        onChange={(e) => setNote(e.target.value)}
        placeholder="Your feedback"
        maxLength={1000}
        showCount
        disabled={submitting}
      />
      <label className="feedback_modal_label">Reference Images</label>
      <Upload
        listType="picture"
        accept="image/*"
        multiple
        fileList={files}
        beforeUpload={() => false}
        onChange={({ fileList }) => setFiles(fileList.slice(0, MAX_IMAGES))}
        onRemove={(f) => setFiles((prev) => prev.filter((x) => x.uid !== f.uid))}
      >
        {files.length < MAX_IMAGES && <Button size="small">+ Add Image</Button>}
      </Upload>
      <div className="feedback_modal_actions">
        <Button onClick={close} disabled={submitting}>
          Cancel
        </Button>
        <Button type="primary" onClick={submit} loading={submitting}>
          Send feedback
        </Button>
      </div>
    </Modal>
  );
}
