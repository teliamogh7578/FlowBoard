import React from "react";
import { COLUMNS, PRIORITIES } from "../constants";
// popup window for creating or editing a task

export default function Modal({ mode, form, setForm, onSave, onClose }) {
  return (
    <div
      className="overlay"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="modal">
        <div className="modal-head">
          <h2 className="modal-title">
            {mode === "add" ? "New task" : "Edit task"}
          </h2>
          <button className="modal-close" onClick={onClose}>
            ×
          </button>
        </div>

        <div className="field">
          <label>Title</label>
          <input
            autoFocus
            value={form.title}
            placeholder="Task title"
            onChange={(e) => {
              setForm((prev) => ({ ...prev, title: e.target.value }));
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter") onSave();
            }}
          />
        </div>

        <div className="field">
          <label>Description (optional)</label>
          <textarea
            value={form.description}
            placeholder="Add a description..."
            onChange={(e) => {
              setForm((prev) => ({ ...prev, description: e.target.value }));
            }}
          />
        </div>

        <div className="field">
          <label>Priority</label>
          <div className="priority-picker">
            {PRIORITIES.map((p) => {
              const isSelected = form.priority === p.id;
              return (
                <button
                  key={p.id}
                  type="button"
                  className={"pp-option" + (isSelected ? " selected" : "")}
                  style={{
                    "--pp-bg": p.bg,
                    "--pp-text": p.text,
                    "--pp-dot": p.dot,
                  }}
                  onClick={() => {
                    setForm((prev) => ({ ...prev, priority: p.id }));
                  }}
                >
                  <span className="pp-dot"></span>
                  {p.label}
                </button>
              );
            })}
          </div>
        </div>

        <div className="field">
          <label>Column</label>
          <select
            value={form.colId}
            onChange={(e) => {
              setForm((prev) => ({ ...prev, colId: e.target.value }));
            }}
          >
            {COLUMNS.map((col) => (
              <option key={col.id} value={col.id}>
                {col.label}
              </option>
            ))}
          </select>
        </div>

        <div className="modal-footer">
          <button className="btn-text" onClick={onClose}>
            Cancel
          </button>
          <button
            className="btn-contained"
            onClick={onSave}
            disabled={!form.title.trim()}
          >
            {mode === "add" ? "Create" : "Save"}
          </button>
        </div>
      </div>
    </div>
  );
}
