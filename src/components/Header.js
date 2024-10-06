import { React, useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Navbar, Nav, Button, FormControl, Container } from 'react-bootstrap';

const menuItem = {
  margin: '10px',
  padding: '22px 10px 16px',
  fontSize: '17px',
  textDecoration: 'none',
  color: '#75a9d6'
};

const linkStyle = {
  textDecoration: 'none'
};

const IconStyle = {
  color: 'white',
  padding: '10px',
  cursor: 'pointer',
  fontSize: '18px',

}

export default function Header() {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchType, setSearchType] = useState('movie');
  const navigate = useNavigate();
  const [userId, setUserId] = useState(localStorage.getItem("user") ? JSON.parse(localStorage.getItem("user")).id : -1);

  const handleSearch = () => {
    if (searchType==='movie')
      navigate(`/movie?search=${searchQuery}`);
      if (searchType==='cast')
      navigate(`/cast?search=${searchQuery}`);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSearch();
    }
  };

  const location = useLocation();

  const loginStyle = {
    padding: '10px 8px', margin: '8px', textDecoration: 'none'
  };

  const signupStyle = {
    display: 'inline-block', padding: '10px 18px', margin: '21px 8px', borderRadius: '20px', textDecoration: 'none', backgroundColor: '#286090', color: 'white'
  };

  return (
    <header className="ht-header">
      <Container>
        <Navbar bg="light" expand="lg" className="navbar-custom" style={{ margin: '0' }}>
          <Navbar.Brand>
            <Link to="/" style={linkStyle}>
              <img className="logo" src="/images/logo1.png" alt="Logo" width="200" height="58" />
            </Link>
          </Navbar.Brand>

          <Navbar.Collapse id="bs-example-navbar-collapse-1">
            <Nav className="flex-child-menu menu-left" style={{ display: 'flex', marginLeft: '12px' }}>
              <Link to="/home" style={menuItem}>Popular</Link>
              <Link to="/top-rated" style={menuItem}>Top Rated</Link>
              <Link to="/upcoming" style={menuItem}>Upcoming</Link>
            </Nav>

            <Nav className="flex-child-menu navbar-right">
              {userId === -1 ? (
                <Nav className="flex-child-menu navbar-right">
                  <Link to={'/login'} style={location.pathname === '/login' ? signupStyle : loginStyle}>
                    LOG IN
                  </Link>
                  <Link to={'/signup'} style={location.pathname === '/login' ? loginStyle : signupStyle}>
                    SIGN UP
                  </Link>
                </Nav>
              ) : (
                <Nav className="flex-child-menu navbar-right">
                  <Nav className="flex-child-menu menu-right" style={{ display: 'flex', marginTop: '16px' }}>
                    <Nav.Link href="/wishlist" style={{ margin: '6px' }}>
                    <i className="fa fa-heart" style={{ ...IconStyle, color: location.pathname === '/wishlist' ? 'red' : 'white' }}></i>
                    </Nav.Link>
                    <Nav.Link href="/userprofile" style={{ margin: '6px' }}><i className="fa fa-user" style={IconStyle}></i></Nav.Link>
                  </Nav>
                </Nav>
              )}

            </Nav>



          </Navbar.Collapse>
        </Navbar>

        <div className="top-search" style={{ border: 'none', width: '80%', margin: 'auto' }}>
          <FormControl as="select"  onChange={(e) => setSearchType(e.target.value)}>
            <option value="movie">Movie</option>
            <option value="cast">Cast</option>
          </FormControl>
          <FormControl
            type="text"
            placeholder="Search for a movie, TV Show, or celebrity that you are looking for"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={handleKeyDown}
          />
        </div>
      </Container>
    </header>
  );
}
