/*
  script.js — Kanban Board
  Built with BASIC React. The only React features used are:
    • useState  — to store and update data
    • JSX       — HTML-like syntax inside JavaScript
    • Components — plain functions that return JSX
  Nothing else. No useEffect, no useRef, no Redux, no router.
*/

/* =======================================================================
   STEP 1 — Pull useState out of the React object.
   React is loaded from the CDN as a global variable called "React".
   We grab useState from it so we can write useState() instead of
   React.useState() every time.
======================================================================= */
const { useState } = React;

/* =======================================================================
   STEP 2 — FIXED DATA (never changes while the app runs)
   These are constants — arrays/objects that describe our columns
   and priority levels. They are defined once and only read, never written.
======================================================================= */

/* The three Kanban columns with their colours */
const COLUMNS = [
  {
    id: "todo",
    label: "To do",
    accent: "#1a73e8",
    chip: "#e8f0fe",
    chipText: "#1a73e8",
    icon: "○",
  },
  {
    id: "inprogress",
    label: "In progress",
    accent: "#f9ab00",
    chip: "#fef7e0",
    chipText: "#b06000",
    icon: "◑",
  },
  {
    id: "done",
    label: "Done",
    accent: "#1e8e3e",
    chip: "#e6f4ea",
    chipText: "#137333",
    icon: "●",
  },
];

/* The four priority levels with their colours */
const PRIORITIES = [
  {
    id: "urgent",
    label: "Urgent",
    bg: "#fce8e6",
    text: "#c5221f",
    dot: "#ea4335",
  },
  { id: "high", label: "High", bg: "#fef7e0", text: "#b06000", dot: "#f9ab00" },
  {
    id: "medium",
    label: "Medium",
    bg: "#e8f0fe",
    text: "#1a73e8",
    dot: "#4285f4",
  },
  { id: "low", label: "Low", bg: "#e6f4ea", text: "#137333", dot: "#34a853" },
];

/* Sample tasks shown the very first time the app loads */
const INITIAL_BOARD = {
  todo: [
    {
      id: "1",
      title: "Redesign onboarding flow",
      description: "Simplify the 5-step flow to 3 steps based on user feedback",
      priority: "high",
    },
    {
      id: "2",
      title: "Accessibility audit",
      description: "Run Lighthouse and fix all critical issues",
      priority: "urgent",
    },
  ],
  inprogress: [
    {
      id: "3",
      title: "Update design system tokens",
      description: "Migrate colour and spacing tokens to Material 3",
      priority: "medium",
    },
  ],
  done: [
    {
      id: "4",
      title: "Q2 planning doc",
      description: "Roadmap shared with stakeholders",
      priority: "low",
    },
  ],
};

/* =======================================================================
   STEP 3 — HELPER FUNCTIONS
   Small utility functions used across multiple components.
======================================================================= */

/*
  generateId()
  Creates a unique string for each new task's id.
  Combines random characters + the current timestamp.
*/
function generateId() {
  return Math.random().toString(36).slice(2) + Date.now().toString(36);
}

/*
  loadBoard()
  Reads the saved board from localStorage.
  If nothing has been saved yet, returns INITIAL_BOARD instead.
  localStorage stores strings, so we use JSON.parse to convert back to an object.
*/
function loadBoard() {
  try {
    const saved = localStorage.getItem("kanban-basic-react");
    return saved ? JSON.parse(saved) : INITIAL_BOARD;
  } catch (e) {
    return INITIAL_BOARD;
  }
}

/*
  saveBoard(board)
  Saves the board object to localStorage so it survives page refreshes.
  JSON.stringify converts the object to a string for storage.
*/
function saveBoard(board) {
  localStorage.setItem("kanban-basic-react", JSON.stringify(board));
}

/* =======================================================================
   STEP 4 — SMALL COMPONENTS
   Each of these is a plain function that returns JSX (HTML-like syntax).
   They are "dumb" components — they just display whatever props they receive.
======================================================================= */

/*
  PriorityBadge({ priorityId })
  Displays a small coloured pill showing the priority level on a card.
  priorityId — one of "urgent", "high", "medium", "low"
*/
function PriorityBadge({ priorityId }) {
  /* Find the priority definition that matches this id */
  const p = PRIORITIES.find(function (x) {
    return x.id === priorityId;
  });

  /* If no matching priority found, render nothing */
  if (!p) return null;

  return (
    <span
      className="priority-badge"
      style={{ background: p.bg, color: p.text }}
    >
      {/* Coloured dot */}
      <span className="pb-dot" style={{ background: p.dot }}></span>
      {p.label}
    </span>
  );
}

