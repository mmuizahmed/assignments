import { useMemo, useState } from "react";
import {
  Button,
  Card,
  Form,
  Input,
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

const STATUS_COLORS = { active: "green", pending: "orange", completed: "blue", dropped: "red" };
const PAYMENT_COLORS = { paid: "green", pending: "orange", unpaid: "red" };
const STATUS_OPTIONS = ["active", "pending", "completed", "dropped"];
const PAYMENT_OPTIONS = ["paid", "pending", "unpaid"];

export function Students() {
  const { students, studentCrud } = useAdminData();
  const { message } = AntApp.useApp();
  const [search, setSearch] = useState("");
  const [courseFilter, setCourseFilter] = useState(null);
  const [statusFilter, setStatusFilter] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form] = Form.useForm();

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return students.filter((s) => {
      const name = s.student_id?.full_name?.toLowerCase() || "";
      const roll = s.roll_number?.toLowerCase() || "";
      const cnic = s.student_id?.student_cnic || "";
      const matchesSearch = !q || name.includes(q) || roll.includes(q) || cnic.includes(q);
      const matchesCourse = !courseFilter || s.new_course?.course?._id === courseFilter;
      const matchesStatus = !statusFilter || s.status === statusFilter;
      return matchesSearch && matchesCourse && matchesStatus;
    });
  }, [students, search, courseFilter, statusFilter]);

  const openAdd = () => {
    setEditing(null);
    form.resetFields();
    setModalOpen(true);
  };

  const openEdit = (record) => {
    setEditing(record);
    form.setFieldsValue({
      full_name: record.student_id?.full_name,
      father_name: record.student_id?.father_name,
      student_cnic: record.student_id?.student_cnic,
      contact_number: record.student_id?.contact_number,
      roll_number: record.roll_number,
      course_id: record.new_course?.course?._id,
      status: record.status,
      payment_status: record.payment_data?.status,
    });
    setModalOpen(true);
  };

  const handleSubmit = async () => {
    const v = await form.validateFields();
    const course = COURSES.find((c) => c._id === v.course_id);
    const payload = {
      roll_number: v.roll_number,
      student_id: {
        full_name: v.full_name,
        father_name: v.father_name,
        student_cnic: v.student_cnic,
        contact_number: v.contact_number,
      },
      new_course: { course: { _id: course?._id, en: { course_name: course?.en.course_name } } },
      status: v.status,
      payment_data: { status: v.payment_status },
    };
    if (editing) {
      studentCrud.update(editing._id, payload);
      message.success("Student updated");
    } else {
      studentCrud.add(payload);
      message.success("Student added");
    }
    setModalOpen(false);
  };

  const columns = [
    { title: "Roll number", dataIndex: "roll_number", key: "roll_number" },
    {
      title: "Student name",
      key: "name",
      render: (_, r) => r.student_id?.full_name,
    },
    {
      title: "Father name",
      key: "father",
      render: (_, r) => r.student_id?.father_name,
    },
    {
      title: "CNIC",
      key: "cnic",
      render: (_, r) => r.student_id?.student_cnic,
    },
    {
      title: "Phone",
      key: "phone",
      render: (_, r) => r.student_id?.contact_number,
    },
    {
      title: "Course",
      key: "course",
      render: (_, r) => r.new_course?.course?.en?.course_name,
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status) => <Tag color={STATUS_COLORS[status] || "default"}>{String(status).toUpperCase()}</Tag>,
    },
    {
      title: "Payment Status",
      key: "payment",
      render: (_, r) => {
        const status = r.payment_data?.status;
        return <Tag color={PAYMENT_COLORS[status] || "red"}>{String(status).toUpperCase()}</Tag>;
      },
    },
    {
      title: "Action",
      key: "action",
      render: (_, r) => (
        <Space>
          <Button size="small" icon={<EditOutlined />} onClick={() => openEdit(r)} />
          <Popconfirm
            title="Delete this student?"
            onConfirm={() => {
              studentCrud.remove(r._id);
              message.success("Student deleted");
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
          Students
        </Title>
        <Button type="primary" icon={<PlusOutlined />} onClick={openAdd}>
          Add Student
        </Button>
      </div>
      <Card>
        <Space wrap style={{ marginBottom: 16 }}>
          <Input
            allowClear
            prefix={<SearchOutlined />}
            placeholder="Search name / roll / CNIC"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ width: 260 }}
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
            style={{ width: 180 }}
            options={STATUS_OPTIONS.map((s) => ({ value: s, label: s }))}
          />
        </Space>
        <Table
          rowKey="_id"
          columns={columns}
          dataSource={filtered}
          pagination={{ pageSize: 10 }}
          scroll={{ x: 1000 }}
        />
      </Card>

      <Modal
        title={editing ? "Edit Student" : "Add Student"}
        open={modalOpen}
        onOk={handleSubmit}
        onCancel={() => setModalOpen(false)}
        okText={editing ? "Update" : "Add"}
        destroyOnClose
      >
        <Form form={form} layout="vertical" style={{ marginTop: 16 }}>
          <Form.Item name="full_name" label="Student name" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="father_name" label="Father name" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="student_cnic" label="CNIC" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="contact_number" label="Phone">
            <Input />
          </Form.Item>
          <Form.Item name="roll_number" label="Roll number" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="course_id" label="Course" rules={[{ required: true }]}>
            <Select options={COURSES.map((c) => ({ value: c._id, label: c.en.course_name }))} />
          </Form.Item>
          <Space style={{ display: "flex" }} size="middle">
            <Form.Item name="status" label="Status" rules={[{ required: true }]} style={{ flex: 1 }}>
              <Select options={STATUS_OPTIONS.map((s) => ({ value: s, label: s }))} />
            </Form.Item>
            <Form.Item name="payment_status" label="Payment Status" rules={[{ required: true }]} style={{ flex: 1 }}>
              <Select options={PAYMENT_OPTIONS.map((s) => ({ value: s, label: s }))} />
            </Form.Item>
          </Space>
        </Form>
      </Modal>
    </div>
  );
}
