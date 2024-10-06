import React, { useState, useEffect } from "react";
import { Table, Form, Alert, Pagination } from "react-bootstrap";
import axios from "axios";

const UserDetail = () => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [usersPerPage] = useState(5);

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    // Filter users based on search term
    const filteredData = users.filter(
      (user) =>
        user.fullname &&
        user.fullname.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredUsers(filteredData);
  }, [searchTerm, users]);

  const fetchData = async () => {
    try {
      const response = await axios.get("http://localhost:9999/user");
      setUsers(response.data);
      setFilteredUsers(response.data); // Initially set filtered users to all users
    } catch (error) {
      setError("Error fetching data");
      console.error("Error fetching data:", error);
    }
  };

  // Pagination
  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleDelete = async (userId) => {
    try {
      await axios.delete(`http://localhost:9999/user/${userId}`);
      // Refresh data after deletion
      fetchData();
    } catch (error) {
      console.error("Error deleting user:", error);
    }
  };

  return (
    <div>
      <h3>User Detail</h3>
      <Form.Group controlId="formBasicSearch">
        <Form.Control
          type="text"
          placeholder="Search by name"
          value={searchTerm}
          onChange={handleSearch}
        />
      </Form.Group>
      {error && <Alert variant="danger">{error}</Alert>}
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>ID</th>
            <th>Username</th>
            <th>Email</th>
            <th>Phone number</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id}>
              <td>{user.id}</td>
              <td>{user.username}</td>
              <td>{user.email}</td>
              <td>{user.phonenumber}</td>
              <td>
                <button>Edit</button>
                <button onClick={() => handleDelete(user.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
      <Pagination>
        {Array.from({ length: Math.ceil(filteredUsers.length / usersPerPage) }).map((_, index) => (
          <Pagination.Item key={index} active={index + 1 === currentPage} onClick={() => paginate(index + 1)}>
            {index + 1}
          </Pagination.Item>
        ))}
      </Pagination>
    </div>
  );
};

export default UserDetail;
