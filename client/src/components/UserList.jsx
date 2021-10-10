import { useEffect, useState } from "react";
import { getAllUsers } from "../services/user.service";

function UserList(props) {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    getAllUsers().then((users) => {
      setUsers(users);
    });
  }, []);

  return (
    <div>
      <h1>User List</h1>
      <hr />

      <ul className="list-group">
        {users.map((user) => (
          <li key={user.id} className="list-group-item">
            {user.firstName}
          </li>
        ))}
      </ul>
    </div>
  );
}

export { UserList };
