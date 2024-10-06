import React from "react";
import { Container, Row, Col, Button, Form, Navbar } from "react-bootstrap";
import { Link } from "react-router-dom";
import { BrowserRouter, Route, Routes } from "react-router-dom";

export default function AdminSidebar() {
  return (
    <div
      className="left_col scroll-view"
      style={{ position: "fixed", height: "100vh" }}
    >
      <Navbar.Brand style={{ width: "230px" }}>
        <Link to="/admin" style={{ textDecoration: "none" }}>
          <img
            className="logo"
            src="/images/logo1.png"
            alt="Logo"
            width="160"
            height="58"
          />
        </Link>
      </Navbar.Brand>

      <div className="clearfix"></div>

      <br />

      <div
        id="sidebar-menu"
        className="main_menu_side hidden-print main_menu"
        style={{ marginTop: "40px" }}
      >
        <div className="menu_section">
          <ul className="nav side-menu">
            <li>
              <Link to={"/admin/movie-list"}>
                <i className="fa fa-desktop"></i> Movie{" "}
                <span className="fa fa-chevron-right"></span>
              </Link>
            </li>
            <li>
              <Link to={"/admin/add/movie"}>
                <i className="fa fa-plus"></i> Add Movie{" "}
                <span className="fa fa-chevron-right"></span>
              </Link>
            </li>

            <li>
              <Link to={"/admin/cast"}>
                <i className="fa fa-users-rectangle"></i> Casts{" "}
                <span className="fa fa-chevron-right"></span>
              </Link>
            </li>
            <li>
              <Link to={"/admin/user"}>
                <i className="fa fa-user"></i> Users{" "}
                <span className="fa fa-chevron-right"></span>
              </Link>
            </li>

            {/* <li><Link><i className="fa fa-bar-chart-o"></i> Report <span ></span></Link></li> */}
          </ul>
        </div>
      </div>
    </div>
  );
}
