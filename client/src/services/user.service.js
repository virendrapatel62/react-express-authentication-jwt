import { axios } from "./axios";

function getAllUsers() {
  return axios
    .get("/api/users")
    .then((response) => response && response.data && response.data.users);
}

export { getAllUsers };
