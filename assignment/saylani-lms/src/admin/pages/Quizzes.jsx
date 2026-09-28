import { useMemo, useState } from "react";
import {
  Button,
  Card,
  Form,
  Input,
  InputNumber,
  Modal,
  Popconfirm,
  Select,
  Space,
  Table,
  Tag,
  Typography,
  App as AntApp,
} from "antd";
import { PlusOutlined, EditOutlined, DeleteOutlined, SearchOutlined } from "@ant-design/icons";
import { useAdminData } from "../AdminDataContext";
import { COURSES } from "../../data/adminData";

const { Title } = Typography;

const STATUS_COLORS = { published: "green", draft: "orange" };

export function Quizzes() {
  const { quizzes, quizCrud } = useAdminData();
  const { message } = AntApp.useApp();
  const [search, setSearch] = useState("");
  const [courseFilter, setCourseFilter] = useState(null);
  const [statusFilter, setStatusFilter] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form] = Form.useForm();

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return quizzes.filter((quiz) => {
      const title = quiz.title?.toLowerCase() || "";
      const courseId = quiz.courses?.[0]?._id;
      const matchesSearch = !q || title.includes(q);
      const matchesCourse = !courseFilter || courseId === courseFilter;
      const matchesStatus = !statusFilter || quiz.status === statusFilter;
      return matchesSearch && matchesCourse && matchesStatus;
    });
  }, [quizzes, search, courseFilter, statusFilter]);

  const openAdd = () => {
    setEditing(null);
    form.resetFields();
    form.setFieldsValue({ status: "draft", question_count: 20 });
    setModalOpen(true);
  };

  const openEdit = (record) => {
    setEditing(record);
    form.setFieldsValue({
      title: record.title,
      course_id: record.courses?.[0]?._id,
      module: record.module,
      question_count: record.question_count,
      status: record.status,
    });
    setModalOpen(true);
  };

  const handleSubmit = async () => {
    const v = await form.validateFields();
    const course = COURSES.find((c) => c._id === v.course_id);
    const payload = {
      title: v.title,
      module: v.module,
      question_count: v.question_count,
      total_marks: v.question_count,
      status: v.status,
      courses: [{ _id: course?._id, en: { course_name: course?.en.course_name } }],
    };
    if (editing) {
      quizCrud.update(editing._id, payload);
      message.success("Quiz updated");
    } else {
      quizCrud.add(payload);
      message.success("Quiz added");
    }
    setModalOpen(false);
  };

  const columns = [
    { title: "Quiz Name", dataIndex: "title", key: "title" },
    {
      title: "Courses",
      key: "courses",
      render: (_, r) => (r.courses || []).map((c) => c.en?.course_name).join(", "),
    },
    { title: "Module", dataIndex: "module", key: "module" },
    { title: "Questions", dataIndex: "question_count", key: "questions" },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status) => <Tag color={STATUS_COLORS[status] || "default"}>{String(status).toUpperCase()}</Tag>,
    },
    {
      title: "Action",
      key: "action",
      render: (_, r) => (
        <Space>
          <Button size="small" icon={<EditOutlined />} onClick={() => openEdit(r)} />
          <Popconfirm
            title="Delete this quiz?"
            onConfirm={() => {
              quizCrud.remove(r._id);
              message.success("Quiz deleted");
            }}
          >
            <Button size="small" danger icon={<DeleteOutlined />} />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
        <Title level={3} style={{ margin: 0, color: "var(--app-text)" }}>
          Quizzes
        </Title>
        <Button type="primary" icon={<PlusOutlined />} onClick={openAdd}>
          Add Quiz
        </Button>
      </div>
      <Card>
        <Space wrap style={{ marginBottom: 16 }}>
          <Input
            allowClear
            prefix={<SearchOutlined />}
            placeholder="Search quiz name"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ width: 240 }}
          />
          <Select
            allowClear
            placeholder="Filter by course"
            value={courseFilter}
            onChange={setCourseFilter}
            style={{ width: 240 }}
            options={COURSES.map((c) => ({ value: c._id, label: c.en.course_name }))}
          />
          <Select
            allowClear
            placeholder="Filter by status"
            value={statusFilter}
            onChange={setStatusFilter}
            style={{ width: 160 }}
            options={[
              { value: "published", label: "Published" },
              { value: "draft", label: "Draft" },
            ]}
          />
        </Space>
        <Table rowKey="_id" columns={columns} dataSource={filtered} pagination={{ pageSize: 10 }} scroll={{ x: 800 }} />
      </Card>

      <Modal
        title={editing ? "Edit Quiz" : "Add Quiz"}
        open={modalOpen}
        onOk={handleSubmit}
        onCancel={() => setModalOpen(false)}
        okText={editing ? "Update" : "Add"}
        destroyOnClose
      >
        <Form form={form} layout="vertical" style={{ marginTop: 16 }}>
          <Form.Item name="title" label="Quiz Name" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="course_id" label="Course" rules={[{ required: true }]}>
            <Select options={COURSES.map((c) => ({ value: c._id, label: c.en.course_name }))} />
          </Form.Item>
          <Form.Item name="module" label="Module" rules={[{ required: true }]}>
            <Input placeholder="e.g. Module 1" />
          </Form.Item>
          <Form.Item name="question_count" label="Questions" rules={[{ required: true }]}>
            <InputNumber min={1} max={200} style={{ width: "100%" }} />
          </Form.Item>
          <Form.Item name="status" label="Status" rules={[{ required: true }]}>
            <Select
              options={[
                { value: "published", label: "Published" },
                { value: "draft", label: "Draft" },
              ]}
            />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
