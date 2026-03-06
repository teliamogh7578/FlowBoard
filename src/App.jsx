import React, { useState } from "react";
import {
  generateId,
  loadBoard,
  saveBoard,
  COLUMNS,
  PRIORITIES,
} from "./constants";
import Header from "./components/Header";
import StatsStrip from "./components/StatsStrip";
import FilterBar from "./components/FilterBar";
import Board from "./components/Board";
import Modal from "./components/Modal";

export default function App() {
  // board will be area where i store all tasks.
  const [board, setBoard] = useState(() => loadBoard());
  const [isDarkMode, setIsDarkMode] = useState(() => {
    try {
      const saved = localStorage.getItem("kanban-dark-mode");
      return saved ? JSON.parse(saved) : false;
    } catch {
      return false;
    }
  });
  const [search, setSearch] = useState(""); //search for task
  const [filterPriority, setFilterPriority] = useState(""); //priority filter
  const [modal, setModal] = useState(null);
  const [form, setForm] = useState({
    title: "",
    description: "",
    priority: "medium",
    colId: "todo",
  });
  // reminder to do in the future now mess time: could merge modal and form into one state object to be neater.
  const [drag, setDrag] = useState(null);

  const totalTasks = COLUMNS.reduce(
    (sum, col) => sum + (board[col.id] || []).length,
    0,
  );
  const doneCount = (board["done"] || []).length;
  const donePct =
    totalTasks > 0 ? Math.round((doneCount / totalTasks) * 100) : 0;

  function getVisible(colId) {
    const tasks = board[colId] || [];
    const q = search.trim().toLowerCase();

    return tasks.filter((task) => {
      const matchesSearch =
        !q ||
        task.title.toLowerCase().includes(q) ||
        (task.description || "").toLowerCase().includes(q);
      const matchesPriority =
        !filterPriority || task.priority === filterPriority;
      return matchesSearch && matchesPriority;
    });
  }

  // open the modal for adding a task.
  function openAddModal(colId) {
    setForm({ title: "", description: "", priority: "medium", colId });
    setModal({ mode: "add", taskId: null, sourceColId: colId });
  }

  // open the modal to edit an existing task....
  function openEditModal(task, colId) {
    setForm({
      title: task.title,
      description: task.description || "",
      priority: task.priority || "medium",
      colId,
    });
    setModal({ mode: "edit", taskId: task.id, sourceColId: colId });
  }

  // just hide the modal
  function closeModal() {
    setModal(null);
  }

  // dark mode plus local storage
  function toggleDarkMode() {
    const newMode = !isDarkMode;
    setIsDarkMode(newMode);
    localStorage.setItem("kanban-dark-mode", JSON.stringify(newMode));
  }

  React.useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add("dark-mode");
    } else {
      document.documentElement.classList.remove("dark-mode");
    }
  }, [isDarkMode]);

  //when save or create is pressed this should happen:
  function saveTask() {
    if (!form.title.trim()) return;

    const newBoard = {
      todo: [...(board.todo || [])],
      inprogress: [...(board.inprogress || [])],
      done: [...(board.done || [])],
    };

    if (modal.mode === "add") {
      const newTask = {
        id: generateId(),
        title: form.title.trim(),
        description: form.description.trim(),
        priority: form.priority,
      };
      newBoard[form.colId].push(newTask);
    } else {
      const srcCol = modal.sourceColId;
      const dstCol = form.colId;
      const idx = newBoard[srcCol].findIndex((t) => t.id === modal.taskId);
      if (idx === -1) return;

      const updated = Object.assign({}, newBoard[srcCol][idx], {
        title: form.title.trim(),
        description: form.description.trim(),
        priority: form.priority,
      });

      if (srcCol === dstCol) {
        newBoard[srcCol][idx] = updated;
      } else {
        newBoard[srcCol].splice(idx, 1);
        newBoard[dstCol].push(updated);
      }
    }

    saveBoard(newBoard);
    setBoard(newBoard);
    closeModal();
  }

  // delete task
  function deleteTask(taskId, colId) {
    const newBoard = Object.assign({}, board);
    newBoard[colId] = board[colId].filter((t) => t.id !== taskId);
    saveBoard(newBoard);
    setBoard(newBoard);
  }

  // keep track of which card is being dragged so dropper knows
  function handleDragStart(taskId, srcColId) {
    setDrag({ taskId, srcColId });
  }

  // when a card is dropped into a column, move it
  function handleDrop(dstColId) {
    if (!drag || drag.srcColId === dstColId) {
      setDrag(null);
      return;
    }

    const newBoard = Object.assign({}, board);
    const idx = newBoard[drag.srcColId].findIndex((t) => t.id === drag.taskId);
    if (idx === -1) {
      setDrag(null);
      return;
    }

    const task = newBoard[drag.srcColId].splice(idx, 1)[0];
    newBoard[dstColId] = [...(newBoard[dstColId] || []), task];
    saveBoard(newBoard);
    setBoard(newBoard);
    setDrag(null);
  }

  return (
    <div className="app">
      <Header
        onNewTask={() => openAddModal("todo")}
        isDarkMode={isDarkMode}
        onToggleDarkMode={toggleDarkMode}
      />
      <StatsStrip board={board} donePct={donePct} />
      <FilterBar
        search={search}
        setSearch={setSearch}
        filterPriority={filterPriority}
        setFilterPriority={setFilterPriority}
      />
      <Board
        board={board}
        getVisible={getVisible}
        openAddModal={openAddModal}
        openEditModal={openEditModal}
        deleteTask={deleteTask}
        handleDrop={handleDrop}
        handleDragStart={handleDragStart}
      />

      {modal && (
        <Modal
          mode={modal.mode}
          form={form}
          setForm={setForm}
          onSave={saveTask}
          onClose={closeModal}
        />
      )}
    </div>
  );
}
