import React from "react";
import { PRIORITIES } from "../constants";

export default function PriorityBadge({ priorityId }) {
  const p = PRIORITIES.find((x) => x.id === priorityId);
  if (!p) return null;

  return (
    <span
      className="priority-badge"
      style={{ background: p.bg, color: p.text }}
    >
      <span className="pb-dot" style={{ background: p.dot }}></span>
      {p.label}
    </span>
  );
}
