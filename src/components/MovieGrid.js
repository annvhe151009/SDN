import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Container, Row, Col, Form } from 'react-bootstrap';
import axios from 'axios';

export default function MovieGrid() {
  const [movies, setMovies] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const location = useLocation();

  useEffect(() => {
	const searchQuery = new URLSearchParams(location.search).get('search');
	setSearchTerm(searchQuery); // Set the search term from the query parameter
  
	axios.get('http://localhost:9999/movie')
	  .then((res) => res.data)
	  .then((movies) => {
		setMovies(movies.filter((p) => p.name.toLowerCase().includes(searchQuery.toLowerCase())))
	  })
	  .catch((error) => console.error(error));
  }, [location.search]);

  return (
    <div style={{ paddingTop: '280px' }}>
      <div className="topbar-filter">
        <p>Found <span>{movies.length} movies</span> in total</p>
      </div>
      <div>
        <Row>
          {movies.map((movie) => (
            <Col key={movie.id} md={3} className="movie-item-style-2 movie-item-style-1">
              <img src={movie.img_url} alt={movie.name} />
              <div className="hvr-inner">
                <Link to={`/moviedetail/${movie.id}`}> Read more <i className="ion-android-arrow-dropright"></i> </Link>
              </div>
              <div className="mv-item-infor">
                <h6><Link to={`/moviedetail/${movie.id}`}>{movie.name}</Link></h6>
                <p className="rate"><i className="ion-android-star"></i><span>{movie.rating}</span> /10</p>
              </div>
            </Col>
          ))}
        </Row>
      </div>
      <div className="topbar-filter">
			<label>Movies per page:</label>
			<select>
			  <option value="range">20 Movies</option>
			  <option value="saab">10 Movies</option>
			</select>
	
			<div className="pagination2">
			  <span>Page 1 of 2:</span>
			  <Link className="active" href="#">1</Link>
			  <Link href="#">2</Link>
			  <Link href="#">3</Link>
			  <Link href="#">...</Link>
			  <Link href="#">78</Link>
			  <Link href="#">79</Link>
			  <Link href="#"><i className="ion-arrow-right-b"></i></Link>
			</div>
		  </div>
    </div>
  );
}
