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
  Switch,
  Table,
  Tag,
  Typography,
  App as AntApp,
} from "antd";
import { PlusOutlined, EditOutlined, DeleteOutlined, SearchOutlined } from "@ant-design/icons";
import { useAdminData } from "../AdminDataContext";
import { CATEGORIES } from "../../data/adminData";

const { Title } = Typography;

export function Courses() {
  const { courses, courseCrud } = useAdminData();
  const { message } = AntApp.useApp();
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form] = Form.useForm();

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return courses.filter((c) => {
      const name = c.en?.course_name?.toLowerCase() || "";
      const cat = c.en?.course_category?.en?.category_name || "";
      const matchesSearch = !q || name.includes(q);
      const matchesCat = !categoryFilter || cat === categoryFilter;
      return matchesSearch && matchesCat;
    });
  }, [courses, search, categoryFilter]);

  const openAdd = () => {
    setEditing(null);
    form.resetFields();
    form.setFieldsValue({ show_on_website: true });
    setModalOpen(true);
  };

  const openEdit = (record) => {
    setEditing(record);
    form.setFieldsValue({
      course_name: record.en?.course_name,
      category: record.en?.course_category?.en?.category_name,
      course_duration: record.en?.course_duration,
      show_on_website: record.show_on_website,
    });
    setModalOpen(true);
  };

  const handleSubmit = async () => {
    const v = await form.validateFields();
    const cat = CATEGORIES.find((c) => c.en.category_name === v.category);
    const payload = {
      show_on_website: v.show_on_website,
      en: {
        course_name: v.course_name,
        course_duration: v.course_duration,
        course_category: { _id: cat?._id, en: { category_name: v.category } },
      },
    };
    if (editing) {
      courseCrud.update(editing._id, payload);
      message.success("Course updated");
    } else {
      courseCrud.add({ sequence: courses.length + 1, ...payload });
      message.success("Course added");
    }
    setModalOpen(false);
  };

  const columns = [
    { title: "Sno.", key: "sno", width: 70, render: (_, __, i) => i + 1 },
    { title: "Name", key: "name", render: (_, r) => r.en?.course_name },
    {
      title: "Type",
      key: "type",
      render: (_, r) => r.en?.course_category?.en?.category_name,
    },
    { title: "Duration", key: "duration", render: (_, r) => r.en?.course_duration },
    {
      title: "Show On Website",
      dataIndex: "show_on_website",
      key: "show",
      render: (show) => <Tag color={show ? "green" : "default"}>{show ? "Yes" : "No"}</Tag>,
    },
    {
      title: "Action",
      key: "action",
      render: (_, r) => (
        <Space>
          <Button size="small" icon={<EditOutlined />} onClick={() => openEdit(r)} />
          <Popconfirm
            title="Delete this course?"
            onConfirm={() => {
              courseCrud.remove(r._id);
              message.success("Course deleted");
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
          Courses
        </Title>
        <Button type="primary" icon={<PlusOutlined />} onClick={openAdd}>
          Add Course
        </Button>
      </div>
      <Card>
        <Space wrap style={{ marginBottom: 16 }}>
          <Input
            allowClear
            prefix={<SearchOutlined />}
            placeholder="Search course name"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ width: 260 }}
          />
          <Select
            allowClear
            placeholder="Filter by type"
            value={categoryFilter}
            onChange={setCategoryFilter}
            style={{ width: 220 }}
            options={CATEGORIES.map((c) => ({ value: c.en.category_name, label: c.en.category_name }))}
          />
        </Space>
        <Table rowKey="_id" columns={columns} dataSource={filtered} pagination={{ pageSize: 10 }} scroll={{ x: 700 }} />
      </Card>

      <Modal
        title={editing ? "Edit Course" : "Add Course"}
        open={modalOpen}
        onOk={handleSubmit}
        onCancel={() => setModalOpen(false)}
        okText={editing ? "Update" : "Add"}
        destroyOnClose
      >
        <Form form={form} layout="vertical" style={{ marginTop: 16 }}>
          <Form.Item name="course_name" label="Name" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="category" label="Type" rules={[{ required: true }]}>
            <Select options={CATEGORIES.map((c) => ({ value: c.en.category_name, label: c.en.category_name }))} />
          </Form.Item>
          <Form.Item name="course_duration" label="Duration" rules={[{ required: true }]}>
            <Input placeholder="e.g. 6 Months" />
          </Form.Item>
          <Form.Item name="show_on_website" label="Show On Website" valuePropName="checked">
            <Switch />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
