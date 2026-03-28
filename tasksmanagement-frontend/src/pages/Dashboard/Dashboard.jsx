import { useEffect, useState } from "react";
import "./Dashboard.css";
import { PieChart, Pie, Cell, Tooltip, Legend } from "recharts";

function Dashboard() {
  const [tasks, setTasks] = useState([]);
  const [status, setStatus] = useState("");
  const [users, setUsers] = useState([]);
  const [userId, setUserId] = useState("");
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem("token");
  const role = JSON.parse(atob(token.split(".")[1])).role;

  useEffect(() => {
    fetchTasks();
    fetchUsers();
  }, []);

  const fetchUsers = () => {
    fetch("http://localhost:8080/api/users", {
      headers: { Authorization: "Bearer " + token }
    })
      .then(res => res.json())
      .then(data => setUsers(data));
  };

  const fetchTasks = () => {
    setLoading(true);

    let url = "http://localhost:8080/api/tasks";

    if (status && userId) {
      url += `?status=${status}&assignedTo=${userId}`;
    } else if (status) {
      url += `?status=${status}`;
    } else if (userId) {
      url += `?assignedTo=${userId}`;
    }

    fetch(url, {
      headers: { Authorization: "Bearer " + token }
    })
      .then(res => res.json())
      .then(data => {
        setTasks(Array.isArray(data) ? data : []);
        setLoading(false);
      });
  };

  const formatStatus = (status) => {
    if (status === "TODO") return "To Do";
    if (status === "IN_PROGRESS") return "In Progress";
    if (status === "DONE") return "Done";
    return status;
  };

  const getStatusClass = (status) => {
    if (status === "TODO") return "badge todo";
    if (status === "IN_PROGRESS") return "badge progress";
    if (status === "DONE") return "badge done";
    return "badge";
  };

  const todoCount = tasks.filter(t => t.status === "TODO").length;
  const progressCount = tasks.filter(t => t.status === "IN_PROGRESS").length;
  const doneCount = tasks.filter(t => t.status === "DONE").length;

  const chartData = [
    { name: "To Do", value: todoCount },
    { name: "In Progress", value: progressCount },
    { name: "Done", value: doneCount }
  ];

  const COLORS = ["#facc15", "#38bdf8", "#22c55e"];

  return (
    <div className="dashboard dark-theme">

      <h2 className="title">Dashboard</h2>

    
      <div className="summary">
        <div className="summary-card todo">
          <h3>{todoCount}</h3>
          <p>To Do</p>
        </div>

        <div className="summary-card progress">
          <h3>{progressCount}</h3>
          <p>In Progress</p>
        </div>

        <div className="summary-card done">
          <h3>{doneCount}</h3>
          <p>Completed</p>
        </div>
      </div>

    
      <div className="chart-section">
        <div className="chart-container">
          <h3>Task Distribution</h3>

          <PieChart width={420} height={320}>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              outerRadius={110}
              innerRadius={60}
              paddingAngle={4}
              dataKey="value"
              label={({ percent }) =>
                `${(percent * 100).toFixed(0)}%`
              }
            >
              {chartData.map((entry, index) => (
                <Cell key={index} fill={COLORS[index]} />
              ))}
            </Pie>

            <Tooltip />
            <Legend />
          </PieChart>
        </div>
      </div>

     
      {role === "ADMIN" && (
        <div className="filters">
          <select onChange={(e) => setStatus(e.target.value)}>
            <option value="">All Status</option>
            <option value="TODO">To Do</option>
            <option value="IN_PROGRESS">In Progress</option>
            <option value="DONE">Done</option>
          </select>

          <select onChange={(e) => setUserId(e.target.value)}>
            <option value="">All Users</option>
            {users.map(u => (
              <option key={u.id} value={u.id}>{u.name}</option>
            ))}
          </select>

          <button onClick={fetchTasks}>Apply Filters</button>
        </div>
      )}

   
      {loading ? (
        <div className="loader"></div>
      ) : tasks.length === 0 ? (
        <p className="no-tasks">No tasks available</p>
      ) : (
        <div className="task-grid">
          {tasks.map(task => (
            <div key={task.id} className="card">
              <h3><b>Title:</b> {task.title}</h3>
              <p><b>Description:</b> {task.description || "None"}</p>

              <p>
                <b>Status:</b>
                <span className={getStatusClass(task.status)}>
                  {formatStatus(task.status)}
                </span>
              </p>

              <p><b>Assigned To:</b> {task.assignedTo?.name}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Dashboard;