/*
  TaskCard({ task, colId, onEdit, onDelete, onDragStart })
  Displays one task card with title, description, priority badge,
  and edit/delete buttons.

  Props:
    task        — the task object { id, title, description, priority }
    colId       — which column this card lives in
    onEdit      — function to call when the edit button is clicked
    onDelete    — function to call when the delete button is clicked
    onDragStart — function to call when dragging starts
*/
function TaskCard({ task, colId, onEdit, onDelete, onDragStart }) {
  /*
    useState for whether this card is being dragged right now.
    dragging  — current value (true or false)
    setDragging — function to update the value
    false — starting value
  */
  const [dragging, setDragging] = useState(false);

  return (
    <div
      className={"task-card" + (dragging ? " dragging" : "")}
      draggable={true}
      onDragStart={function (e) {
        setDragging(true); /* fade the card while dragging */
        onDragStart(task.id, colId); /* tell the parent what's being dragged */
        e.dataTransfer.effectAllowed = "move";
      }}
      onDragEnd={function () {
        setDragging(false); /* restore normal opacity when drag ends */
      }}
    >
      {/* Top row: title + action buttons */}
      <div className="card-top">
        <div className="card-title">{task.title}</div>

        {/* Edit and Delete buttons (visible on hover via CSS) */}
        <div className="card-actions">
          {/* Edit button */}
          <button
            className="icon-btn"
            title="Edit"
            onClick={function () {
              onEdit(task, colId);
            }}
          >
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
              <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
            </svg>
          </button>

          {/* Delete button */}
          <button
            className="icon-btn del"
            title="Delete"
            onClick={function () {
              onDelete(task.id, colId);
            }}
          >
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polyline points="3 6 5 6 21 6" />
              <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
              <path d="M10 11v6" />
              <path d="M14 11v6" />
              <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
            </svg>
          </button>
        </div>
      </div>

      {/* Description (only shown if the task has one) */}
      {task.description && <div className="card-desc">{task.description}</div>}

      {/* Priority badge at the bottom (only shown if priority is set) */}
      {task.priority && (
        <div className="card-footer">
          <PriorityBadge priorityId={task.priority} />
        </div>
      )}
    </div>
  );
}

/*
  Column({ col, tasks, visibleTasks, onAdd, onEdit, onDelete, onDrop, onDragStart })
  Displays one column with its header and all its task cards.

  Props:
    col          — the column definition { id, label, accent, chip, chipText, icon }
    tasks        — ALL tasks in this column (used for the badge count)
    visibleTasks — tasks after search/filter applied (used for actual display)
    onAdd        — function to call when + button is clicked
    onEdit       — passed down to each TaskCard
    onDelete     — passed down to each TaskCard
    onDrop       — function to call when a card is dropped here
    onDragStart  — passed down to each TaskCard
*/
function Column({
  col,
  tasks,
  visibleTasks,
  onAdd,
  onEdit,
  onDelete,
  onDrop,
  onDragStart,
}) {
  /*
    useState to track whether a card is being dragged OVER this column.
    Used to show the highlight border.
  */
  const [isOver, setIsOver] = useState(false);

  /* Badge shows "2/4" when filtering, or just "4" normally */
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
      onDragOver={function (e) {
        e.preventDefault(); /* required to allow dropping */
        setIsOver(true);
      }}
      onDragLeave={function (e) {
        /* Only remove highlight if leaving the column entirely */
        if (!e.currentTarget.contains(e.relatedTarget)) {
          setIsOver(false);
        }
      }}
      onDrop={function (e) {
        e.preventDefault();
        setIsOver(false);
        onDrop(col.id); /* tell the parent a card was dropped here */
      }}
    >
      {/* Column header */}
      <div className="col-header">
        <div className="col-bar"></div>
        <span className="col-label">{col.label}</span>
        <span className="col-badge">{badgeText}</span>
        <button
          className="col-add"
          title="Add task"
          onClick={function () {
            onAdd(col.id);
          }}
        >
          +
        </button>
      </div>

      {/* Column body — cards or empty state */}
      <div className="col-body">
        {/* Empty state: shown when there are no (visible) tasks */}
        {visibleTasks.length === 0 && !isOver && (
          <div className="col-empty">
            <div className="col-empty-icon">{col.icon}</div>
            <span>{tasks.length === 0 ? "No tasks" : "No matches"}</span>
          </div>
        )}

        {/* Render a TaskCard for each visible task */}
        {visibleTasks.map(function (task) {
          return (
            <TaskCard
              key={task.id}
              task={task}
              colId={col.id}
              onEdit={onEdit}
              onDelete={onDelete}
              onDragStart={onDragStart}
            />
          );
        })}

        {/* Dashed drop placeholder shown while dragging over */}
        {isOver && (
          <div className="drop-ph" style={{ "--col-accent": col.accent }}></div>
        )}
      </div>
    </div>
  );
}

