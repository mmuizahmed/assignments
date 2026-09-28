import { useState } from "react";
import { Link, Navigate, Outlet, useLocation } from "react-router-dom";
import { App as AntApp, Button, ConfigProvider, Layout, Menu, theme as antdTheme } from "antd";
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  DashboardOutlined,
  TeamOutlined,
  BookOutlined,
  SolutionOutlined,
  FileTextOutlined,
  TrophyOutlined,
  UserOutlined,
  CommentOutlined,
} from "@ant-design/icons";
import { useApp } from "../context/AppContext";
import { useAdminTheme } from "./useAdminTheme";
import { FeedbackModal } from "./FeedbackModal";
import "./adminTheme.css";

const { Header, Sider, Content } = Layout;

const SIDEBAR_LOGO = "/assets/logo-DAnq7fSg.png";
const SIDEBAR_FAVICON = "/assets/favicon-B265vFLH.png";

const MENU = [
  { key: "/admin", icon: <DashboardOutlined />, label: "Dashboard" },
  { key: "/admin/students", icon: <TeamOutlined />, label: "Students" },
  { key: "/admin/courses", icon: <BookOutlined />, label: "Courses" },
  { key: "/admin/trainers", icon: <SolutionOutlined />, label: "Trainers" },
  { key: "/admin/quizzes", icon: <FileTextOutlined />, label: "Quizzes" },
  { key: "/admin/quiz-results", icon: <TrophyOutlined />, label: "Quiz Results" },
  { key: "/admin/profile", icon: <UserOutlined />, label: "Profile" },
];

const SunIcon = () => (
  <span role="img" aria-label="sun" className="anticon" style={{ display: "inline-flex" }}>
    <svg viewBox="0 0 24 24" width="1em" height="1em" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="5" />
      <line x1="12" y1="1" x2="12" y2="3" />
      <line x1="12" y1="21" x2="12" y2="23" />
      <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
      <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
      <line x1="1" y1="12" x2="3" y2="12" />
      <line x1="21" y1="12" x2="23" y2="12" />
      <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
      <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
    </svg>
  </span>
);
const MoonIcon = () => (
  <span role="img" aria-label="moon" className="anticon" style={{ display: "inline-flex" }}>
    <svg viewBox="0 0 24 24" width="1em" height="1em" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
    </svg>
  </span>
);

export function AdminLayout() {
  const { user } = useApp();
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(true);
  const [feedbackOpen, setFeedbackOpen] = useState(false);
  const { theme, toggle, isDark } = useAdminTheme();

  if (!user) return <Navigate to="/login" replace />;
  if (user.role !== "admin") {
    return <Navigate to={user.role === "trainer" ? "/trainer" : "/courses"} replace />;
  }

  const selectedKey =
    MENU.map((m) => m.key)
      .filter((k) => location.pathname === k || location.pathname.startsWith(k + "/"))
      .sort((a, b) => b.length - a.length)[0] || "/admin";

  return (
    <ConfigProvider
      theme={{
        algorithm: isDark ? antdTheme.darkAlgorithm : antdTheme.defaultAlgorithm,
        token: {
          colorPrimary: "#0d6db7",
          fontFamily: "Poppins, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
        },
      }}
    >
      <AntApp>
        <div className="admin-root" data-theme={theme}>
          <Layout style={{ minHeight: "100vh" }}>
            <Sider className="theme_sidebar" trigger={null} collapsible collapsed={collapsed} width={250}>
              <div className="logo">
                {collapsed ? (
                  <img className="favicon_image" src={SIDEBAR_FAVICON} alt="" />
                ) : (
                  <img src={SIDEBAR_LOGO} alt="" />
                )}
              </div>
              <Menu
                className="theme_menu"
                theme="dark"
                mode="inline"
                selectedKeys={[selectedKey]}
                items={MENU.map(({ key, icon, label }) => ({
                  key,
                  icon,
                  label: <Link to={key}>{label}</Link>,
                }))}
              />
            </Sider>
            <Layout className="site-layout">
              <Header
                className="site-layout-background"
                style={{ padding: 0, display: "flex", alignItems: "center", justifyContent: "space-between" }}
              >
                <span className="trigger" onClick={() => setCollapsed((c) => !c)}>
                  {collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
                </span>
                <div style={{ display: "flex", alignItems: "center", gap: 12, marginRight: 24 }}>
                  <Button icon={<CommentOutlined />} onClick={() => setFeedbackOpen(true)}>
                    Feedback
                  </Button>
                  <Button
                    shape="default"
                    aria-label="Toggle theme"
                    onClick={toggle}
                    icon={isDark ? <SunIcon /> : <MoonIcon />}
                  />
                </div>
              </Header>
              <Content
                className="site-layout-background"
                style={{ margin: "24px 16px", padding: 24, minHeight: 280 }}
              >
                <Outlet />
              </Content>
            </Layout>
          </Layout>
          <FeedbackModal open={feedbackOpen} onClose={() => setFeedbackOpen(false)} />
        </div>
      </AntApp>
    </ConfigProvider>
  );
}
