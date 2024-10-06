import React from "react";
import { Container, Row, Col, Button, Form } from "react-bootstrap";
import { Link , useLocation} from "react-router-dom";
import { BrowserRouter, Route, Routes } from "react-router-dom";

export default function BreadCrumb() {
  const { fullname } = JSON.parse(localStorage.getItem("user"));
  const location = useLocation();
  
    return (
        <div className="hero user-hero">
          <Container>
            <Row>
              <Col md={12}>
                <div className="hero-ct">
                  <h1>{fullname}'s Profile</h1>

                  <ul className="breadcumb">
                    <li className="active breadcrumb-item">
                      <Link to="/">Home</Link>
                    </li>
                    <li className="breadcrumb-item">
                    {location.pathname === '/userprofile' ?  <Link to="/userprofile"><span className="ion-ios-arrow-right"></span>Profile</Link> :''}
                    {location.pathname === '/wishlist' ?  <Link to="/wishlist"><span className="ion-ios-arrow-right"></span>wishlist</Link> :''}
                    {location.pathname === '/movierated' ?  <Link to="/movierated"><span className="ion-ios-arrow-right"></span>Rated & Reviewed Movies</Link> :''}
                    {location.pathname === '/changepassword' ?  <Link to="/changepassword"><span className="ion-ios-arrow-right"></span>Change Password</Link> :''}

                    </li>
                  </ul>
                </div>
              </Col>
            </Row>
          </Container>
        </div>
    );
}

