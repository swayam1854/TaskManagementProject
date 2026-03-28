import { useEffect, useState } from "react";
import "./Users.css";

function Users() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    fetch("http://localhost:8080/api/users")
      .then(res => res.json())
      .then(data => setUsers(data));
  }, []);

  return (
    <div className="users-container">
      <h2>Users</h2>

      <div className="users-grid">
        {users.map(user => (
          <div className="user-card" key={user.id}>
            <p><strong>Name:</strong> {user.name}</p>
            <p><strong>Email:</strong> {user.email}</p>
            <p>
              <strong>Role:</strong>{" "}
              <span className={`role ${user.role}`}>
                {user.role}
              </span>
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Users;