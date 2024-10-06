import { Container, Row, Col, Button, Form, Image } from "react-bootstrap";
import { Link, useParams } from "react-router-dom";
import React, { useState, useEffect } from "react";
import axios from 'axios'
import { toast } from 'react-toastify';

export default function CastDetail() {
  const { id } = useParams();
  const [cast, setCast] = useState(null);
  const [movieCasts, setMovieCasts] = useState([]);
  const [usersRate, setUsersRate] = useState([]);
  const [sortingCriteria, setSortingCriteria] = useState("");
  const [ratingsMap, setRatingsMap] = useState({});
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    axios.get(`http://localhost:9999/cast/${id}`)
      .then((response) => {
        const data = response.data;
        setCast(data);
      })
      .catch((error) => {
        console.error("Error fetching data: " + error);
      });
  }, [id]);

  useEffect(() => {
    axios
      .get(`http://localhost:9999/movie_detail?cast_id=${id}`)
      .then((response) => response.data)
      .then((data) => {
        const query = data.reduce(
          (query, curItem) => query + "id=" + curItem.movie_id + "&",
          ""
        );
        axios
          .get(`http://localhost:9999/movie?${query}`)
          .then((response) => response.data)
          .then((data) => {
            if (searchTerm.length === 0) {
              setMovieCasts(data);
            } else {
              setMovieCasts(data.filter(p => p.name.toLowerCase().startsWith(searchTerm.toLowerCase())))
            }
          });
      });
  }, [id, searchTerm]);

  useEffect(() => {
    axios.get(`http://localhost:9999/rate`)
      .then((response) => {
        const data = response.data;
        setUsersRate(data);
      })
      .catch((error) => {
        console.error("Error fetching data: " + error);
      });
  }, [id]);

  useEffect(() => {
    axios.get(`http://localhost:9999/rate`)
      .then((response) => {
        const data = response.data;

        const ratings = {};
        data.forEach((rating) => {
          const movieId = rating.movie_id;
          if (!ratings[movieId]) {
            ratings[movieId] = { totalRating: 0, totalUsers: 0 };
          }
          ratings[movieId].totalRating += rating.rating;
          ratings[movieId].totalUsers += 1;
        });

        setRatingsMap(ratings);
      })
      .catch((error) => {
        console.error("Error fetching data: " + error);
      });
  }, [id]);

  useEffect(() => {
    sortMovies(sortingCriteria);
  }, [sortingCriteria]);

  const calculateAverageRating = (movie) => {
    const ratingInfo = ratingsMap[movie.id];
    if (ratingInfo) {
      return (ratingInfo.totalRating / ratingInfo.totalUsers).toFixed(1);
    }
    return 0;
  };

  const sortMovies = (criteria) => {
    let sortedMovies = [...movieCasts];
    if (criteria === "rating-desc") {
      sortedMovies.sort((a, b) => calculateAverageRating(b) - calculateAverageRating(a));
    } else if (criteria === "rating-asc") {
      sortedMovies.sort((a, b) => calculateAverageRating(a) - calculateAverageRating(b));
    } else if (criteria === "date-desc") {
      sortedMovies.sort((a, b) => new Date(b.release_year) - new Date(a.release_year));
    } else if (criteria === "date-asc") {
      sortedMovies.sort((a, b) => new Date(a.release_year) - new Date(b.release_year));
    }
    setMovieCasts(sortedMovies);
  };

  return (
    <div style={{ paddingTop: "220px", paddingBottom: "60px" }}>
      <Row className="ipad-width">
        <Col md={4} sm={12} xs={12}>
          <div className="mv-ceb">
            <Image src={cast ? cast.img : ""} alt="" fluid />
          </div>
          <Row></Row>
        </Col>
        <Col md={8} sm={12} xs={12}>
          <div className="movie-single-ct">
            <h1 className="bd-hd">{cast ? cast.name : ""}</h1>
            <div className="social-link cebsingle-socail">
              <a href="#film">
                <i className="ion-social-facebook"></i>
              </a>
              <a href="#film">
                <i className="ion-social-twitter"></i>
              </a>
              <a href="#film">
                <i className="ion-social-googleplus"></i>
              </a>
              <a href="#film">
                <i className="ion-social-linkedin"></i>
              </a>
            </div>
            <div className="movie-tabs">
              <div className="tabs">
                <ul className="tab-links tabs-mv">
                  <li className="active">
                    <a href="#overviewceb">Overview</a>
                  </li>
                  <li>
                    <a href="#film">films</a>
                  </li>
                </ul>
                <div className="tab-content">
                  <div id="overviewceb" className="tab active">
                    <Row>
                      <Col md={12} sm={12} xs={12}>
                        <Col md={3} className="sb-it">
                          <h6 style={{ color: "white" }}>Fullname: </h6>
                          <p>
                            <a href="#film">{cast ? cast.name : ""}</a>
                          </p>
                        </Col>
                        <Col md={3} className="sb-it">
                          <h6 style={{ color: "white" }}>Date of Birth: </h6>
                          <p>{cast ? cast.dob : ""}</p>
                        </Col>
                        <Col md={3} className="sb-it">
                          <h6 style={{ color: "white" }}>Country: </h6>
                          <p>{cast ? cast.country : ""}</p>
                        </Col>

                        <Col
                          md={12}
                          className="title-hd-sm"
                          style={{ marginTop: "48px" }}
                        >
                          <h4>About {cast ? cast.name : ""} </h4>
                        </Col>
                        <Col
                          md={12}
                          className="title-hd-sm"
                          style={{ marginTop: "48px" }}
                        >
                          <p>{cast ? cast.description : ""}</p>
                        </Col>
                      </Col>
                      <div className="col-md-4 col-xs-12 col-sm-12"></div>
                    </Row>
                  </div>
                  <div id="film" className="tab">
                    <Row>
                      <div className="topbar-filter">
                        <p>
                          Found <span>{movieCasts.length} movies</span> in total
                        </p>
                        <Form.Label>Filter by:</Form.Label>
                        <Form.Select onChange={(e) => setSortingCriteria(e.target.value)}>
                          <option value="">Select</option>
                          <option value="rating-desc">Rating Descending</option>
                          <option value="rating-asc">Rating Ascending</option>
                          <option value="date-desc">Release Year Descending</option>
                          <option value="date-asc">Release Year Ascending</option>
                        </Form.Select>
                      </div>
                      <Form.Control
                        type="text"
                        placeholder="Search..."
                        onChange={(e) => setSearchTerm(e.target.value)}
                        style={{
                          backgroundColor: '#000',
                          color: '#fff',
                          width: '30%'
                        }}
                      />
                      <hr />
                      <Row style={{ marginLeft: "0px" }}>
                        {movieCasts?.map((movie) => {
                          const averageRating =
                            usersRate
                              .filter((rating) => rating.movie_id === movie.id)
                              .length > 0
                              ? (
                                usersRate
                                  .filter((rating) => rating.movie_id === movie.id)
                                  .reduce((totalRate, currentItem) => totalRate + currentItem.rating, 0) /
                                usersRate
                                  .filter((rating) => rating.movie_id === movie.id)
                                  .length
                              ).toFixed(1)
                              : 0;

                          return (
                            <Col md={3} className="movie-item-style-2 movie-item-style-1" style={{ margin: "0px" }}>
                              <img src={movie.img_url} alt="" />
                              <div className="hvr-inner">
                                <a href={`/moviedetail/${movie.id}`}>Xem thêm <i className="ion-android-arrow-dropright"></i></a>
                              </div>
                              <div className="mv-item-infor">
                                <h6>
                                  <a href={`/moviedetail/${movie.id}`}>{movie.name}</a>
                                </h6>
                                <p>
                                  ⭐<span style={{ color: "white", fontSize: "18px" }}>{isNaN(averageRating) ? 0 : averageRating}</span> / 10
                                  <br />
                                  <span className="rv" style={{ color: "#337AB7" }}>
                                    {
                                      usersRate
                                        .filter((rating) => rating.movie_id === movie.id)
                                        .length
                                    } Đánh giá
                                  </span>
                                </p>
                              </div>
                            </Col>
                          );
                        })}
                      </Row>
                    </Row>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Col>
      </Row>
    </div>
  );
}
