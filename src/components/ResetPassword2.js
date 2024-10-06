import React, { useState } from "react";
import { Form, Button, Row, Col } from "react-bootstrap";
import backgroundImage from "../image/slider-bg.jpg"; // Replace with your background image path

export default function ResetPassword2() {
    const [email, setEmail] = useState("");
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");

    const handleEmailChange = (e) => {
        setEmail(e.target.value);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch("YOUR_API_ENDPOINT", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ email }),
            });

            if (response.ok) {
                const data = await response.json();
                setMessage(data.message || "Password reset instructions have been sent to your email.");
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

    const handleCancel = () => {
        setEmail("");
        setMessage("");
        setError("");
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
        width: "100%", // Ensures the button takes full width of the form
        fontSize: "20px", // Button text size
        textAlign: "center",
    };

    return (
        <div style={backgroundStyle}>
            <div style={formStyle}>
                <Form onSubmit={handleSubmit}>
                    <Form.Group className="mb-3" controlId="formBasicEmail" style={{ textAlign: "center" }}>
                        <h3>Forget Password</h3>
                    </Form.Group>

                    <Form.Group className="mb-3" controlId="formBasicEmail">
                        <Form.Text className="text-muted">
                            Enter the email you used to sign up and we'll send you a link to reset your password
                        </Form.Text>
                        <Form.Label>Email</Form.Label>
                        <Form.Control
                            type="email"
                            placeholder="Enter your email"
                            value={email}
                            onChange={handleEmailChange}
                            required
                        />
                    </Form.Group>

                    {message && <div className="alert alert-success">{message}</div>}
                    {error && <div className="alert alert-danger">{error}</div>}

                    <Form.Group as={Row} style={buttonStyle}>
                        <Col>
                            <Button variant="primary" type="submit" size="lg" style={{ padding: "10px 100px" }}>
                                Continue
                            </Button>
                        </Col>
                        <Col>
                            <Button
                                variant="secondary"
                                size="lg"
                                style={{ padding: "10px 100px" }}
                                onClick={handleCancel}
                            >
                                Cancel
                            </Button>
                        </Col>
                    </Form.Group>
                </Form>
            </div>
        </div>
    );
}
