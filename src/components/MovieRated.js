import React, { useState, useEffect } from "react";
import { Link } from 'react-router-dom';
import { Container, Row, Col, Button, Form, Card, Image } from "react-bootstrap";
import axios from 'axios';

export default function MovieRated() {
  const { id } = JSON.parse(localStorage.getItem("user"));
  const [sortOption, setSortOption] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const [movies, setMovies] = useState([]);
  const [movieComments, setMovieComments] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res1 = await axios.get(`http://localhost:9999/rate?user_id=${id}`);
        const res2 = await axios.get(`http://localhost:9999/comment?user_id=${id}`);

        const movieIds = Array.from(new Set([
          ...res1.data.map(x => x.movie_id),
          ...res2.data.map(x => x.movie_id)
        ]));

        const query = movieIds.reduce(
          (query, movieId) => query + "id=" + movieId + "&",
          ""
        );

        const movieResponse = await axios.get(`http://localhost:9999/movie?${query}`);
        const movieData = movieResponse.data;

        const filteredMovies = await Promise.all(movieData.map(async (movie) => {
          const ratings = await axios.get(`http://localhost:9999/rate?user_id=${id}&movie_id=${movie.id}`);
          return {
            ...movie,
            rate: ratings.data.length > 0 ? ratings.data[0].rating : 0
          };
        }));

        // Apply sorting
        switch (sortOption) {
          case 'ratingDesc':
            filteredMovies.sort((a, b) => b.rate - a.rate);
            break;
          case 'ratingAsc':
            filteredMovies.sort((a, b) => a.rate - b.rate);
            break;
          case 'yearDesc':
            filteredMovies.sort((a, b) => new Date(b.release_year) - new Date(a.release_year));
            break;
          case 'yearAsc':
            filteredMovies.sort((a, b) => new Date(a.release_year) - new Date(b.release_year));
            break;
          default:
            break;
        }

        setMovies(filteredMovies);
        fetchCommentsForMovies(movieIds);
      } catch (error) {
        console.error("Error fetching data: " + error);
      }
    };

    const fetchCommentsForMovies = async (movieIds) => {
      try {
        const commentsForMovies = await Promise.all(
          movieIds.map(async (movieId) => {
            const response = await axios.get(`http://localhost:9999/comment?movie_id=${movieId}`);
            return { movieId, comments: response.data, showAll: false };
          })
        );

        const commentsMap = {};
        commentsForMovies.forEach((item) => {
          commentsMap[item.movieId] = {
            comments: item.comments,
            showAll: item.showAll,
          };
        });

        setMovieComments(commentsMap);
      } catch (error) {
        console.error('Error fetching comments for movies:', error);
      }
    };

    fetchData();
  }, [id, sortOption]);

  const handleToggleComments = (movieId) => {
    setMovieComments((prevComments) => ({
      ...prevComments,
      [movieId]: {
        comments: prevComments[movieId] ? prevComments[movieId].comments : [],
        showAll: !prevComments[movieId]?.showAll,
      },
    }));
  };

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  const getPaginatedMovies = () => {
    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    return movies.slice(startIndex, endIndex);
  };

  return (
    <div>
      <div className="topbar-filter">
        <p>Found <span>{movies.length} rates</span> in total</p>
        <Form.Select value={sortOption} onChange={(e) => setSortOption(e.target.value)}>
          <option value="">Sort By</option>
          <option value="ratingDesc">Rating Descending</option>
          <option value="ratingAsc">Rating Ascending</option>
          <option value="yearDesc">Release Year Descending</option>
          <option value="yearAsc">Release Year Ascending</option>
        </Form.Select>
      </div>
      <Row>
        {getPaginatedMovies().map((movie) => (
          <Col key={movie.id} md={12}>
            <Card className="movie-item-style-2 userrate">
              <Image src={movie.img_url} alt={movie.name} />
              <Card.Body className="mv-item-infor">
                <Card.Title as={Link} to={`/moviedetail/${movie.id}`}>
                  {movie.name} <span>({movie.release_year})</span>
                </Card.Title>
                {movie.rate > 0 && (
                  <div>
                    <p className="time sm-text">Your rate:</p>
                    <p className="rate">
                      <i className="ion-android-star"></i>
                      <span>{movie.rate}</span> /10
                    </p>
                  </div>
                )}
                <Card.Text>
                  <p className="time sm-text">Your review:</p>
                  {movieComments[movie.id] &&
                    (movieComments[movie.id].showAll
                      ? movieComments[movie.id].comments.map((comment) => (
                          <div key={comment.id}>
                            <p>Posted on: {comment.create_at}</p>
                            <p>{comment.content}</p>
                            {/* Render additional comment details as needed */}
                          </div>
                        ))
                      : movieComments[movie.id].comments.slice(0, 3).map((comment) => (
                          <div key={comment.id}>
                            <p>Posted on: {comment.create_at}</p>
                            <p>{comment.content}</p>
                            {/* Render additional comment details as needed */}
                          </div>
                        )))}
                  {movieComments[movie.id] && movieComments[movie.id].comments.length > 3 && (
                    <Button
                      variant="link"
                      onClick={() => handleToggleComments(movie.id)}
                    >
                      {movieComments[movie.id].showAll ? "Hide Comments" : "Show All Comments"}
                    </Button>
                  )}
                </Card.Text>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
      <div className="topbar-filter">
        <Form.Label>Movies per page:</Form.Label>
        <Form.Select onChange={(e) => setPageSize(e.target.value)}>
          <option value="5">5 Movies</option>
          <option value="10">10 Movies</option>
        </Form.Select>
        <div className="pagination2">
          <span>Page {currentPage} of {Math.ceil(movies.length / pageSize)}:</span>
          {Array.from({ length: Math.ceil(movies.length / pageSize) }, (_, index) => (
            <Button
              key={index + 1}
              className={currentPage === index + 1 ? "active" : ""}
              onClick={() => handlePageChange(index + 1)}
            >
              {index + 1}
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
}
