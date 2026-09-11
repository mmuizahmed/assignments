export default function StatusChip({
  label,
}: {
  label: "Active" | "Pending" | "Rejected" | "Complete" | "Processing" | "Cancel" | "Hold";
}) {
  const map: Record<string, { bg: string; color: string }> = {
    Active: { bg: "rgba(17, 200, 111, 0.15)", color: "#11c86f" },
    Complete: { bg: "rgba(17, 200, 111, 0.15)", color: "#11c86f" },
    Pending: { bg: "rgba(248, 187, 5, 0.15)", color: "#f8bb05" },
    Processing: { bg: "rgba(33, 150, 243, 0.15)", color: "#2196f3" },
    Hold: { bg: "rgba(33, 150, 243, 0.15)", color: "#2196f3" },
    Rejected: { bg: "rgba(244, 67, 54, 0.15)", color: "#f44336" },
    Cancel: { bg: "rgba(244, 67, 54, 0.15)", color: "#f44336" },
  };
  const s = map[label];
  return (
    <span
      className="inline-flex h-6 items-center rounded-2xl px-2 text-[13px] leading-[19.5px]"
      style={{ background: s.bg, color: s.color }}
    >
      {label}
    </span>
  );
}
