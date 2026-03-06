import React, { useState } from "react";
import TaskCard from "./TaskCard";

export default function Column({
  col,
  tasks,
  visibleTasks,
  onAdd,
  onEdit,
  onDelete,
  onDrop,
  onDragStart,
}) {
  const [isOver, setIsOver] = useState(false);

  const badgeText =
    visibleTasks.length !== tasks.length
      ? visibleTasks.length + "/" + tasks.length
      : String(tasks.length);

  return (
    <div
      className={"column" + (isOver ? " drag-over" : "")}
      style={{
        "--col-accent": col.accent,
        "--col-chip": col.chip,
        "--col-chip-text": col.chipText,
      }}
      onDragOver={(e) => {
        e.preventDefault();
        setIsOver(true);
      }}
      onDragLeave={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget)) {
          setIsOver(false);
        }
      }}
      onDrop={(e) => {
        e.preventDefault();
        setIsOver(false);
        onDrop(col.id);
      }}
    >
      <div className="col-header">
        <div className="col-bar"></div>
        <span className="col-label">{col.label}</span>
        <span className="col-badge">{badgeText}</span>
        <button
          className="col-add"
          title="Add task"
          onClick={() => {
            onAdd(col.id);
          }}
        >
          +
        </button>
      </div>

      <div className="col-body">
        {visibleTasks.length === 0 && !isOver && (
          <div className="col-empty">
            <div className="col-empty-icon">{col.icon}</div>
            <span>{tasks.length === 0 ? "No tasks" : "No matches"}</span>
          </div>
        )}

        {visibleTasks.map((task) => (
          <TaskCard
            key={task.id}
            task={task}
            colId={col.id}
            onEdit={onEdit}
            onDelete={onDelete}
            onDragStart={onDragStart}
          />
        ))}

        {isOver && (
          <div className="drop-ph" style={{ "--col-accent": col.accent }}></div>
        )}
      </div>
    </div>
  );
}
