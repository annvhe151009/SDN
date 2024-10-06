import { BrowserRouter, Link, Route, Routes, useMatch } from "react-router-dom";
import {
  Home,
  Header,
  Footer,
  Login,
  Signup,
  ResetPassword,
  ResetPassword2,
  BreadCrumb,
  Sidebar,
  ChangePassword,
  UserProfile,
  Filter,
  MovieGrid,
  MovieList,
  MovieDetail,
  Wishlist1,
  WishlistGrid,
  MovieRated,
  CastDetail,
  AdminSidebar,
  Table,
  AdminTopNav,
  AdminFooter,
  Search,
  SearchCast,
  AdminCast
} from "./components/index";
import { Container, Row, Col, Button, Form } from "react-bootstrap";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import AdminMovieList from "./components/AdminMovieList";
import AdminMovieDetail from "./components/AdminMovieDetail";
import AdminLayout from "./layout/AdminLayout";
import AdminAddMovie from "./components/AdminAddMovie";
import UserDetail from "./components/UserDetail";
import HomeAdmin from "./components/HomeAdmin";

function App() {
  return (
    <div style={{ backgroundColor: "#020d18", overflowX: "hidden" }}>
      <BrowserRouter>
        <div>
          {window.location.pathname.startsWith("/admin") ? null : <Header />}
          <ToastContainer position="top-right" autoClose={2000} />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/resetpassword" element={<ResetPassword />} />
            <Route path="/resetpassword2" element={<ResetPassword2 />} />
          </Routes>

          <Routes>
            <Route path="/userprofile" element={<BreadCrumb />} />
            <Route path="/changepassword" element={<BreadCrumb />} />
            <Route path="/wishlistgrid" element={<BreadCrumb />} />
            <Route path="/wishlist" element={<BreadCrumb />} />
            <Route path="/movierated" element={<BreadCrumb />} />
          </Routes>
          <Container>
            <Row className="ipad-width">
              <Col md={3} sm={12} xs={12}>
                <Routes>
                  <Route path="/userprofile" element={<Sidebar />} />
                  <Route path="/changepassword" element={<Sidebar />} />
                  <Route path="/wishlist" element={<Sidebar />} />
                  <Route path="/movierated" element={<Sidebar />} />
                </Routes>
              </Col>
              <Col md={9} sm={12} xs={12}>
                <Routes>
                  <Route path="/userprofile" element={<UserProfile />} />
                  <Route path="/changepassword" element={<ChangePassword />} />
                  <Route path="/wishlist" element={<WishlistGrid />} />
                  <Route path="/movierated" element={<MovieRated />} />
                </Routes>
              </Col>
            </Row>
          </Container>

          <Container>
            <Row className="ipad-width">
              <Routes>
                <Route path="/movie" element={<Search />} />
                <Route path="/cast" element={<SearchCast />} />
              </Routes>
            </Row>
          </Container>

          <Container>
            <Routes>
              <Route path="/moviedetail/:id" element={<MovieDetail />} />
              <Route path="/castdetail/:id" element={<CastDetail />} />
            </Routes>
          </Container>

          {window.location.pathname.startsWith("/admin") ? null : <Footer />}
        </div>
        <div style={{ backgroundColor: "white", overflowX: "none" }}>
          <Routes>
            
            <Route
              path="admin"
              
              element={

                  <HomeAdmin/>
                
              }
            />
            <Route
              path="admin/movie-list"
              element={
                <AdminLayout>
                  <AdminMovieList />
                </AdminLayout>
              }
            />
            <Route
              path="admin/movie/:movieId"
              element={
                <AdminLayout>
                  <AdminMovieDetail />
                </AdminLayout>
              }
            />
            <Route
              path="admin/add/movie"
              element={
                <AdminLayout>
                  <AdminAddMovie />
                </AdminLayout>
              }
            />
            <Route path="admin/cast" element={<AdminLayout><AdminCast /></AdminLayout>} />
            <Route path="admin/user" element={<AdminLayout><UserDetail /></AdminLayout>} />

          </Routes>
        </div>
      </BrowserRouter>
    </div>
  );
}

export default App;
