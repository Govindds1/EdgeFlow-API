# EdgeFlow API & Graph Processor 
**SRM Full Stack Engineering Challenge Submission**

A high-performance, developer-centric tool for processing hierarchical graph data structures. This project features a robust Next.js API backend and a sleek, macOS-inspired dashboard for real-time visualization and testing.

---

## 🔗 Live Links
- **Frontend Dashboard:** [https://bajaj-govind-rajs-projects.vercel.app](https://bajaj-govind-rajs-projects.vercel.app)
- **API Base URL:** `https://bajaj-govind-rajs-projects.vercel.app/api`
- **Active Endpoint:** `POST /api/bfhl`

---

##  Features

###  Intelligent Graph Engine
- **O(N) Complexity:** Efficient single-pass traversal to construct tree hierarchies.
- **Cycle Detection:** Automatically identifies and marks pure cycles (e.g., A→B, B→A) to prevent infinite loops.
- **The Diamond Rule:** Intelligently handles multi-parent nodes by prioritizing the first-encountered edge and discarding subsequent conflicting parents.
- **Lexicographical Tie-breaking:** In the event of equal tree depths, the system deterministically selects the root that comes first alphabetically.

### 💻 macOS-Themed Dashboard
- **Real-time API Tester:** Interactive JSON input area with instant visual feedback.
- **Structured Output:** Beautifully rendered hierarchy cards showing depth, cycle status, and JSON tree previews.
- **Data Validation:** Dedicated sections for tracking duplicate edges and invalid entries (self-loops, numeric nodes, etc.).

---

## 🛠️ Tech Stack
- **Framework:** [Next.js 14](https://nextjs.org/) (App Router)
- **Styling:** [Tailwind CSS](https://tailwindcss.com/)
- **Icons:** [Lucide React](https://lucide.dev/)
- **Deployment:** [Vercel](https://vercel.com/)
- **Language:** TypeScript / JavaScript (ES6+)

---

## 🛰️ API Documentation

### POST `/api/bfhl`
Processes an array of directed edges and returns the structured graph data.

**Request Body:**
```json
[
  "A->B",
  "A->C",
  "B->D"
]
