import { Button, Card, Col, Row, Space } from "antd";
import { LogoutOutlined, UserOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { useApp } from "../../context/AppContext";

function Field({ label, value }) {
  return (
    <Space direction="vertical" size={2} style={{ width: "100%" }}>
      <span className="profile-field-label">{label}</span>
      <span className="profile-field-value">{value || "—"}</span>
    </Space>
  );
}

export function Profile() {
  const { user, logout } = useApp();
  const navigate = useNavigate();

  const onLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="profile-page">
      <Card
        bordered={false}
        title={
          <Space>
            <UserOutlined />
            <span>Profile Information</span>
          </Space>
        }
        extra={
          <Button type="primary" danger icon={<LogoutOutlined />} onClick={onLogout}>
            Logout
          </Button>
        }
      >
        <Row gutter={[16, 24]}>
          <Col span={24}>
            <Field label="Full Name" value={user?.full_name} />
          </Col>
          <Col xs={24} sm={12}>
            <Field label="Email" value={user?.email} />
          </Col>
          <Col xs={24} sm={12}>
            <Field label="Employee ID" value={user?.employee_id} />
          </Col>
          <Col xs={24} sm={12}>
            <Field label="Role" value="Administrator" />
          </Col>
          <Col xs={24} sm={12}>
            <Field label="Designation" value={user?.designation} />
          </Col>
        </Row>
      </Card>
    </div>
  );
}
