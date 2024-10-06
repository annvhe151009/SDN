import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import "./Admin.css";

function AdminMovieList() {
  const searchRef = useRef();
  const [movies, setMovies] = useState([]);
  const [usersRate, setUsersRate] = useState([]);
  const [searchValue, setSearchValue] = useState("");
  const [sortObject, setSortObject] = useState({});

  useEffect(() => {
    axios.get(`http://localhost:9999/rate`).then((response) => {
      setUsersRate(response.data.filter((item) => item.rating));
    });
  }, []);

  useEffect(() => {
    searchRef.current.style.backgroundColor = "White";
    searchRef.current.style.color = "Black";
  }, []);

  useEffect(() => {
    let query = "";
    if (sortObject?.key) {
      query = `?_sort=${sortObject?.key}&_order=${sortObject?.value}`;
    }
    axios.get(`http://localhost:9999/movie${query}`).then((response) => {
      setMovies(response.data);
    });
  }, [sortObject]);

  const handleSortClick = (key, value) => {
    setSortObject({ key, value });
  };

  const handleSearchChange = (e) => {
    setSearchValue(e.target.value);
  };

  return (
    <div style={{ padding: "30px", minHeight: "99vh" }}>
      <input
        value={searchValue}
        ref={searchRef}
        className="form-control"
        id="myInput"
        type="text"
        placeholder="Search by name"
        style={{ marginBottom: "12px" }}
        onChange={handleSearchChange}
      />
      <table className="table table-hover table-striped">
        <thead>
          <tr>
            <th style={{ height: 45 }}>
              Name{" "}
              <i
                style={
                  sortObject?.key === "name" && sortObject?.value === "asc"
                    ? { color: "rgb(255,0,0)" }
                    : {}
                }
                className="fa fa-caret-up"
                onClick={() => handleSortClick("name", "asc")}
              ></i>
              <i
                style={
                  sortObject?.key === "name" && sortObject?.value === "desc"
                    ? { color: "rgb(255,0,0)" }
                    : {}
                }
                className="fa fa-caret-down"
                onClick={() => handleSortClick("name", "desc")}
              ></i>
            </th>
            <th>
              Release Year{" "}
              <i
                style={
                  sortObject?.key === "release_year" &&
                  sortObject?.value === "asc"
                    ? { color: "rgb(255,0,0)" }
                    : {}
                }
                className="fa fa-caret-up"
                onClick={() => handleSortClick("release_year", "asc")}
              ></i>
              <i
                style={
                  sortObject?.key === "release_year" &&
                  sortObject?.value === "desc"
                    ? { color: "rgb(255,0,0)" }
                    : {}
                }
                className="fa fa-caret-down"
                onClick={() => handleSortClick("release_year", "desc")}
              ></i>
            </th>
            <th>
              Description{" "}
              <i
                style={
                  sortObject?.key === "description" &&
                  sortObject?.value === "asc"
                    ? { color: "rgb(255,0,0)" }
                    : {}
                }
                className="fa fa-caret-up"
                onClick={() => handleSortClick("description", "asc")}
              ></i>
              <i
                style={
                  sortObject?.key === "description" &&
                  sortObject?.value === "desc"
                    ? { color: "rgb(255,0,0)" }
                    : {}
                }
                className="fa fa-caret-down"
                onClick={() => handleSortClick("description", "desc")}
              ></i>
            </th>
            <th>
              Director{" "}
              <i
                style={
                  sortObject?.key === "director" && sortObject?.value === "asc"
                    ? { color: "rgb(255,0,0)" }
                    : {}
                }
                className="fa fa-caret-up"
                onClick={() => handleSortClick("director", "asc")}
              ></i>
              <i
                style={
                  sortObject?.key === "director" && sortObject?.value === "desc"
                    ? { color: "rgb(255,0,0)" }
                    : {}
                }
                className="fa fa-caret-down"
                onClick={() => handleSortClick("director", "desc")}
              ></i>
            </th>
            <th>
              Rate{" "}
              <i
                style={
                  sortObject?.key === "rate" && sortObject?.value === "asc"
                    ? { color: "rgb(255,0,0)" }
                    : {}
                }
                className="fa fa-caret-up"
                onClick={() => handleSortClick("rate", "asc")}
              ></i>
              <i
                style={
                  sortObject?.key === "rate" && sortObject?.value === "desc"
                    ? { color: "rgb(255,0,0)" }
                    : {}
                }
                className="fa fa-caret-down"
                onClick={() => handleSortClick("rate", "desc")}
              ></i>
            </th>
          </tr>
        </thead>
        <tbody>
          {movies
            ?.filter((movie) =>
              movie.name.toLowerCase().includes(searchValue.toLowerCase())
            )
            .map((movie) => (
              <tr key={movie.id}>
                <td>
                  <Link to={`/admin/movie/${movie.id}`}>{movie.name}</Link>
                </td>
                <td>{movie.release_year}</td>
                <td>
                  {movie.description.length < 100
                    ? movie.description
                    : movie.description.slice(0, 100) + "..."}
                </td>
                <td>{movie.director}</td>
                <td>
                  <strong>
                    {(
                      usersRate
                        .filter((item) => item.movie_id === movie.id)
                        .reduce((total, cur) => total + cur.rating, 0) /
                      usersRate.filter((item) => item.movie_id === movie.id)
                        .length
                    ).toFixed(1)}
                    /10{" "}
                  </strong>
                  {` (by ${
                    usersRate.filter((item) => item.movie_id === movie.id)
                      .length
                  } users)`}
                </td>
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  );
}

export default AdminMovieList;
