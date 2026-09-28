import { useMemo, useState } from "react";
import { Card, Col, Empty, Pagination, Row, Select } from "antd";
import { Column } from "@ant-design/plots";
import { useAdminTheme } from "../useAdminTheme";
import { DASHBOARD_STATS, CAMPUS_ANALYTICS, COURSE_ANALYTICS } from "../../data/adminData";

const STAT_CARDS = [
  { key: "total_students", title: "Total Students" },
  { key: "enrolled_students", title: "Enrolled Students" },
  { key: "courses", title: "Courses" },
  { key: "cities", title: "Cities" },
  { key: "campuses", title: "Campuses" },
  { key: "trainers", title: "Trainers" },
  { key: "active_slots", title: "Active Slots" },
  { key: "registration_open", title: "Registration Open" },
];

const PAGE_SIZE = 10;

function StatCard({ title, value }) {
  return (
    <Card
      hoverable
      style={{
        borderRadius: 16,
        boxShadow: "var(--app-shadow-soft)",
        transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
        border: "1px solid var(--app-border)",
        height: "100%",
      }}
      styles={{ body: { padding: "28px 24px" } }}
    >
      <div
        style={{
          fontSize: 13,
          color: "var(--app-text-muted)",
          fontWeight: 500,
          letterSpacing: "0.3px",
          textTransform: "uppercase",
        }}
      >
        {title}
      </div>
      <div style={{ fontSize: 36, fontWeight: 700, color: "#1c70b5", letterSpacing: "-0.5px" }}>
        {value.toLocaleString()}
      </div>
    </Card>
  );
}

function SortSelect({ value, onChange }) {
  return (
    <Select
      value={value}
      onChange={onChange}
      style={{ minWidth: 150 }}
      options={[
        { value: "desc", label: "High to Low" },
        { value: "asc", label: "Low to High" },
      ]}
    />
  );
}

function AnalyticsCard({ title, subtitle, data, xField, emptyText, entity, style }) {
  const { isDark } = useAdminTheme();
  const [order, setOrder] = useState("desc");
  const [page, setPage] = useState(1);

  const labelColor = isDark ? "#b8b8b8" : "#666";
  const axisColor = isDark ? "#4a4a4a" : "#d9d9d9";

  const sorted = useMemo(() => {
    const copy = [...data];
    copy.sort((a, b) => (order === "asc" ? a.value - b.value : b.value - a.value));
    return copy;
  }, [data, order]);

  const paged = sorted.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
  const chartData = paged.map((d) => ({ [xField]: d.name, students: d.value }));

  const config = {
    data: chartData,
    xField,
    yField: "students",
    label: { position: "top", style: { fill: labelColor, fontSize: 11, fontWeight: 600 } },
    meta: { students: { alias: "Enrolled Students" } },
    columnStyle: { radius: [4, 4, 0, 0] },
    color: "#1c70b5",
    xAxis: {
      label: { style: { fontSize: 11, fill: labelColor } },
      line: { style: { stroke: axisColor } },
      tickLine: { style: { stroke: axisColor } },
    },
    yAxis: {
      label: { style: { fontSize: 11, fill: labelColor } },
      grid: { line: { style: { stroke: axisColor } } },
    },
  };

  return (
    <Card
      style={{ borderRadius: 16, boxShadow: "var(--app-shadow-soft)", border: "1px solid var(--app-border)", ...style }}
      styles={{ body: { padding: 32 } }}
    >
      <div style={{ marginBottom: 28, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <h2 style={{ fontSize: 20, fontWeight: 700, color: "var(--app-text)", margin: 0, letterSpacing: "-0.3px" }}>
            {title}
          </h2>
          <p style={{ color: "var(--app-text-muted)", fontSize: 14, marginTop: 6, fontWeight: 400 }}>{subtitle}</p>
        </div>
        <SortSelect value={order} onChange={setOrder} />
      </div>
      {data.length ? (
        <>
          <div style={{ marginTop: 20 }}>
            <Column {...config} />
          </div>
          {sorted.length > PAGE_SIZE && (
            <div style={{ marginTop: 32, textAlign: "center" }}>
              <Pagination
                current={page}
                total={sorted.length}
                pageSize={PAGE_SIZE}
                onChange={setPage}
                showSizeChanger={false}
                showTotal={(total, range) => (
                  <span style={{ color: "var(--app-text-muted)", fontSize: 14 }}>
                    Showing {range[0]}-{range[1]} of {total} {entity}
                  </span>
                )}
              />
            </div>
          )}
        </>
      ) : (
        <Empty description={emptyText} />
      )}
    </Card>
  );
}

export function Dashboard() {
  return (
    <div style={{ minHeight: "100vh", maxWidth: 1600, margin: "0 auto" }}>
      <Row gutter={[20, 20]} style={{ marginBottom: 32 }}>
        {STAT_CARDS.map((card) => (
          <Col xs={24} sm={12} md={8} lg={6} key={card.key}>
            <StatCard title={card.title} value={DASHBOARD_STATS[card.key]} />
          </Col>
        ))}
      </Row>

      <AnalyticsCard
        title="Campus Analytics"
        subtitle="Student enrollment by campus location"
        data={CAMPUS_ANALYTICS}
        xField="campus"
        emptyText="No campus analytics data available"
        entity="campuses"
        style={{ marginBottom: 32 }}
      />
      <AnalyticsCard
        title="Course Analytics"
        subtitle="Student enrollment distribution by course"
        data={COURSE_ANALYTICS}
        xField="course"
        emptyText="No courses analytics data available"
        entity="courses"
      />
    </div>
  );
}
