import React from "react";
import { COLUMNS } from "../constants";

// shows the little pills with counts and progress bar under header
// just loop over columns and reads from board state
export default function StatsStrip({ board, donePct }) {
  return (
    <div className="stats-strip">
      {COLUMNS.map((col) => (
        <div
          key={col.id}
          className="stat-pill"
          style={{ background: col.chip, color: col.chipText }}
        >
          <div className="stat-dot" style={{ background: col.accent }}></div>
          {(board[col.id] || []).length} {col.label}
        </div>
      ))}

      <div className="progress-wrap">
        <span>{donePct}% complete</span>
        <div className="progress-track">
          <div className="progress-fill" style={{ width: donePct + "%" }}></div>
        </div>
      </div>
    </div>
  );
}
