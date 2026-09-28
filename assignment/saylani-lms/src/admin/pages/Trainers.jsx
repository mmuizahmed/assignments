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
import { COURSES, CITIES } from "../../data/adminData";

const { Title } = Typography;

export function Trainers() {
  const { trainers, trainerCrud } = useAdminData();
  const { message } = AntApp.useApp();
  const [search, setSearch] = useState("");
  const [cityFilter, setCityFilter] = useState(null);
  const [statusFilter, setStatusFilter] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form] = Form.useForm();

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return trainers.filter((t) => {
      const name = t.en?.trainer_name?.toLowerCase() || "";
      const email = t.email?.toLowerCase() || "";
      const cities = (t.city || []).map((c) => c.en?.city_name);
      const active = !t.is_deleted;
      const matchesSearch = !q || name.includes(q) || email.includes(q);
      const matchesCity = !cityFilter || cities.includes(cityFilter);
      const matchesStatus =
        statusFilter === null || statusFilter === undefined
          ? true
          : statusFilter === "active"
            ? active
            : !active;
      return matchesSearch && matchesCity && matchesStatus;
    });
  }, [trainers, search, cityFilter, statusFilter]);

  const openAdd = () => {
    setEditing(null);
    form.resetFields();
    form.setFieldsValue({ status: "active" });
    setModalOpen(true);
  };

  const openEdit = (record) => {
    setEditing(record);
    form.setFieldsValue({
      trainer_name: record.en?.trainer_name,
      email: record.email,
      employee_id: record.employee_id,
      course_ids: (record.courses || []).map((c) => c._id),
      city_ids: (record.city || []).map((c) => c._id),
      status: record.is_deleted ? "inactive" : "active",
    });
    setModalOpen(true);
  };

  const handleSubmit = async () => {
    const v = await form.validateFields();
    const payload = {
      en: { trainer_name: v.trainer_name },
      email: v.email,
      employee_id: v.employee_id,
      courses: (v.course_ids || []).map((id) => {
        const c = COURSES.find((x) => x._id === id);
        return { _id: id, en: { course_name: c?.en.course_name } };
      }),
      city: (v.city_ids || []).map((id) => {
        const c = CITIES.find((x) => x._id === id);
        return { _id: id, en: { city_name: c?.en.city_name } };
      }),
      is_deleted: v.status === "inactive",
    };
    if (editing) {
      trainerCrud.update(editing._id, payload);
      message.success("Trainer updated");
    } else {
      trainerCrud.add(payload);
      message.success("Trainer added");
    }
    setModalOpen(false);
  };

  const columns = [
    { title: "Trainer name", key: "name", render: (_, r) => r.en?.trainer_name },
    { title: "Email", dataIndex: "email", key: "email" },
    { title: "Employee ID", dataIndex: "employee_id", key: "employee_id" },
    {
      title: "Courses",
      key: "courses",
      render: (_, r) => (
        <Space size={[0, 4]} wrap>
          {(r.courses || []).map((c) => (
            <Tag key={c._id}>{c.en?.course_name}</Tag>
          ))}
        </Space>
      ),
    },
    {
      title: "Cities",
      key: "cities",
      render: (_, r) => (r.city || []).map((c) => c.en?.city_name).join(", "),
    },
    {
      title: "Status",
      key: "status",
      render: (_, r) => (
        <Tag color={r.is_deleted ? "red" : "green"}>{r.is_deleted ? "INACTIVE" : "ACTIVE"}</Tag>
      ),
    },
    {
      title: "Action",
      key: "action",
      render: (_, r) => (
        <Space>
          <Button size="small" icon={<EditOutlined />} onClick={() => openEdit(r)} />
          <Popconfirm
            title="Delete this trainer?"
            onConfirm={() => {
              trainerCrud.remove(r._id);
              message.success("Trainer deleted");
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
          Trainers
        </Title>
        <Button type="primary" icon={<PlusOutlined />} onClick={openAdd}>
          Add Trainer
        </Button>
      </div>
      <Card>
        <Space wrap style={{ marginBottom: 16 }}>
          <Input
            allowClear
            prefix={<SearchOutlined />}
            placeholder="Search name / email"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ width: 240 }}
          />
          <Select
            allowClear
            placeholder="Filter by city"
            value={cityFilter}
            onChange={setCityFilter}
            style={{ width: 180 }}
            options={CITIES.map((c) => ({ value: c.en.city_name, label: c.en.city_name }))}
          />
          <Select
            allowClear
            placeholder="Filter by status"
            value={statusFilter}
            onChange={setStatusFilter}
            style={{ width: 160 }}
            options={[
              { value: "active", label: "Active" },
              { value: "inactive", label: "Inactive" },
            ]}
          />
        </Space>
        <Table rowKey="_id" columns={columns} dataSource={filtered} pagination={{ pageSize: 10 }} scroll={{ x: 1000 }} />
      </Card>

      <Modal
        title={editing ? "Edit Trainer" : "Add Trainer"}
        open={modalOpen}
        onOk={handleSubmit}
        onCancel={() => setModalOpen(false)}
        okText={editing ? "Update" : "Add"}
        destroyOnClose
      >
        <Form form={form} layout="vertical" style={{ marginTop: 16 }}>
          <Form.Item name="trainer_name" label="Trainer name" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="email" label="Email" rules={[{ required: true, type: "email" }]}>
            <Input />
          </Form.Item>
          <Form.Item name="employee_id" label="Employee ID" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="course_ids" label="Courses">
            <Select mode="multiple" options={COURSES.map((c) => ({ value: c._id, label: c.en.course_name }))} />
          </Form.Item>
          <Form.Item name="city_ids" label="Cities">
            <Select mode="multiple" options={CITIES.map((c) => ({ value: c._id, label: c.en.city_name }))} />
          </Form.Item>
          <Form.Item name="status" label="Status" rules={[{ required: true }]}>
            <Select
              options={[
                { value: "active", label: "Active" },
                { value: "inactive", label: "Inactive" },
              ]}
            />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
