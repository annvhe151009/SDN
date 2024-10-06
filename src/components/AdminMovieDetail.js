import axios from "axios";
import { useEffect } from "react";
import { useState } from "react";
import { useParams } from "react-router-dom";

function AdminMovieDetail() {
  const [movieDetailOrigin, setMovieDetailOrigin] = useState({});
  const [movieDetailChange, setMovieDetailChange] = useState({});
  const [movieGenres, setMovieGenres] = useState([]);
  const [genres, setGenres] = useState([]);
  const [saveChangeMsg, setSaveChangeMsg] = useState("");
  const [addGenreErrorMsg, setAddGenreErrorMsg] = useState("");
  const { movieId } = useParams();
  const [selectGenreValue, setSelectGenreValue] = useState(1);

  useEffect(() => {
    fetchMovieGenre();
  }, []);

  const fetchMovieGenre = () => {
    axios
      // fetch all genre_id by movie_id
      .get(`http://localhost:9999/movie_genre?movie_id=${movieId}`)
      .then((response) => response.data)
      .then((dataF) => {
        const query = dataF.reduce(
          (query, curItem) => query + "id=" + curItem.genre_id + "&",
          ""
        );
        // fetch all genre item by genre_id
        axios
          .get(`http://localhost:9999/genre?${query}`)
          .then((response) => response.data)
          .then((data) => {
            setMovieGenres(
              dataF.map((item) => ({
                ...item,
                genreName: data?.find(
                  (itemGenre) => itemGenre.id === item.genre_id
                )?.name,
              }))
            );
          });
      });
  };

  useEffect(() => {
    axios
      .get(`http://localhost:9999/movie/${movieId}`)
      .then((response) => response.data)
      .then((data) => {
        setMovieDetailOrigin(data);
        setMovieDetailChange(data);
      });
  }, []);

  useEffect(() => {
    axios
      .get(`http://localhost:9999/genre`)
      .then((response) => response.data)
      .then((data) => {
        setGenres(data);
      });
  }, []);

  const onChangeMovieDetailChange = (prop, value) => {
    // Create a new object by spreading the existing state
    const updatedMovieDetailChange = { ...movieDetailChange };
    // Update the property
    updatedMovieDetailChange[prop] = value;
    // Set the updated object as the new state
    setMovieDetailChange(updatedMovieDetailChange);
  };

  const handleSaveChange = () => {
    axios
      .put(`http://localhost:9999/movie/${movieId}`, movieDetailChange)
      .then((response) => response.data)
      .then((data) => {
        setMovieDetailOrigin(data);
        setMovieDetailChange(data);
        setSaveChangeMsg("Save Change success full");
        setTimeout(() => setSaveChangeMsg(""), 3000);
      });
  };

  const handleDiscardChange = () => {
    const isConfirm = window.confirm("Are you sure discard change");
    if (isConfirm) {
      setMovieDetailChange(movieDetailOrigin);
    }
  };

  const handleDeteleMovieGenre = (id) => {
    axios.delete(`http://localhost:9999/movie_genre/${id}`).then((response) => {
      fetchMovieGenre();
    });
  };

  const handleAddMovieGenre = () => {
    if (
      selectGenreValue &&
      !movieGenres.some((item) => item.genre_id === selectGenreValue)
    ) {
      axios
        .post("http://localhost:9999/movie_genre", {
          movie_id: Number(movieId),
          genre_id: Number(selectGenreValue),
        })
        .then((response) => {
          fetchMovieGenre();
        });
    } else {
      setAddGenreErrorMsg("Genre is exits");
      setTimeout(() => {
        setAddGenreErrorMsg("");
      }, 3000);
    }
  };

  return (
    <div id="adminMovie">
      <form className="container">
        <div className="row">
          <div className="col-md-12">
            {saveChangeMsg && (
              <div class="alert alert-success fade in">
                <strong>Success!</strong> Save Change success full
              </div>
            )}
          </div>
          <div className="form-group col-md-6">
            <label>Name:</label>
            <input
              value={movieDetailChange.name}
              class="form-control"
              onChange={(e) =>
                onChangeMovieDetailChange("name", e.target.value)
              }
            ></input>
          </div>
          <div className="form-group col-md-6">
            <label>Status:</label>
            <br></br>
            <input
              type="radio"
              checked={movieDetailChange.status}
              name="status"
              onClick={() => onChangeMovieDetailChange("status", true)}
            />{" "}
            Active
            <input
              type="radio"
              checked={!movieDetailChange.status}
              name="status"
              style={{ marginLeft: 20 }}
              onClick={() => onChangeMovieDetailChange("status", false)}
            />{" "}
            Inactive
          </div>
          <div className="form-group col-md-12">
            <label>Description:</label>
            <textarea
              onChange={(e) =>
                onChangeMovieDetailChange("description", e.target.value)
              }
              class="form-control"
              rows="5"
              value={movieDetailChange.description}
            ></textarea>
          </div>
          <div className="form-group col-md-6">
            <label>Release Year:</label>
            <input
              class="form-control"
              value={movieDetailChange.release_year}
              onChange={(e) =>
                onChangeMovieDetailChange("release_year", e.target.value)
              }
            ></input>
          </div>
          <div className="form-group col-md-6">
            <label>Director:</label>
            <input
              class="form-control"
              value={movieDetailChange.director}
              onChange={(e) =>
                onChangeMovieDetailChange("director", e.target.value)
              }
            ></input>
          </div>
          <div className="form-group col-md-6">
            <label>
              Img URL:{" "}
              <a
                target="_blank"
                rel="noreferrer"
                href={movieDetailChange.img_url}
              >
                <i className="fa fa-eye"></i>
              </a>
            </label>
            <input
              class="form-control"
              value={movieDetailChange.img_url}
              onChange={(e) =>
                onChangeMovieDetailChange("img_url", e.target.value)
              }
            ></input>
          </div>
          <div className="form-group col-md-6">
            <label>
              Video URL:{" "}
              <a
                target="_blank"
                rel="noreferrer"
                href={movieDetailChange.trailers_url}
              >
                <i className="fa fa-eye"></i>
              </a>
            </label>
            <input
              class="form-control"
              value={movieDetailChange.trailers_url}
              onChange={(e) =>
                onChangeMovieDetailChange("trailers_url", e.target.value)
              }
            ></input>
          </div>
          <div className="form-group col-md-12">
            <button
              onClick={handleSaveChange}
              type="button"
              className="btn btn-primary"
            >
              Save Change
            </button>
            <button
              type="button"
              className="btn btn-warning"
              onClick={handleDiscardChange}
            >
              Discard Change
            </button>
          </div>
          <div className="form-group col-md-6" style={{ marginTop: 50 }}>
            <label>Genre:</label>
            <p style={{ color: "black" }}>
              {" "}
              {console.log(movieGenres)}
              {movieGenres?.map((item, index) => (
                <span key={item.id}>
                  {item?.genreName}
                  <i
                    className="fa fa-close text-danger"
                    onClick={() => handleDeteleMovieGenre(item.id)}
                  ></i>
                  {index < movieGenres?.length - 1 && ", "}
                </span>
              ))}
            </p>
            <select
              class="form-control"
              onChange={(e) => setSelectGenreValue(Number(e.target.value))}
            >
              {genres?.map((item) => (
                <option
                  selected={item.id === selectGenreValue}
                  key={item.id}
                  value={item.id}
                >
                  {item.name}
                </option>
              ))}
            </select>
            {addGenreErrorMsg && (
              <div class="alert alert-danger fade in" style={{ margin: 0 }}>
                <strong>Fail!</strong> {addGenreErrorMsg}
              </div>
            )}
            <button
              type="button"
              className="btn btn-primary"
              onClick={handleAddMovieGenre}
            >
              Add
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}

export default AdminMovieDetail;
