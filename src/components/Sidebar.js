import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import axios from 'axios'
import { toast } from 'react-toastify';


export default function Sidebar() {
    const user = JSON.parse(localStorage.getItem('user'));
    const [avatar, setAvatar] = useState(user ? user.avatar : 'images/uploads/user-img.png');

    const handleLogout = () => {
        localStorage.removeItem('user');
        window.location.href = "/";
    };

    const handleAvatarChange = (e) => {
        const selectedFile = e.target.files[0];

        if (selectedFile) {
            const prefix = '/images/uploads/';
            const newAvatarName = prefix + selectedFile.name;

            setAvatar(URL.createObjectURL(selectedFile));
            const updatedUser = {
                ...user,
                avatar: newAvatarName,
            };
            axios.put(`http://localhost:9999/user/${user.id}`, updatedUser)
            .then((response) => {
                if (response.status == 200) {
                    // Handle success, e.g., show a success message
                    toast.success("Avatar updated successfully!");
                    localStorage.setItem("user", JSON.stringify(updatedUser));
                } else {
                    // Handle errors, e.g., show an error message
                    toast.error("Error updating avatar");
                }
            })
            .catch((error) => {
                // Handle errors, e.g., show an error message
                console.error("Error updating avatar: " + error);
            });

            

            localStorage.setItem('user', JSON.stringify(updatedUser));
            console.log("Selected file:", selectedFile);
            console.log("New avatar name:", newAvatarName);
        }
    };

    const location = useLocation();

    return (
        <div className="user-information">
            <div className="user-img">
                <Link to="#">
                <img src={avatar} alt="User Avatar" height={120} width={120} style={{ borderRadius: '50%' }} />

                    <br />
                </Link>
                <label htmlFor="avatar-upload" className="btn btn-danger">
                    Change avatar
                    <input
                        type="file"
                        id="avatar-upload"
                        accept="image/*"
                        style={{ display: "none" }}
                        onChange={handleAvatarChange}
                    />
                </label>
            </div>
            <div className="user-fav">
                <p>Account Details</p>
                <ul className="list-group">
                    <li className={`list-group-item ${location.pathname === '/userprofile' ? 'active' : ''}`}>
                        <Link to="/userprofile">Profile</Link>
                    </li>
                    <li className={`list-group-item ${location.pathname === '/wishlist' ? 'active' : ''}`}>
                        <Link to="/wishlist">Wish List</Link>
                    </li>
                    <li className={`list-group-item ${location.pathname === '/movierated' ? 'active' : ''}`}>
                        <Link to="/movierated">Rated Movies</Link>
                    </li>
                </ul>
            </div>
            <div className="user-fav">
                <p>Others</p>
                <ul className="list-group">
                    <li className={`list-group-item ${location.pathname === '/changepassword' ? 'active' : ''}`}>
                        <Link to="/changepassword">Change password</Link>
                    </li>
                    <li className="list-group-item">
                        <Link to="/" onClick={handleLogout}>Log out</Link>
                    </li>
                </ul>
            </div>
        </div>
    );
}
