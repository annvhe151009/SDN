import React, { useEffect, useState } from "react";
import { Row, Col, Button, Form, Image } from "react-bootstrap";
import axios from "axios";
import { FacebookShareButton, FacebookIcon } from "react-share";

import MovieDetailComment from "./MovieDetailComment";
import { getCurrentDate } from "./MovieDetailService";
import { useParams } from "react-router-dom";

export default function MovieDetail() {
  const starStyle = {
    fontSize: "36px",
    color: "#f5b50a",
    cursor: "pointer"
  };

  const rateStyle = {
    display: "flex",
    alignItems: "center",
    justifyContent: "flex-start",
    borderLeft: "1px solid #405266",
    paddingLeft: "30px",
    height: "54px",
  };

  const { id } = useParams();
  // Data moive detail
  const [movie, setMovie] = useState({});

  // Genres of this moive
  const [movieGenres, setMovieGenres] = useState([]);

  // Casts of this moive
  const [movieCasts, setMovieCasts] = useState([]);

  // Comments of this moive
  const [movieComments, setMovieComments] = useState([]);

  // Comment value to this moive
  const [myComment, setMyComment] = useState("");

  // error comment blank
  const [errBlankComment, setErrBlankComment] = useState("");

  // rates total
  const [usersRate, setUsersRate] = useState([]);

  // Rate value to this moive
  const [myRate, setMyRate] = useState({ rating: 0 });

  // render Start for rating
  const [renderStars, setRenderStarts] = useState([]);

  const [userId, setUserId] = useState(localStorage.getItem("user") ? JSON.parse(localStorage.getItem("user")).id : -1);

  const [wishlist, setWishlist] = useState([]);
  /**
   * Init: fetch movie data by movie_id
   */
  useEffect(() => {
    axios
      .get(`http://localhost:9999/movie/${id}`)
      .then((response) => response.data)
      .then((data) => setMovie(data));
  }, [id]);


  /**
   * Init: fetch total genre by movie_id
   */
  useEffect(() => {
    axios
      // fetch all genre_id by movie_id
      .get(`http://localhost:9999/movie_genre?movie_id=${id}`)
      .then((response) => response.data)
      .then((data) => {
        const query = data.reduce(
          (query, curItem) => query + "id=" + curItem.genre_id + "&",
          ""
        );
        // fetch all genre item by genre_id
        axios
          .get(`http://localhost:9999/genre?${query}`)
          .then((response) => response.data)
          .then((data) => setMovieGenres(data));
      });
  }, [id]);

  /**
   * Init: fetch total cast by movie_id
   */
  useEffect(() => {
    axios
      // fetch all cast_id by movie_id
      .get(`http://localhost:9999/movie_detail?movie_id=${id}`)
      .then((response) => response.data)
      .then((data) => {
        const query = data.reduce(
          (query, curItem) => query + "id=" + curItem.cast_id + "&",
          ""
        );
        // fetch all cast item by cast_id
        axios
          .get(`http://localhost:9999/cast?${query}`)
          .then((response) => response.data)
          .then((data) => setMovieCasts(data));
      });
  }, [id]);

  /**
   * Init: fetch total review by movie_id
   */
  useEffect(() => {
    fetchCommnentByMovieId();
  }, [id]);

  const fetchCommnentByMovieId = () => {
    axios
      // fetch all user
      .get(`http://localhost:9999/user`)
      .then((response) => response.data)
      .then((dataUsers) => {
        // fetch all review by movie_id
        axios
          .get(`http://localhost:9999/comment?movie_id=${id}`)
          .then((response) => response.data)
          .then((data) => {
            const nestedComments = nestComments(
              data.map((item) => ({
                ...item,
                user: dataUsers.find((user) => user.id === item.user_id),
              }))
            );
            setMovieComments(nestedComments);
          });
      });
  };

  /**
   * convert comment array to nestedcomment by parent_comment_id
   */
  const nestComments = (comments) => {
    const commentMap = {};
    const nestedComments = [];

    comments.forEach((comment) => {
      commentMap[comment.id] = comment;
      comment.replies = [];
    });

    comments.forEach((comment) => {
      if (comment.parent_comment_id) {
        commentMap[comment.parent_comment_id].replies.push(comment);
      } else {
        nestedComments.push(comment);
      }
    });

    return nestedComments;
  };

  /**
   * submit my comment
   */
  const handleSubmitComment = (data) => {
    if (userId === -1) {
      // User is not logged in, redirect to the login page
      window.location.href = "/login";
      return; // Stop execution to prevent adding to wishlist
    }
    if (data.content.trim() === "") {
      setErrBlankComment("Please enter comment before submit");
    } else {
      axios
        .post("http://localhost:9999/comment", data)
        .then((response) => response.data)
        .then((data) => {
          setMyComment("");
          fetchCommnentByMovieId();
          setErrBlankComment("");
        });
    }
  };

  /**
   * Init: fetch total rating data by movie_id
   */
  useEffect(() => {
    axios
      .get(`http://localhost:9999/rate?movie_id=${id}`)
      .then((response) => response.data)
      .then((data) => setUsersRate(data.filter((item) => item.rating)));
  }, [id, myRate]);

  /**
   * Init: fetch total rating data by movie_id and user_id
   */
  useEffect(() => {
    axios
      .get(`http://localhost:9999/rate?movie_id=${id}&user_id=${userId}`)
      .then((response) => response.data)
      .then((data) => {
        if (data.length !== 0) {
          setMyRate(data[0]);
        }
      });
  }, [id]);

  /**
   * Render starts rating
   */
  useEffect(() => {
    const elements = [];
    for (let i = 1; i <= 10; i++) {
      elements.push(
        i <= myRate.rating ? (
          <Col>
            <i
              onClick={() => handleRating(i)}
              className="ion-android-star"
              style={starStyle}
            ></i>
          </Col>
        ) : (
          <Col>
            <i
              onClick={() => handleRating(i)}
              className="ion-ios-star-outline"
              style={starStyle}
            ></i>
          </Col>
        )
      );
    }
    setRenderStarts(elements);
  }, [myRate]);

  const handleRating = (rating) => {
    if (userId === -1) {
      // User is not logged in, redirect to the login page
      window.location.href = "/login";
      return; // Stop execution to prevent adding to wishlist
    }
    if (myRate.rating !== 0) {
      axios
        .put(`http://localhost:9999/rate/${myRate.id}`, {
          ...myRate,
          rating,
        })
        .then((response) => response.data)
        .then((data) => setMyRate(data));
    } else {
      axios
        .post(`http://localhost:9999/rate`, {
          movie_id: id,
          user_id: userId,
          rating,
          create_at: getCurrentDate(),
          status: true,
        })
        .then((response) => response.data)
        .then((data) => setMyRate(data));
    }
  };

  /**
   * Handle wishlist 
   */

  useEffect(() => {
    const fetchWishlist = async () => {
      try {
        // Fetch wishlist data for the user
        const response = await axios.get(`http://localhost:9999/wishlist?user_id=${userId}`);
        setWishlist(response.data);
      } catch (error) {
        console.error('Error fetching wishlist:', error);
      }
    };

    fetchWishlist();
  }, [userId]);

  const isInWishlist = (movieId) => {
    return wishlist.some((item) => item.movie_id === movieId);
  };

  const handleWishlist = async (movieId) => {
    if (userId === -1) {
      // User is not logged in, redirect to the login page
      window.location.href = "/login";
      return; // Stop execution to prevent adding to wishlist
    }
    try {
      if (!isInWishlist(movieId)) {
        // Movie is not in the wishlist, add it
        await axios.post('http://localhost:9999/wishlist', { movie_id: movieId, user_id: userId });
        console.log(`Movie with ID ${movieId} added to wishlist.`);
      } else {
        // Movie is already in the wishlist, remove it
        const removeItem = wishlist.find((item) => item.movie_id === movieId);
        await axios.delete(`http://localhost:9999/wishlist/${removeItem.id}`);
        console.log(`Movie with ID ${movieId} removed from wishlist.`);
      }

      // Fetch the updated wishlist after adding/removing a movie
      const updatedWishlist = await axios.get(`http://localhost:9999/wishlist?user_id=${userId}`);
      setWishlist(updatedWishlist.data);
    } catch (error) {
      console.error('Error handling wishlist:', error);
    }
  };
  return (
    <div style={{ paddingTop: "220px" }}>
      <Row className="ipad-width2">
        <Col md={4} sm={12} xs={12}>
          <div className="movie-img sticky-sb">
            <Image src={movie?.img_url} width={342} alt="" fluid />
            <div className="movie-btn">
              <div
                className="btn-transform transform-vertical red"
                style={{ width: "95%", marginTop: "24px" }}
              >
                <div>
                  <Button className="item item-1" variant="danger" size="lg">
                    <i className="ion-play"></i> Watch Trailer
                  </Button>
                </div>
                <div>
                  <a
                    href={movie?.trailers_url}
                    className="item item-2 redbtn fancybox-media hvr-grow"
                  >
                    <i className="ion-play"></i>
                  </a>
                </div>
              </div>
            </div>
          </div>
          <Col md={12} style={{ paddingTop: "28px", paddingLeft: "0px" }}>
            <Image src="images/uploads/ads1.png" alt="" />
          </Col>
        </Col>
        <Col md={8} sm={12} xs={12}>
          <div className="movie-single-ct main-content">
            <h1 className="bd-hd">
              {movie?.name} <span>{movie?.release_year}</span>
            </h1>
            <div className="social-btn">
              <a href="#" onClick={() => handleWishlist(movie.id)} className="parent-btn">
                <i className="ion-heart" style={{ color: isInWishlist(movie.id) ? 'red' : '#eec1c1', fontSize: '16px', backgroundColor: isInWishlist(movie.id) ? '#981818' : 'transparent' }}></i> Add to Favorite
              </a>
              <div className="hover-bnt">
                <a href="javascript:void(0)" className="parent-btn">
                  <i className="ion-android-share-alt"></i>share
                </a>
                <div className="hvr-item">
                  <a href="javascript:void(0)" className="hvr-grow">
                    <FacebookShareButton
                      url={movie?.trailers_url}
                      hashtag="fermovie"
                    >
                      <i className="ion-social-facebook"></i>
                    </FacebookShareButton>
                  </a>
                  <a href="javascript:void(0)" className="hvr-grow">
                    <i className="ion-social-twitter"></i>
                  </a>
                  <a href="javascript:void(0)" className="hvr-grow">
                    <i className="ion-social-googleplus"></i>
                  </a>
                  <a href="javascript:void(0)" className="hvr-grow">
                    <i className="ion-social-youtube"></i>
                  </a>
                </div>
              </div>
            </div>
            <Row className="movie-rate">
              <Col md={3} xs={12}>
                <Row
                  className="rate"
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "flex-start",
                  }}
                >
                  <Col md={3} xs={12}>
                    <i
                      className="ion-android-star"
                      style={{ fontSize: "36px", color: "#f5b50a" }}
                    ></i>
                  </Col>
                  <Col md={9} xs={12}>
                    <p>
                      <span style={{ color: "white", fontSize: "18px" }}>
                        {(usersRate?.length > 0
                          ? (
                            usersRate.reduce(
                              (totalRate, currentItem) =>
                                totalRate + currentItem.rating,
                              0
                            ) / usersRate.length
                          ).toFixed(1)
                          : 0
                        )}
                      </span>{" "}
                      /10
                      <br />
                      <span className="rv" style={{ color: "#337AB7" }}>
                        {usersRate?.length} Reviews
                      </span>
                    </p>
                  </Col>
                </Row>
              </Col>
              <Col md={9} xs={12} style={{ marginLeft: "-34px" }}>
                <Row className="rate-star" style={rateStyle}>
                  <Col>
                    <h4 style={{ color: "#abb7c4", marginRight: "20px" }}>
                      Rate This Movie:
                    </h4>
                  </Col>
                  {renderStars}
                </Row>
              </Col>
            </Row>
            <div className="movie-tabs">
              <div className="tabs">
                <ul className="tab-links tabs-mv">
                  <li className="active">
                    <a data-toggle="tab" href="#overview">
                      Overview
                    </a>
                  </li>
                  <li>
                    <a data-toggle="tab" href="#reviews">
                      {" "}
                      Reviews
                    </a>
                  </li>
                  <li>
                    <a data-toggle="tab" href="#cast">
                      {" "}
                      Casts{" "}
                    </a>
                  </li>
                </ul>
                <div className="tab-content">
                  <div id="overview" className="tab active">
                    <Row>
                      <Col
                        md={12}
                        sm={12}
                        xs={12}
                        style={{ marginBottom: "24px" }}
                      >
                        <p>{movie?.description}</p>
                        <Row>
                          <Col md={3} className="sb-it">
                            <h6 style={{ color: "white" }}>Director: </h6>
                            <p>
                              <a href="javascript:void(0)">{movie?.director}</a>
                            </p>
                          </Col>
                          <Col md={3} className="sb-it">
                            <h6 style={{ color: "white" }}>Genres:</h6>
                            <p>
                              {movieGenres?.map((item, index) => (
                                <a key={item.id} href={item.id}>
                                  {item.name}
                                  {index < movieGenres?.length - 1 && ", "}
                                </a>
                              ))}
                            </p>
                          </Col>
                          <Col md={3} className="sb-it">
                            <h6 style={{ color: "white" }}>Release Year:</h6>
                            <p>{movie.release_year}</p>
                          </Col>
                          <Col md={3} className="sb-it">
                            <h6 style={{ color: "white" }}>Run Time:</h6>
                            <p>141 min</p>
                          </Col>
                        </Row>
                      </Col>
                    </Row>
                  </div>
                  <div id="reviews" className="tab review">
                    <Row>
                      <Col md={12} className="anime__details__form">
                        <Form>
                          <Form.Group controlId="comment">
                            <Form.Control
                              value={myComment}
                              onChange={(e) => setMyComment(e.target.value)}
                              type="text"
                              placeholder="Your Comment"
                              as="textarea"
                            />
                          </Form.Group>
                          {errBlankComment !== "" && (
                            <div class="alert alert-danger">
                              {errBlankComment}
                            </div>
                          )}
                          <Button
                            type="button"
                            onClick={() =>
                              handleSubmitComment({
                                movie_id: id,
                                user_id: 1,
                                content: myComment,
                                create_at: getCurrentDate(),
                                status: true,
                                parent_comment_id: null,
                              })
                            }
                          >
                            <i className="fa fa-location-arrow"></i> Review
                          </Button>
                        </Form>
                      </Col>
                      {movieComments?.map((item, index) => (
                        <div key={index} style={{ marginBottom: "20px" }}>
                          <MovieDetailComment
                            handleSubmitComment={handleSubmitComment}
                            data={item}
                            isParent
                            movieId={id}
                            userId={userId}
                          />
                        </div>
                      ))}
                    </Row>
                  </div>
                  <div id="cast" className="tab">
                    <Row style={{ marginLeft: "0px" }}>
                      {movieCasts?.map((item) => (
                        <Col
                          key={item.id}
                          md={3}
                          className="movie-item-style-2 movie-item-style-1"
                          style={{ margin: "0px" }}
                        >
                          <img src={item.img} alt="" />
                          <div className="hvr-inner">
                            <a href={`/castdetail/${item.id}`}>
                              Read more
                              <i className="ion-android-arrow-dropright"></i>
                            </a>
                          </div>
                          <div className="mv-item-infor">
                            <h6>
                              <a href={`cast/${item.id}`}>{item.name}</a>
                            </h6>
                          </div>
                        </Col>
                      ))}
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
