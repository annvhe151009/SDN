import React, { useState, useEffect } from "react";
import { Container, Row, Col, Button, Form } from "react-bootstrap";
import { Link, useParamsm } from "react-router-dom";
import axios from 'axios'
import { toast } from 'react-toastify';

export default function UserProfile() {
    const { id } = JSON.parse(localStorage.getItem("user"));
    const [userData, setUserData] = useState(null); // Lưu trữ dữ liệu từ JSON
    const [data, setData] = useState(null);
    const [email, setEmail] = useState('');
    const [fullname, setFullname] = useState('');
    const [country, setCountry] = useState('');
    const [gender, setGender] = useState('');
    const [phonenumber, setPhonenumber] = useState('');
    const [messageEmail, setMessageEmail] = useState('');
    const [messagePhone, setMessagePhone] = useState('');

    useEffect(() => {
        axios.get(`http://localhost:9999/user/${id}`)
            .then((response) => {
                const data = response.data;
                setUserData(data);
                setEmail(data.email || '');
                setFullname(data.fullname|| '');
                setCountry(data.country || '');
                setGender(data.gender || '')
                setPhonenumber(data.phonenumber || '');
            })
            .catch((error) => {
                console.error("Error fetching data: " + error);
            });
    }, [id]);

    useEffect(() => {
        axios.get(`http://localhost:9999/user`)
            .then((response) => {
                const data = response.data;
                setData(data);
            })
            .catch((error) => {
                console.error("Error fetching data: " + error);
            });
    }, []);


    // Handle country selection
    const handleCountryChange = (e) => {
        setCountry(e.target.value);
    };
    const handleGenderChange = (e) => {
        setGender(e.target.value);
    };
    const isEmailValid = (email) => {
        const emailPattern = /\b[A-Za-z0-9._%+-]+@gmail.com\b/;
        return emailPattern.test(email);
    };
    const isEmailAlreadyExists = (email) => {
        const normalizedEmail = email.toLowerCase();
        let isFound = false;
        data.forEach(user => {
            if (user.email.toLowerCase() === normalizedEmail & user.id !== id) {
                isFound = true;
            }
        });
        return isFound;
    };

    const isPhoneNumberValid = (phoneNumber) => {
        const phoneNumberPattern = /^\d{1,11}$/; // Kiểm tra xem số điện thoại có từ 1 đến 11 chữ số
        return phoneNumberPattern.test(phoneNumber);
    };
    const handleSubmit = (e) => {
        e.preventDefault();
        // Kiểm tra xem email có đúng định dạng không
        // Kiểm tra xem email đã được nhập và không rỗng
        if (email !== '' && !isEmailValid(email)) {
            toast.error("Invalid email format. Please use a Gmail address.");
            setMessageEmail('Invalid email format');
            return;
        } else {
            setMessageEmail('');
        }

        if (isEmailAlreadyExists(email)) {
            toast.error("Email already exists. Please use a different email.");
            setMessageEmail('Email already exists');
            return;
        } else {
            setMessageEmail('');
        }
        // Kiểm tra xem số điện thoại có hợp lệ không
        if (phonenumber !== '' && !isPhoneNumberValid(phonenumber)) {
            toast.error("Invalid phone number. Please use a phone number with 1 to 11 digits.");
            setMessagePhone('Invalid phone number');
            return;
        } else {
            setMessagePhone('');
        }
        // Create an object with updated user data
        const updatedUserData = {
            ...userData,
            email: email ? email : userData.email,
            fullname: fullname ? fullname : userData.fullname,
            country: country ? country : userData.country,
            gender: gender ? gender : userData.gender,
            phonenumber: phonenumber ? phonenumber : userData.phonenumber,
        };
        console.log(updatedUserData);

        // Send a POST request to update the user's profile
        axios.put(`http://localhost:9999/user/${id}`, updatedUserData)
            .then((response) => {
                if (response.status == 200) {
                    // Handle success, e.g., show a success message
                    toast.success("Profile updated successfully!");
                    localStorage.setItem("user", JSON.stringify(updatedUserData));
                } else {
                    // Handle errors, e.g., show an error message
                    toast.error("Error updating profile");
                }
            })
            .catch((error) => {
                // Handle errors, e.g., show an error message
                console.error("Error updating profile: " + error);
            });
    };




    return (
        <div className="form-style-1 user-pro" action="#">
            <Form onSubmit={handleSubmit} className="user">
                <h4>01. Profile details</h4>
                <Form.Group>
                    <Form.Label for="username-3">Username</Form.Label>
                    <Form.Control
                        readOnly
                        type="text"
                        id="username-3"
                        placeholder={userData ? userData.username : ''}
                        style={{ backgroundColor: '#4a5a75', border: '3 px' }}
                    />
                </Form.Group>
                <Form.Group>
                    <Form.Label for="email-3">Email Address</Form.Label>
                    <Form.Control
                        type="email"
                        id="email-3"
                        placeholder={userData ? userData.email : ''}
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                    {
                        messageEmail ? <p className="text-danger">{messageEmail}</p> : ''
                    }
                </Form.Group>
                <Row>
                    <Col md={6}>
                        <Form.Group>
                            <Form.Label for="fullname">Full Name</Form.Label>
                            <Form.Control
                                type="text"
                                id="fullname"
                                placeholder={userData ? userData.fullname : ''}
                                value={fullname}
                                onChange={(e) => setFullname(e.target.value)}
                            />
                        </Form.Group>
                    </Col>
                    <Col md={6}>
                        <Form.Group>
                            <Form.Label for="gender">Gender</Form.Label>
                            <Form.Control as="select" id="gender" value={gender} onChange={handleGenderChange}>
                                {userData && userData.gender ? (
                                    <>
                                        <option value={userData.gender}>{userData.gender}</option>
                                        <option value="Male">Male</option>
                                        <option value="Female">Female</option>
                                        <option value="Other">Other</option>
                                    </>
                                ) : (
                                    <option value="" disabled>Select Gender</option>
                                )}
                            </Form.Control>
                        </Form.Group>
                    </Col>
                </Row>
                <Row>
                    <Col md={6}>
                        <Form.Group>
                            <Form.Label for="lastname">Phonenumber </Form.Label>
                            <Form.Control
                                type="text"
                                id="phonenumber"
                                placeholder={userData ? userData.phonenumber : ''}
                                value={phonenumber}
                                onChange={(e) => setPhonenumber(e.target.value)}
                            />
                            {
                                messagePhone ? <p className="text-danger">{messagePhone}</p> : ''
                            }
                        </Form.Group>
                    </Col>
                    <Col md={6}>
                        <Form.Group>
                            <Form.Label for="country">Country</Form.Label>
                            <Form.Control as="select" id="country" value={country} onChange={handleCountryChange}>
                                <option value="">{userData ? userData.country : ''}</option>
                                <option value="United States">United States</option>
                                <option value="canada">Canada</option>
                                <option value="United Kingdom">United Kingdom</option>
                                <option value="Australia">Australia</option>
                                <option value="Germany">Germany</option>
                                <option value="France">France</option>
                                <option value="Japan">Japan</option>
                                <option value="China">China</option>
                                <option value="India">India</option>
                                <option value="Brazil">Brazil</option>
                                <option value="Vietnam">Vietnam</option>
                                {/* Add more countries as needed */}
                            </Form.Control>
                        </Form.Group>
                    </Col>

                </Row>
                <Button variant="primary" type="submit" style={{ marginTop: '20px' }}>
                    Save
                </Button>
            </Form>

        </div>
    );
}

