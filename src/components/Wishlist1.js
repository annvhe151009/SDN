import React from 'react';
import { Link } from 'react-router-dom';
import { Container, Row, Col, Button, Form } from "react-bootstrap";
export default function Wishlist1() {
  return (
	<div>
		  <div className="topbar-filter">
			<p>Found <span>1,608 movies</span> in total</p>
			<label>Sort by:</label>
			<select>
			  <option value="popularity">Popularity Descending</option>
			  <option value="popularity">Popularity Ascending</option>
			  <option value="rating">Rating Descending</option>
			  <option value="rating">Rating Ascending</option>
			  <option value="date">Release date Descending</option>
			  <option value="date">Release date Ascending</option>
			</select>
			<Link to={'/wishlist'} className="list">
			  <i className="ion-ios-list-outline"></i>
			</Link>
			<Link to={'/wishlistgrid'} className="grid">
			  <i className="ion-grid active"></i>
			</Link>
		  </div>
		  <div >
		  <Row>
        <Col md={12}>
          <div className="movie-item-style-2">
            <img src="images/uploads/mv1.jpg" alt="" />
            <div className="mv-item-infor">
              <h6>
                <Link href="moviesingle.html">
                  oblivion <span>(2012)</span>
                </Link>
              </h6>
              <p className="rate">
                <i className="ion-android-star"></i>
                <span>8.1</span> /10
              </p>
              <p className="describe">
                Earth's mightiest heroes must come together and learn to fight as a team if they are to stop the mischievous Loki and his alien army from enslaving humanity...
              </p>
              <p className="run-time">
                Run Time: 2h21’ . <span>MMPA: PG-13 </span> . <span>Release: 1 May 2015</span>
              </p>
              <p>
                Director: <Link href="#">Joss Whedon</Link>
              </p>
              <p>
                Stars: <Link href="#">Robert Downey Jr.,</Link> <Link href="#">Chris Evans,</Link> <Link href="#">Chris Hemsworth</Link>
              </p>
            </div>
          </div>
        </Col>
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
};

