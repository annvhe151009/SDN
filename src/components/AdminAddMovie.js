import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

function AdminAddMovie() {
  const navigate = useNavigate();
  const [movieDetail, setMovieDetail] = useState({
    name: "",
    status: true,
    description: "",
    release_year: "",
    director: "",
    img_url: "",
    trailers_url: "",
  });

  const onChangeMovieDetail = (prop, value) => {
    // Create a new object by spreading the existing state
    const updatedMovieDetail = { ...movieDetail };
    // Update the property
    updatedMovieDetail[prop] = value;
    // Set the updated object as the new state
    setMovieDetail(updatedMovieDetail);
  };

  const handleSaveChange = () => {
    axios
      .post(`http://localhost:9999/movie`, movieDetail)
      .then((response) => response.data)
      .then((data) => {
        navigate(`/admin/movie/${data.id}`);
      });
  };

  const handleDiscardChange = () => {
    const isConfirm = window.confirm("Are you sure discard change");
    if (isConfirm) {
      setMovieDetail({
        name: "",
        status: true,
        description: "",
        release_year: "",
        director: "",
        img_url: "",
        trailers_url: "",
      });
    }
  };

  return (
    <div id="adminMovie">
      <form className="container">
        <div className="row">
          <div className="form-group col-md-6">
            <label>Name:</label>
            <input
              value={movieDetail.name}
              class="form-control"
              onChange={(e) => onChangeMovieDetail("name", e.target.value)}
            ></input>
          </div>
          <div className="form-group col-md-6">
            <label>Status:</label>
            <br></br>
            <input
              type="radio"
              checked={movieDetail.status}
              name="status"
              onClick={() => onChangeMovieDetail("status", true)}
            />{" "}
            Active
            <input
              type="radio"
              checked={!movieDetail.status}
              name="status"
              style={{ marginLeft: 20 }}
              onClick={() => onChangeMovieDetail("status", false)}
            />{" "}
            Inactive
          </div>
          <div className="form-group col-md-12">
            <label>Description:</label>
            <textarea
              onChange={(e) =>
                onChangeMovieDetail("description", e.target.value)
              }
              class="form-control"
              rows="5"
              value={movieDetail.description}
            ></textarea>
          </div>
          <div className="form-group col-md-6">
            <label>Release Year:</label>
            <input
              class="form-control"
              value={movieDetail.release_year}
              onChange={(e) =>
                onChangeMovieDetail("release_year", e.target.value)
              }
            ></input>
          </div>
          <div className="form-group col-md-6">
            <label>Director:</label>
            <input
              class="form-control"
              value={movieDetail.director}
              onChange={(e) => onChangeMovieDetail("director", e.target.value)}
            ></input>
          </div>
          <div className="form-group col-md-6">
            <label>
              Img URL:{" "}
              <a target="_blank" rel="noreferrer" href={movieDetail.img_url}>
                <i className="fa fa-eye"></i>
              </a>
            </label>
            <input
              class="form-control"
              value={movieDetail.img_url}
              onChange={(e) => onChangeMovieDetail("img_url", e.target.value)}
            ></input>
          </div>
          <div className="form-group col-md-6">
            <label>
              Video URL:{" "}
              <a
                target="_blank"
                rel="noreferrer"
                href={movieDetail.trailers_url}
              >
                <i className="fa fa-eye"></i>
              </a>
            </label>
            <input
              class="form-control"
              value={movieDetail.trailers_url}
              onChange={(e) =>
                onChangeMovieDetail("trailers_url", e.target.value)
              }
            ></input>
          </div>
          <div className="form-group col-md-12">
            <button
              onClick={handleSaveChange}
              type="button"
              className="btn btn-primary"
            >
              Add Movie
            </button>
            <button
              type="button"
              className="btn btn-warning"
              onClick={handleDiscardChange}
            >
              Discard Change
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}

export default AdminAddMovie;
