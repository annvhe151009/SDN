import React, { useState } from "react";
import { Form, Button } from "react-bootstrap";
import backgroundImage from "../image/slider-bg.jpg"; // Path to background image
import { Link } from "react-router-dom";

export default function ResetPassword() {
    const [username, setUsername] = useState("");
    const [passwordNew, setPasswordNew] = useState("");
    const [passwordConfirm, setPasswordConfirm] = useState("");
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");

    const handleUsernameChange = (e) => {
        setUsername(e.target.value);
    };

    const handlePasswordNewChange = (e) => {
        setPasswordNew(e.target.value);
    };

    const handlePasswordConfirmChange = (e) => {
        setPasswordConfirm(e.target.value);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Username validation
        if (!username) {
            setError("Username is required.");
            setMessage("");
            return;
        }

        // Password validation
        if (!passwordNew || !passwordConfirm) {
            setError("Please enter both new password and confirm password.");
            setMessage("");
            return;
        }

        if (passwordNew !== passwordConfirm) {
            setError("Passwords do not match.");
            setMessage("");
            return;
        }

        if (passwordNew.length < 8 || !/\d/.test(passwordNew)) {
            setError("Password must be at least 8 characters long and contain at least one number.");
            setMessage("");
            return;
        }

        try {
            const response = await fetch("YOUR_API_ENDPOINT", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ username, password: passwordNew }),
            });

            if (response.ok) {
                const data = await response.json();
                setMessage(data.message || "Password has been successfully reset.");
                setError("");
            } else {
                const errorData = await response.json();
                setError(errorData.error || "Something went wrong. Please try again.");
                setMessage("");
            }
        } catch (err) {
            setError("Network error. Please try again.");
            setMessage("");
        }
    };

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
        backgroundColor: "rgba(255, 255, 255, 0.8)",
        padding: "60px",
        borderRadius: "10px",
    };

    const buttonStyle = {
        width: "100%",
        fontSize: "20px",
        textAlign: "center",
    };

    return (
        <div style={backgroundStyle}>
            <div style={formStyle}>
                <Form onSubmit={handleSubmit}>
                    <Form.Group className="mb-3" controlId="formBasicEmail" style={{ textAlign: "center" }}>
                        <h3>Enter New Password</h3>
                    </Form.Group>

                    <Form.Group className="mb-3" controlId="formBasicUsername">
                        <Form.Label>Username</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="Enter your username"
                            value={username}
                            onChange={handleUsernameChange}
                            required
                        />
                    </Form.Group>

                    <Form.Group className="mb-3" controlId="formBasicPasswordNew">
                        <Form.Label>New Password</Form.Label>
                        <Form.Control
                            type="password"
                            placeholder="New Password"
                            value={passwordNew}
                            onChange={handlePasswordNewChange}
                            required
                        />
                    </Form.Group>

                    <Form.Group className="mb-3" controlId="formBasicPasswordConfirm">
                        <Form.Label>Confirm Password</Form.Label>
                        <Form.Control
                            type="password"
                            placeholder="Confirm Password"
                            value={passwordConfirm}
                            onChange={handlePasswordConfirmChange}
                            required
                        />
                    </Form.Group>

                    {message && <div className="alert alert-success">{message}</div>}
                    {error && <div className="alert alert-danger">{error}</div>}

                    <Form.Group style={buttonStyle}>
                        <Button variant="primary" type="submit" size="lg" style={{ padding: "10px 100px" }}>
                            Continue
                        </Button>

                    </Form.Group>
                    <Link to="/login">Back to Login</Link>

                </Form>
            </div>
        </div>
    );
}
