export const COLUMNS = [
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

/* the four priority labels with their colours: */
export const PRIORITIES = [
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

// Sample tasks shown the very first time the app loads
// hmm can try to implement this if time: pull from API or something instead of hardcoding.
export const INITIAL_BOARD = {
  todo: [
    {
      id: "1",
      title: "Write project README",
      description:
        "Add installation instructions, screenshots, and deployment link to the repository",
      priority: "high",
    },
    {
      id: "2",
      title: "Improve mobile responsiveness",
      description:
        "Ensure the Kanban board layout works smoothly on smaller screens",
      priority: "medium",
    },
  ],

  inprogress: [
    {
      id: "3",
      title: "Implement drag and drop interaction",
      description:
        "Allow tasks to move between Todo, In Progress, and Done columns",
      priority: "urgent",
    },
  ],

  done: [
    {
      id: "4",
      title: "Setup React + Vite project",
      description:
        "Initialize project structure and configure the development environment",
      priority: "low",
    },
  ],
};

// create a roughly unique id string
export function generateId() {
  return Math.random().toString(36).slice(2) + Date.now().toString(36);
}

export function loadBoard() {
  try {
    const saved = localStorage.getItem("kanban-basic-react");
    return saved ? JSON.parse(saved) : INITIAL_BOARD;
  } catch (e) {
    return INITIAL_BOARD;
  }
}

export function saveBoard(board) {
  localStorage.setItem("kanban-basic-react", JSON.stringify(board));
}
