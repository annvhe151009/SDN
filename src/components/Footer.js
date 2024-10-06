import React, { useState } from "react";
import { Link } from 'react-router-dom';
import { Navbar, Nav, NavDropdown, Button, Form, Container, Row, Col } from 'react-bootstrap';
import { toast } from 'react-toastify';
import axios from "axios";

export default function Footer() {
  const [message, setMessage] = useState("");
  const [email, setEmail] = useState('');

  const isEmailValid = (email) => {
    const emailPattern = /\b[A-Za-z0-9._%+-]+@gmail.com\b/;
    return emailPattern.test(email);
  };

  const subscribe = (e) => {
    e.preventDefault();

    // Validate the report reason
    if (email.trim() === "") {
      setMessage("Please enter an email to subscribe!");
      return;
    }

    if (email !== '' && !isEmailValid(email)) {
      setMessage('Invalid email format');
      return;
    } 
    setMessage('');
    
    // Assuming you have a function to submit the report to the server
    axios
      .post(`http://localhost:9999/subscribe`, {
        email: email
      })
      .then(res => {
        if (res.status === 201)
          toast.success("Subscribe successfully")
      })
      .catch(err => console.error(err))
  };

  return (
    <footer className="ht-footer" id="footer">
      <Container>
        <Row className="flex-parent-ft">
          <Col className="flex-child-ft item1">
            <Link to="index-2.html"><img className="logo" width="250" src="images/logo1.png" alt="" /></Link>
            <p>FPT University</p>
            <p>Call us: <Link to="#">(+84) 034520356</Link></p>
          </Col>
          <Col className="flex-child-ft item2">
            <h4>Resources</h4>
            <ul>
              <li><Link to="#">About</Link></li>
              <li><Link to="#">Fermovie</Link></li>
              <li><Link to="#">Contact Us</Link></li>
              <li><Link to="#">Help Center</Link></li>
            </ul>
          </Col>
          <Col className="flex-child-ft item3">
            <h4>Legal</h4>
            <ul>
              <li><Link to="#">Terms of Use</Link></li>
              <li><Link to="#">Privacy Policy</Link></li>
              <li><Link to="#">Security</Link></li>
            </ul>
          </Col>
          <Col className="flex-child-ft item4">
            <h4>Account</h4>
            <ul>
              <li><Link to="#">My Account</Link></li>
              <li><Link to="#">Wishlist</Link></li>
              <li><Link to="#">Collections</Link></li>
            </ul>
          </Col>
          <Col className="flex-child-ft item5">
            <h4>Newsletter</h4>
            <p>Subscribe to our newsletter system now to get the latest news from us.</p>
            <Form>
              <Form.Control type="text" placeholder="Enter your email..." value={email}
                onChange={(e) => setEmail(e.target.value)}/>
              {message ? <p className="text-danger" style={{margin: '0'}}>{message}</p> : ''}
              <Button variant="primary" style={{marginTop:'16px'}} onClick={(e) => subscribe(e)}>Subscribe now <i className="ion-ios-arrow-forward"></i></Button>
            </Form>
          </Col>
        </Row>
      </Container>
      <div className="ft-copyright">
        <Container>
          <Row>
            <Col className="ft-left">
              <p><Link target="_blank" to="#">Fermovie</Link></p>
            </Col>
            <Col className="backtotop">
              <p><Link to="#" id="back-to-top">Back to top <i className="ion-ios-arrow-thin-up"></i></Link></p>
            </Col>
          </Row>
        </Container>
      </div>
    </footer>
  );
};
