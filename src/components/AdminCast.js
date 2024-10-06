import axios from "axios";
import Handle from "rc-slider/lib/Handles/Handle";
import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import './Admin.css';


function AdminCast() {
    const searchRef = useRef();
    const [cast, setCast] = useState([]);
    const [isPopupOpen, setPopupOpen] = useState(false);
    const [searchValue, setSearchValue] = useState("");
    const [sortObject, setSortObject] = useState({});

    useEffect(() => {
        let query = "";
        if (sortObject?.key) {
            query = `?_sort=${sortObject?.key}&_order=${sortObject?.value}`;
        }
        axios
            .get(`http://localhost:9999/cast${query}`)
            .then((response) => response.data)
            .then((data) => setCast(data));
    }, [sortObject]);

    const handleSortClick = (key, value) => {
        setSortObject({ key, value });
    };
    
    const openPopup = () => {
        setPopupOpen(true);
    };

    // Function to close the popup
    const closePopup = () => {
        setPopupOpen(false);
    };

    // Handle Edit function
    const handleEdit = (id) => {
        // Open the popup when the Edit button is clicked
        openPopup();
        // You can fetch the cast member data by ID and pre-fill the form here.
        // Make an Axios request if needed.
    };

    // Handle form submission
    const handleSubmit = (event) => {
        event.preventDefault();
        // Handle the form submission, e.g., make an Axios request to update the data.
        // Close the popup when the form is submitted.
        closePopup();
    };

    const handleDelete = (id) => {
        if (window.confirm("Are you sure you want to delete this cast member?")) {
            // Use Axios to send a DELETE request to your server
            axios
                .delete(`http://localhost:9999/cast/${id}`)
                .then((response) => {
                    if (response.status === 200) {
                        // If the request is successful, you can remove the deleted item from the state
                        setCast((prevCast) => prevCast.filter((c) => c.id !== id));
                    } else {
                        console.error("Failed to delete cast member");
                    }
                })
                .catch((error) => {
                    console.error("Error deleting cast member: ", error);
                });
        }
    };
    


    return (
        <div style={{ padding: "30px", minHeight: "99vh" }}>
            <input
                value={searchValue}
                ref={searchRef}
                className="form-control"
                id="myInput"
                type="text"
                placeholder="Search.."
                style={{ marginBottom: "12px" }}
                onChange={(e) => setSearchValue(e.target.value)}
            ></input>
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
                            Image{" "}

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
                            DOB{" "}
                            <i
                                style={
                                    sortObject?.key === "dob" && sortObject?.value === "asc"
                                        ? { color: "rgb(255,0,0)" }
                                        : {}
                                }
                                className="fa fa-caret-up"
                                onClick={() => handleSortClick("dob", "asc")}
                            ></i>
                            <i
                                style={
                                    sortObject?.key === "dob" && sortObject?.value === "desc"
                                        ? { color: "rgb(255,0,0)" }
                                        : {}
                                }
                                className="fa fa-caret-down"
                                onClick={() => handleSortClick("dob", "desc")}
                            ></i>
                        </th>
                        <th>
                            Country{" "}

                        </th>
                        <th>
                            Status{" "}

                        </th>
                        <th>
                            Action{" "}

                        </th>

                    </tr>
                </thead>
                <tbody>
                    {cast
                        ?.filter((c) => {
                            return (
                                c.name.toLowerCase().includes(searchValue.toLowerCase()) ||
                                c.description.toLowerCase().includes(searchValue.toLowerCase()) ||
                                c.dob.toLowerCase().includes(searchValue.toLowerCase())
                            );
                        })
                        .map((c) => (
                            <tr key={c.id}>
                                <td>
                                    <Link to={``}>{c.name}</Link>
                                </td>
                                <td><img
                                    src={c.img}

                                    style={{ width: '60px', height: 'auto' }}
                                /></td>
                                <td>
                                    {c.description.length < 100
                                        ? c.description
                                        : c.description.slice(0, 100) + "..."}
                                </td>
                                <td>{c.dob}</td>
                                <td>
                                    {c.country}
                                </td>
                                <td>
                                    {c.status ? "Active" : "No Active"}
                                </td>
                                <td>
                                <button onClick={() => handleEdit(c.id)}>Edit</button>
                                    <button onClick={() => handleDelete(c.id)}>Delete</button>
                                </td>

                            </tr>
                        ))}
                </tbody>
            </table>
            <div>
            {/* Render the table as before */}
            {/* ... */}
            
            {isPopupOpen && (
                <div className="popup-background">
                    <div className="popup">
                        <div className="text-center mb-2">
                            <h1 className="fw-bold">Edit Cast Member</h1>
                        </div>
                        <form className="row" onSubmit={handleSubmit}>
                            {/* Form fields go here */}
                        </form>
                        <button className="btn btn-danger" onClick={closePopup}>
                            Close
                        </button>
                    </div>
                </div>
            )}
        </div>
        </div>

        
    );
    
}

export default AdminCast;
