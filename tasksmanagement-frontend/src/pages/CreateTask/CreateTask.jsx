import { useEffect, useState } from "react";
import "./CreateTask.css";

function CreateTask() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [users, setUsers] = useState([]);
  const [userId, setUserId] = useState("");

  const [errors, setErrors] = useState({});

  useEffect(() => {
    fetch("http://localhost:8080/api/users", {
      headers: {
        Authorization: "Bearer " + localStorage.getItem("token")
      }
    })
      .then(res => res.json())
      .then(data => setUsers(data))
      .catch(() => console.log("Failed to fetch users"));
  }, []);

  const validate = () => {
    let newErrors = {};

    if (!title.trim()) newErrors.title = "Title is required";
    if (!description.trim()) newErrors.description = "Description is required";
    if (!userId) newErrors.user = "Please assign a user";

    return newErrors;
  };

  const createTask = () => {
    const validationErrors = validate();
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) return;

    fetch("http://localhost:8080/api/tasks", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("token") 
      },
      body: JSON.stringify({
        title,
        description,
        assignedTo: { id: userId }
      })
    })
      .then(res => {
        if (res.ok) {
          alert("Task Created Successfully");
          setTitle("");
          setDescription("");
          setUserId("");
          setErrors({});
        } else {
          alert("Failed to create task");
        }
      })
      .catch(() => alert("Server error"));
  };

  return (
    <div className="create">
      <div className="create-card">
        <h2>Create Task</h2>

        <input
          placeholder="Enter title"
          value={title}
          onChange={e => setTitle(e.target.value)}
        />
        {errors.title && <p className="error">{errors.title}</p>}

        <input
          placeholder="Enter description"
          value={description}
          onChange={e => setDescription(e.target.value)}
        />
        {errors.description && <p className="error">{errors.description}</p>}

        <select
          value={userId}
          onChange={e => setUserId(e.target.value)}
        >
          <option value="">Assign to User</option>

        
          {users
            .filter(u => u.role === "USER")
            .map(u => (
              <option key={u.id} value={u.id}>
                {u.name}
              </option>
            ))}
        </select>

        {errors.user && <p className="error">{errors.user}</p>}

        <button onClick={createTask}>Create</button>
      </div>
    </div>
  );
}

export default CreateTask;