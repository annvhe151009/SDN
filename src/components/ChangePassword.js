import React, { useState, useEffect } from "react";
import { Container, Row, Col, Button, Form } from "react-bootstrap";
import { Link, useParams, useNavigate } from "react-router-dom";
import axios from 'axios'
import { toast } from 'react-toastify';

export default function ChangePassword() {
    const navigate = useNavigate();
    const { id } = JSON.parse(localStorage.getItem("user"));
    const [userData, setUserData] = useState(null);
    const [oldPassword, setOldPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmNewPassword, setConfirmNewPassword] = useState("");
    const [showOldPassword, setShowOldPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [messageOldPassword, setMessageOldPassword] = useState('');
    const [messageNewPassword, setMessageNewPassword] = useState('');
    const [messageConfirmPassword, setMessageConfirmPassword] = useState('');

    function setCursor(value) {
        document.body.style.cursor = value;
    }
    // Hàm kiểm tra độ mạnh của mật khẩu
    function isStrongPassword(password) {
        // Kiểm tra chiều dài của mật khẩu (ít nhất 8 ký tự)
        if (password.length < 8) {
            return false;
        }

        // Kiểm tra xem mật khẩu có ít nhất một chữ hoa
        if (!/[A-Z]/.test(password)) {
            return false;
        }

        // Kiểm tra xem mật khẩu có ít nhất một chữ thường
        if (!/[a-z]/.test(password)) {
            return false;
        }

        // Kiểm tra xem mật khẩu có ít nhất một số
        if (!/[0-9]/.test(password)) {
            return false;
        }

        // Kiểm tra xem mật khẩu có ít nhất một ký tự đặc biệt
        if (!/[!@#$%^&*]/.test(password)) {
            return false;
        }

        return true;
    }

    const handlePasswordChange = (e) => {
        e.preventDefault();

        if (oldPassword !== userData.password) {
            toast.error("Your old password is incorrect!");
            setMessageOldPassword('Please enter your old password again!');
            return;
        } else {
            setMessageOldPassword('');
            if (!isStrongPassword(newPassword)) {
                toast.error("Your new password is not strong enough!");
                setMessageNewPassword('Please enter strong password!');
                return;

            } else {
                setMessageNewPassword('');
                if (newPassword !== confirmNewPassword) {
                    toast.error("Your new password and confirm password is not match!");
                    setMessageConfirmPassword('Your new password and confirm password is not match!');
                    return;
                } else {
                    setMessageConfirmPassword('');
                    const updatedUserData = {
                        ...userData,
                        password: newPassword
                    };
                    axios.put(`http://localhost:9999/user/${id}`, updatedUserData)
                        .then((response) => {
                            if (response.status == 200) {
                                // Handle success, e.g., show a success message
                                toast.success("Password change successfully!");
                                navigate('/login');
                            } else {
                                // Handle errors, e.g., show an error message
                                toast.error("Error changing password");
                            }
                        })
                        .catch((error) => {
                            // Handle errors, e.g., show an error message
                            console.error("Error changing password: " + error);
                        });
                }


            }
        }
    };
    useEffect(() => {
        axios.get(`http://localhost:9999/user/${id}`)
            .then((response) => {
                const data = response.data;
                setUserData(data);
                console.log(data);
            })
            .catch((error) => {
                console.error("Error fetching data: " + error);
            });
    }, [id]);

    return (
        <div className="form-style-1 user-pro">
            <Form onSubmit={handlePasswordChange} className="password">
                <h4>02. Change password</h4>
                <Form.Group>
                    <Form.Label htmlFor="oldpassword">Old Password</Form.Label>
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                        <Form.Control
                            type={showOldPassword ? "text" : "password"}
                            id="oldpassword"
                            placeholder="**********"
                            value={oldPassword}
                            onChange={(e) => setOldPassword(e.target.value)}
                        />

                        <span
                            style={{ marginLeft: '10px' }}
                            className="password-toggle"
                            onMouseEnter={() => setCursor('default')}
                            onMouseLeave={() => setCursor('pointer')}
                            onClick={() => setShowOldPassword(!showOldPassword)}
                        >
                            {showOldPassword ? "👁️" : "👁‍🗨"}
                        </span>
                    </div>
                    {
                        messageOldPassword ? <p className="text-danger">{messageOldPassword}</p> : ''
                    }
                </Form.Group>
                <Form.Group>
                    <Form.Label htmlFor="newpassword">New Password</Form.Label>

                    <div style={{ display: 'flex', alignItems: 'center' }}>
                        <Form.Control
                            type={showNewPassword ? "text" : "password"}
                            id="newpassword"
                            placeholder="**********"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                        />
                        <span
                            style={{ marginLeft: '10px' }}
                            className="password-toggle"
                            onMouseEnter={() => setCursor('default')}
                            onMouseLeave={() => setCursor('pointer')}
                            onClick={() => setShowNewPassword(!showNewPassword)}
                        >
                            {showNewPassword ? "👁️" : "👁‍🗨"}
                        </span>
                    </div>
                    {
                        messageNewPassword ? <p className="text-danger">{messageNewPassword}</p> : ''
                    }
                </Form.Group>
                <Form.Group>
                    <Form.Label htmlFor="confirmnewpassword">Confirm New Password</Form.Label>
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                        <Form.Control
                            type={showConfirmPassword ? "text" : "password"}
                            id="confirmpassword"
                            placeholder="**********"
                            value={confirmNewPassword}
                            onChange={(e) => setConfirmNewPassword(e.target.value)}
                        />

                        <span
                            style={{ marginLeft: '10px' }}
                            className="password-toggle"
                            onMouseEnter={() => setCursor('default')}
                            onMouseLeave={() => setCursor('pointer')}
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        >
                            {showConfirmPassword ? "👁️" : "👁‍🗨"}
                        </span>
                    </div>
                    {
                        messageConfirmPassword ? <p className="text-danger">{messageConfirmPassword}</p> : ''
                    }
                </Form.Group>
                <Button variant="primary" type="submit" style={{ marginTop: '20px' }}>
                    Change
                </Button>
            </Form>
        </div>
    );
}
