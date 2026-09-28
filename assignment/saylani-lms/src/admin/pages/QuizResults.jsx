import { useMemo, useState } from "react";
import { Button, Card, Input, Popconfirm, Select, Space, Table, Tag, Typography, App as AntApp } from "antd";
import { DeleteOutlined, SearchOutlined } from "@ant-design/icons";
import { useAdminData } from "../AdminDataContext";

const { Title } = Typography;

function fmtDate(iso) {
  try {
    return new Date(iso).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });
  } catch {
    return iso;
  }
}

export function QuizResults() {
  const { quizResults, quizResultCrud, quizzes } = useAdminData();
  const { message } = AntApp.useApp();
  const [search, setSearch] = useState("");
  const [quizFilter, setQuizFilter] = useState(null);
  const [statusFilter, setStatusFilter] = useState(null);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return quizResults.filter((r) => {
      const name = r.student?.full_name?.toLowerCase() || "";
      const roll = r.student?.roll_number?.toLowerCase() || "";
      const matchesSearch = !q || name.includes(q) || roll.includes(q);
      const matchesQuiz = !quizFilter || r.quiz?._id === quizFilter;
      const matchesStatus = !statusFilter || r.status === statusFilter;
      return matchesSearch && matchesQuiz && matchesStatus;
    });
  }, [quizResults, search, quizFilter, statusFilter]);

  const columns = [
    { title: "Quiz Date", key: "date", render: (_, r) => fmtDate(r.quiz_date) },
    { title: "Student Name", key: "student", render: (_, r) => r.student?.full_name },
    { title: "Roll Number", key: "roll", render: (_, r) => r.student?.roll_number },
    { title: "Trainer", key: "trainer", render: (_, r) => r.trainer?.en?.trainer_name },
    { title: "Quiz", key: "quiz", render: (_, r) => r.quiz?.title },
    {
      title: "Score",
      key: "score",
      render: (_, r) => `${r.obtained_marks}/${r.total_marks} (${r.score}%)`,
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status) => <Tag color={status === "pass" ? "green" : "red"}>{String(status).toUpperCase()}</Tag>,
    },
    {
      title: "Actions",
      key: "action",
      render: (_, r) => (
        <Popconfirm
          title="Delete this result?"
          onConfirm={() => {
            quizResultCrud.remove(r._id);
            message.success("Result deleted");
          }}
        >
          <Button size="small" danger icon={<DeleteOutlined />} />
        </Popconfirm>
      ),
    },
  ];

  return (
    <div>
      <Title level={3} style={{ marginTop: 0, color: "var(--app-text)" }}>
        Quiz Results
      </Title>
      <Card>
        <Space wrap style={{ marginBottom: 16 }}>
          <Input
            allowClear
            prefix={<SearchOutlined />}
            placeholder="Search student / roll"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ width: 240 }}
          />
          <Select
            allowClear
            placeholder="Filter by quiz"
            value={quizFilter}
            onChange={setQuizFilter}
            style={{ width: 240 }}
            options={quizzes.map((q) => ({ value: q._id, label: q.title }))}
          />
          <Select
            allowClear
            placeholder="Filter by status"
            value={statusFilter}
            onChange={setStatusFilter}
            style={{ width: 160 }}
            options={[
              { value: "pass", label: "Pass" },
              { value: "fail", label: "Fail" },
            ]}
          />
        </Space>
        <Table rowKey="_id" columns={columns} dataSource={filtered} pagination={{ pageSize: 10 }} scroll={{ x: 900 }} />
      </Card>
    </div>
  );
}