/*
  Modal({ mode, form, setForm, onSave, onClose })
  The add/edit task modal dialog.

  Props:
    mode     — "add" or "edit"
    form     — object with the current field values { title, description, priority, colId }
    setForm  — function to update the form object
    onSave   — function to call when Create/Save is clicked
    onClose  — function to call when Cancel or × is clicked
*/
function Modal({ mode, form, setForm, onSave, onClose }) {
  return (
    /* Clicking the dark backdrop closes the modal */
    <div
      className="overlay"
      onClick={function (e) {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="modal">
        {/* Modal header */}
        <div className="modal-head">
          <h2 className="modal-title">
            {mode === "add" ? "New task" : "Edit task"}
          </h2>
          <button className="modal-close" onClick={onClose}>
            ×
          </button>
        </div>

        {/* Title field */}
        <div className="field">
          <label>Title</label>
          <input
            autoFocus
            value={form.title}
            placeholder="Task title"
            onChange={function (e) {
              /* Update just the title inside the form object */
              setForm(function (prev) {
                return { ...prev, title: e.target.value };
              });
            }}
            onKeyDown={function (e) {
              /* Pressing Enter saves the form */
              if (e.key === "Enter") onSave();
            }}
          />
        </div>

        {/* Description field */}
        <div className="field">
          <label>Description (optional)</label>
          <textarea
            value={form.description}
            placeholder="Add a description..."
            onChange={function (e) {
              setForm(function (prev) {
                return { ...prev, description: e.target.value };
              });
            }}
          />
        </div>

        {/* Priority picker */}
        <div className="field">
          <label>Priority</label>
          <div className="priority-picker">
            {PRIORITIES.map(function (p) {
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
                  onClick={function () {
                    setForm(function (prev) {
                      return { ...prev, priority: p.id };
                    });
                  }}
                >
                  <span className="pp-dot"></span>
                  {p.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Column selector */}
        <div className="field">
          <label>Column</label>
          <select
            value={form.colId}
            onChange={function (e) {
              setForm(function (prev) {
                return { ...prev, colId: e.target.value };
              });
            }}
          >
            {COLUMNS.map(function (col) {
              return (
                <option key={col.id} value={col.id}>
                  {col.label}
                </option>
              );
            })}
          </select>
        </div>

        {/* Footer buttons */}
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

/* =======================================================================
   STEP 5 — MAIN APP COMPONENT
   This is the top-level component. It owns ALL the state and
   contains the logic for adding, editing, deleting, and moving tasks.
   It renders the full page and passes functions down to child components.
======================================================================= */
function App() {
  /*
    --- STATE ---
    useState returns [currentValue, setterFunction].
    We call the setter to change the value, which makes React re-render.
  */

  /*
    board — the tasks, organised by column id
    Shape: { todo: [...tasks], inprogress: [...tasks], done: [...tasks] }
  */
  const [board, setBoard] = useState(function () {
    return loadBoard();
  });

  /*
    search — the text currently typed in the search box
  */
  const [search, setSearch] = useState("");

  /*
    filterPriority — which priority filter is active
    "" means "All", otherwise "urgent" / "high" / "medium" / "low"
  */
  const [filterPriority, setFilterPriority] = useState("");

  /*
    modal — describes what the modal is showing right now
    null means the modal is closed.
    When open: { mode, taskId, sourceColId }
  */
  const [modal, setModal] = useState(null);

  /*
    form — the current values of the modal's input fields
  */
  const [form, setForm] = useState({
    title: "",
    description: "",
    priority: "medium",
    colId: "todo",
  });

  /*
    drag — tracks which task is being dragged and where from
    null when nothing is being dragged.
    When dragging: { taskId, srcColId }
  */
  const [drag, setDrag] = useState(null);

  /* =======================================================================
     DERIVED VALUES
     Calculated from state — not stored, just computed when needed.
  ======================================================================= */

  /* Count all tasks across all columns */
  const totalTasks = COLUMNS.reduce(function (sum, col) {
    return sum + (board[col.id] || []).length;
  }, 0);

  /* Count how many tasks are in "done" */
  const doneCount = (board["done"] || []).length;

  /* Calculate % complete (avoid dividing by zero) */
  const donePct =
    totalTasks > 0 ? Math.round((doneCount / totalTasks) * 100) : 0;

  /* =======================================================================
     FILTER FUNCTION
     Returns tasks from a column that match the current search text
     and the selected priority filter.
  ======================================================================= */

  /*
    getVisible(colId)
    Returns the filtered list of tasks to show in a column.
    Used in the render section below.
  */
  function getVisible(colId) {
    const tasks = board[colId] || [];
    const q = search.trim().toLowerCase();

    return tasks.filter(function (task) {
      /* Does the task title or description contain the search text? */
      const matchesSearch =
        !q ||
        task.title.toLowerCase().includes(q) ||
        (task.description || "").toLowerCase().includes(q);

      /* Does the task match the active priority filter? */
      const matchesPriority =
        !filterPriority || task.priority === filterPriority;

      return matchesSearch && matchesPriority;
    });
  }

  /* =======================================================================
     TASK OPERATIONS
     Functions that modify the board and save it to localStorage.
  ======================================================================= */

  /*
    openAddModal(colId)
    Opens the modal in "add" mode, pre-selecting the given column.
  */
  function openAddModal(colId) {
    setForm({ title: "", description: "", priority: "medium", colId: colId });
    setModal({ mode: "add", taskId: null, sourceColId: colId });
  }

  /*
    openEditModal(task, colId)
    Opens the modal in "edit" mode, pre-filling all fields with the task's current values.
  */
  function openEditModal(task, colId) {
    setForm({
      title: task.title,
      description: task.description || "",
      priority: task.priority || "medium",
      colId: colId,
    });
    setModal({ mode: "edit", taskId: task.id, sourceColId: colId });
  }

  /*
    closeModal()
    Closes the modal by setting modal state back to null.
  */
  function closeModal() {
    setModal(null);
  }

  /*
    saveTask()
    Reads the current form values and either creates a new task
    or updates an existing one, then closes the modal.
  */
  function saveTask() {
    /* Don't save if the title is empty */
    if (!form.title.trim()) return;

    /* Make a copy of the board so we don't mutate state directly */
    const newBoard = {
      todo: [...(board.todo || [])],
      inprogress: [...(board.inprogress || [])],
      done: [...(board.done || [])],
    };

    if (modal.mode === "add") {
      /* Create a new task object and push it into the chosen column */
      const newTask = {
        id: generateId(),
        title: form.title.trim(),
        description: form.description.trim(),
        priority: form.priority,
      };
      newBoard[form.colId].push(newTask);
    } else {
      /* Edit mode — find the task and update it */
      const srcCol = modal.sourceColId;
      const dstCol = form.colId;

      /* Find the task's position in its current column */
      const idx = newBoard[srcCol].findIndex(function (t) {
        return t.id === modal.taskId;
      });
      if (idx === -1) return;

      /* Create the updated version of the task */
      const updated = Object.assign({}, newBoard[srcCol][idx], {
        title: form.title.trim(),
        description: form.description.trim(),
        priority: form.priority,
      });

      if (srcCol === dstCol) {
        /* Same column — update in place */
        newBoard[srcCol][idx] = updated;
      } else {
        /* Different column — remove from source, add to destination */
        newBoard[srcCol].splice(idx, 1);
        newBoard[dstCol].push(updated);
      }
    }

    saveBoard(newBoard);
    setBoard(newBoard);
    closeModal();
  }

  /*
    deleteTask(taskId, colId)
    Removes a task from a column by filtering it out.
  */
  function deleteTask(taskId, colId) {
    const newBoard = Object.assign({}, board);
    newBoard[colId] = board[colId].filter(function (t) {
      return t.id !== taskId;
    });
    saveBoard(newBoard);
    setBoard(newBoard);
  }

  /*
    handleDragStart(taskId, srcColId)
    Called when a card starts being dragged.
    Stores what is being dragged in state.
  */
  function handleDragStart(taskId, srcColId) {
    setDrag({ taskId: taskId, srcColId: srcColId });
  }

  /*
    handleDrop(dstColId)
    Called when a card is dropped onto a column.
    Moves the task from its source column to the destination column.
  */
  function handleDrop(dstColId) {
    /* If nothing is being dragged, or dropped in same column, do nothing */
    if (!drag || drag.srcColId === dstColId) {
      setDrag(null);
      return;
    }

    const newBoard = Object.assign({}, board);

    /* Find and remove the task from its source column */
    const idx = newBoard[drag.srcColId].findIndex(function (t) {
      return t.id === drag.taskId;
    });
    if (idx === -1) {
      setDrag(null);
      return;
    }

    const task = newBoard[drag.srcColId].splice(idx, 1)[0];

    /* Add it to the destination column */
    newBoard[dstColId] = [...(newBoard[dstColId] || []), task];

    saveBoard(newBoard);
    setBoard(newBoard);
    setDrag(null);
  }

  /* =======================================================================
     RENDER — what the App component displays
     This JSX describes the full page structure.
  ======================================================================= */
  return (
    <div className="app">
      {/* ---- HEADER ---- */}
      <header className="header">
        <div className="header-left">
          {/* GDG logo */}
          <svg
            className="gdg-logo"
            viewBox="0 -65.5 256 256"
            xmlns="http://www.w3.org/2000/svg"
            preserveAspectRatio="xMidYMid"
          >
            <g>
              <path
                d="M184.31481,67.7044587 C197.78381,59.9684587 211.21681,52.1694587 224.73181,44.5134587 C237.55981,37.2454587 252.65281,43.9484587 255.56081,58.0924587 C257.24381,66.2744587 253.59081,75.1134587 246.20381,79.4184587 C221.98581,93.5314587 197.73281,107.588459 173.35881,121.430459 C165.81481,125.714459 158.04381,124.926459 151.16881,119.676459 C144.18481,114.346459 141.98381,106.994459 143.62181,98.4374587 C145.49181,91.9234587 149.77181,87.5684587 155.60881,84.3104587 C165.25981,78.9244587 174.75381,73.2544587 184.31481,67.7044587"
                fill="#FABC05"
              ></path>
              <path
                d="M194.20341,62.0789587 C180.76841,54.2829587 167.29941,46.5479587 153.91141,38.6729587 C141.20241,31.1969587 139.46241,14.7749587 150.25641,5.18295871 C156.50041,-0.364041286 165.98141,-1.62104129 173.40341,2.62395871 C197.73541,16.5409587 222.03541,30.5169587 246.20941,44.7039587 C253.69141,49.0949587 256.89341,56.2199587 255.78641,64.7989587 C254.66141,73.5109587 249.39541,79.0929587 241.16641,81.9539587 C234.58941,83.5919587 228.67841,82.0619587 222.93841,78.6359587 C213.44741,72.9709587 203.79041,67.5829587 194.20341,62.0789587"
                fill="#109D58"
              ></path>
              <path
                d="M71.7518102,56.5628587 C63.1308102,61.4608587 54.5048102,66.3498587 45.8928102,71.2628587 C40.8548102,74.1368587 35.8728102,77.1088587 30.8088102,79.9348587 C20.6058102,85.6298587 8.48381017,82.2918587 2.69881017,72.2608587 C-2.82218983,62.6888587 0.35081017,50.2788587 10.1768102,44.5428587 C34.2018102,30.5198587 58.2888102,16.5988587 82.4628102,2.83385871 C89.8768102,-1.38814129 97.5688102,-0.857141286 104.42481,4.18985871 C111.66081,9.51685871 114.02981,17.0128587 112.40481,25.8008587 C111.39681,27.9268587 110.79481,30.4198587 109.28581,32.0948587 C106.83081,34.8198587 104.04081,37.4288587 100.93481,39.3448587 C91.3228102,45.2718587 81.4958102,50.8498587 71.7518102,56.5628587"
                fill="#E94436"
              ></path>
              <path
                d="M61.8670102,62.0569587 C70.4200102,67.0729587 78.9670102,72.0999587 87.5280102,77.1019587 C92.5350102,80.0279587 97.6000102,82.8569587 102.57901,85.8279587 C112.61301,91.8179587 115.78401,103.983959 109.98901,114.008959 C104.45901,123.576959 92.1260102,127.034959 82.2450102,121.391959 C58.0880102,107.596959 33.9890102,93.6989587 9.98101017,79.6459587 C2.61801017,75.3359587 -0.76798983,68.4089587 0.17501017,59.9479587 C1.17001017,51.0169587 6.47701017,45.2179587 14.9000102,42.2309587 C17.2450102,42.0419587 19.7050102,41.3159587 21.9110102,41.7859587 C25.4980102,42.5499587 29.1530102,43.6609587 32.3650102,45.3929587 C42.3040102,50.7529587 52.0480102,56.4749587 61.8670102,62.0569587"
                fill="#4385F3"
              ></path>
            </g>
          </svg>
          <span className="wordmark-suffix">FlowBoard by Amogh</span>
        </div>
        <div className="header-right">
          <button
            className="btn-filled"
            onClick={function () {
              openAddModal("todo");
            }}
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
            >
              <line x1="12" y1="5" x2="12" y2="19" />
              <line x1="5" y1="12" x2="19" y2="12" />
            </svg>
            New task
          </button>
        </div>
      </header>

      {/* ---- STATS STRIP ---- */}
      <div className="stats-strip">
        {/* One pill per column showing its task count */}
        {COLUMNS.map(function (col) {
          return (
            <div
              key={col.id}
              className="stat-pill"
              style={{ background: col.chip, color: col.chipText }}
            >
              <div
                className="stat-dot"
                style={{ background: col.accent }}
              ></div>
              {(board[col.id] || []).length} {col.label}
            </div>
          );
        })}

        {/* Progress bar on the right */}
        <div className="progress-wrap">
          <span>{donePct}% complete</span>
          <div className="progress-track">
            <div
              className="progress-fill"
              style={{ width: donePct + "%" }}
            ></div>
          </div>
        </div>
      </div>

      {/* ---- FILTER BAR ---- */}
      <div className="filter-bar">
        {/* Search box */}
        <div className="search-wrap">
          <svg
            className="search-icon"
            width="15"
            height="15"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          >
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <input
            className="search-input"
            type="text"
            placeholder="Search tasks..."
            value={search}
            onChange={function (e) {
              setSearch(e.target.value);
            }}
          />
          {/* × clear button — only shown when there is text */}
          {search && (
            <button
              className="search-clear"
              onClick={function () {
                setSearch("");
              }}
            >
              ×
            </button>
          )}
        </div>

        {/* Priority filter buttons */}
        <div className="priority-filters">
          {/* "All" button */}
          <button
            className={"pf-btn" + (filterPriority === "" ? " all-active" : "")}
            onClick={function () {
              setFilterPriority("");
            }}
          >
            All
          </button>

          {/* One button per priority level */}
          {PRIORITIES.map(function (p) {
            const isActive = filterPriority === p.id;
            return (
              <button
                key={p.id}
                className={"pf-btn" + (isActive ? " active" : "")}
                style={
                  isActive
                    ? {
                        "--pf-bg": p.bg,
                        "--pf-text": p.text,
                        "--pf-dot": p.dot,
                      }
                    : {}
                }
                onClick={function () {
                  /* Clicking the same filter again turns it off */
                  setFilterPriority(filterPriority === p.id ? "" : p.id);
                }}
              >
                <span className="pf-dot" style={{ background: p.dot }}></span>
                {p.label}
              </button>
            );
          })}
        </div>

        {/* Social media links */}
        <div className="social-links">
          <a
            href="https://www.linkedin.com/in/amogh-teli-649282349/"
            target="_blank"
            rel="noopener noreferrer"
            className="social-link linkedin"
            title="LinkedIn"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.225 0z" />
            </svg>
          </a>
          <a
            href="https://github.com/teliamogh7578"
            target="_blank"
            rel="noopener noreferrer"
            className="social-link github"
            title="GitHub"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v 3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
            </svg>
          </a>
        </div>
      </div>

      {/* ---- BOARD ---- */}
      <div className="board-wrap">
        <div className="board">
          {COLUMNS.map(function (col) {
            return (
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
            );
          })}
        </div>
      </div>

      {/* ---- MODAL (only rendered when modal state is not null) ---- */}
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

/* =======================================================================
   STEP 6 — MOUNT THE APP
   Tell ReactDOM to render our App component inside the #root div
   that is in index.html.
   This is the one line that starts everything.
======================================================================= */
const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<App />);
