import React from "react";
import Column from "./Column";
import { COLUMNS } from "../constants";

export default function Board({
  board,
  getVisible,
  openAddModal,
  openEditModal,
  deleteTask,
  handleDrop,
  handleDragStart,
}) {
  return (
    <div className="board-wrap">
      <div className="board">
        {COLUMNS.map((col) => (
          <Column
            key={col.id}
            col={col}
            tasks={board[col.id] || []}
            visibleTasks={getVisible(col.id)}
            onAdd={openAddModal}
            onEdit={openEditModal}
            onDelete={deleteTask}
            onDrop={handleDrop}
            onDragStart={handleDragStart}
          />
        ))}
      </div>
    </div>
  );
}
