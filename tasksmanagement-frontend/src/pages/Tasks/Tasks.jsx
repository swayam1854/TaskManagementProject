import { useEffect, useState } from "react";
import "./Tasks.css";

function Tasks() {
  const [tasks, setTasks] = useState([]);
  const [status, setStatus] = useState("");
  const [users, setUsers] = useState([]);
  const [userId, setUserId] = useState("");

  const [editId, setEditId] = useState(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [assignedUser, setAssignedUser] = useState("");

  const token = localStorage.getItem("token");
  const role = JSON.parse(atob(token.split(".")[1])).role;

  useEffect(() => {
    fetchTasks();
    fetchUsers();
  }, []);

  const fetchUsers = () => {
    fetch("http://localhost:8080/api/users", {
      headers: {
        Authorization: "Bearer " + token
      }
    })
      .then(res => res.json())
      .then(data => setUsers(data));
  };

  const fetchTasks = () => {
    let url = "http://localhost:8080/api/tasks";

    if (status && userId) {
      url += `?status=${status}&assignedTo=${userId}`;
    } else if (status) {
      url += `?status=${status}`;
    } else if (userId) {
      url += `?assignedTo=${userId}`;
    }

    fetch(url, {
      headers: {
        Authorization: "Bearer " + token
      }
    })
      .then(res => res.json())
      .then(data => setTasks(data));
  };

  const updateStatus = (id, newStatus) => {
    fetch(`http://localhost:8080/api/tasks/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token
      },
      body: JSON.stringify({ status: newStatus })
    }).then(fetchTasks);
  };

  const deleteTask = (id) => {
    fetch(`http://localhost:8080/api/tasks/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: "Bearer " + token
      }
    }).then(fetchTasks);
  };

  const startEdit = (task) => {
    setEditId(task.id);
    setTitle(task.title);
    setDescription(task.description);
    setAssignedUser(task.assignedTo?.id || "");
  };

  const saveEdit = () => {
    fetch(`http://localhost:8080/api/tasks/${editId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token
      },
      body: JSON.stringify({
        title,
        description,
        assignedTo: { id: assignedUser }
      })
    }).then(() => {
      setEditId(null);
      fetchTasks();
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

  return (
    <div className="tasks">
      <h2>Tasks</h2>

      
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

      {tasks.length === 0 ? (
        <p>No tasks available</p>
      ) : (
        tasks.map(task => (
          <div key={task.id} className="task-card">

            {editId === task.id ? (
              <>
                <input value={title} onChange={(e) => setTitle(e.target.value)} />
                <input value={description} onChange={(e) => setDescription(e.target.value)} />

                <select value={assignedUser} onChange={(e) => setAssignedUser(e.target.value)}>
                  <option value="">Assign User</option>
                  {users.map(u => (
                    <option key={u.id} value={u.id}>{u.name}</option>
                  ))}
                </select>

                <button onClick={saveEdit}>Save</button>
                <button onClick={() => setEditId(null)}>Cancel</button>
              </>
            ) : (
              <>
                <h3><b>Title:</b> {task.title}</h3>
                <p><b>Description:</b> {task.description || "None"}</p>

                <p>
                  <b>Status:</b>
                  <span className={getStatusClass(task.status)}>
                    {formatStatus(task.status)}
                  </span>
                </p>

                <p><b>Assigned To:</b> {task.assignedTo?.name}</p>

                <div className="actions">
                  <button className="btn todo" onClick={() => updateStatus(task.id, "TODO")}>To Do</button>
                  <button className="btn progress" onClick={() => updateStatus(task.id, "IN_PROGRESS")}>In Progress</button>
                  <button className="btn done" onClick={() => updateStatus(task.id, "DONE")}>Done</button>

                  {role === "ADMIN" && (
                    <>
                      <button className="btn edit" onClick={() => startEdit(task)}>Edit</button>
                      <button className="btn delete" onClick={() => deleteTask(task.id)}>Delete</button>
                    </>
                  )}
                </div>
              </>
            )}
          </div>
        ))
      )}
    </div>
  );
}

export default Tasks;