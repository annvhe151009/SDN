import React, { useState } from "react";
import { Form, Button, Row, Col, Alert } from "react-bootstrap";
import backgroundImage from "../image/slider-bg.jpg";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

const backgroundStyle = {
  backgroundImage: `url(${backgroundImage})`,
  backgroundSize: "cover",
  backgroundPosition: "center",
  height: "100vh",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
};

const formStyle = {
  marginTop: "90px",
  backgroundColor: "rgba(255, 255, 255, 0.8)",
  padding: "50px",
  borderRadius: "10px",
};

const buttonStyle = {
  width: "100%",
  fontSize: "20px",
  textAlign: "center",
  marginTop: "12px",
};

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleUsernameChange = (e) => {
    setUsername(e.target.value);
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const handleLogin = (e) => {
    e.preventDefault();
    const user = {
      username: username,
      password: password,
    };
    axios
      .get("http://localhost:9999/user")
      .then((res) => {
        const userData = res.data;
        const foundUser = userData.find(
          (item) => item.username === username && item.password === password
        );
        if (foundUser) {
          localStorage.setItem("user", JSON.stringify(foundUser));
          if (foundUser.role === "ADMIN") {
            // Nếu là admin, chuyển hướng đến trang admin
            window.location.href = "http://localhost:3000/admin";
          } else {
            // Nếu là user thông thường, chuyển hướng đến trang chủ
            window.location.href = "/";
          }
        } else {
          setMessage("Invalid username or password. Please try again.");
        }
      })
      .catch((error) => console.error(error));
  };

  return (
    <div style={backgroundStyle}>
      <div style={formStyle}>
        <Form onSubmit={handleLogin}>
          <Form.Group className="mb-3" controlId="formBasicEmail">
            <h3 style={{ textAlign: "center" }}>Login</h3>
          </Form.Group>
          {message && <Alert variant="danger">{message}</Alert>}
          <Form.Group className="mb-3" controlId="formBasicEmail">
            <Form.Label>Username</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter username"
              value={username}
              onChange={handleUsernameChange}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="formBasicPassword">
            <Form.Label>Password</Form.Label>
            <Form.Control
              type="password"
              placeholder="Password"
              value={password}
              onChange={handlePasswordChange}
              required
            />
          </Form.Group>

          <Form.Group as={Row} className="mb-3">
            <Col sm={{ span: 5 }}>
              <Form.Check type="checkbox" label="Remember me" />
            </Col>
            <Col sm={{ span: 4 }}>
              <Link to={`/resetpassword`}>Forget Password?</Link>
            </Col>
            <Col sm={{ span: 5 }}>
            </Col>
          </Form.Group>

          <Form.Group style={buttonStyle}>
            <Button variant="danger" type="submit" size="md">
              Login
            </Button>
          </Form.Group>
        </Form>
      </div>
    </div>
  );
}
