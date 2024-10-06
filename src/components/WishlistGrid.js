import React, { useState, useEffect } from "react";
import { Link } from 'react-router-dom';
import { Container, Row, Col, Button, Form } from "react-bootstrap";
import axios from 'axios';

export default function WishlistGrid() {
	const { id } = JSON.parse(localStorage.getItem("user"));
	const [movies, setMovies] = useState([]);
	const [sortOption, setSortOption] = useState('');
	const [usersRate, setUsersRate] = useState([]);
	const [visibleMovies, setVisibleMovies] = useState(8);

	useEffect(() => {
		const fetchData = async () => {
			try {
				const response = await axios.get(`http://localhost:9999/rate`);
				setUsersRate(response.data);
			} catch (error) {
				console.error(error);
			}
		};

		fetchData();
	}, []);

	useEffect(() => {
		const fetchData = async () => {
			try {
				const res = await axios.get(`http://localhost:9999/wishlist?user_id=${id}`);
				const data = res.data;
				const query = data.reduce(
					(query, curItem) => query + "id=" + curItem.movie_id + "&",
					""
				);

				const movieResponse = await axios.get(`http://localhost:9999/movie?${query}`);
				const movieData = movieResponse.data;

				let filteredMovies = movieData.map((movie) => {
					const ratings = usersRate.filter(item => item.movie_id === movie.id);
					const averageRating = ratings.length > 0
						? (ratings.reduce((total, cur) => (total + cur.rating), 0) / ratings.length).toFixed(1)
						: 0;

					return { ...movie, rate: averageRating };
				});

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
			} catch (error) {
				console.error("Error fetching data: " + error);
			}
		};

		fetchData();
	}, [id, usersRate, sortOption]);

	const handleScroll = () => {
		const { scrollTop, scrollHeight, clientHeight } = document.documentElement;

		if (scrollTop + clientHeight >= scrollHeight - 300) {
			setVisibleMovies((prevVisibleMovies) => prevVisibleMovies + 8);
		}
	};

	useEffect(() => {
		window.addEventListener('scroll', handleScroll);

		return () => {
			window.removeEventListener('scroll', handleScroll);
		};
	}, [handleScroll]);

	return (
		<div>
			<div className="topbar-filter">
				<p>
					Has <span>{movies.length} movies</span> in wishlist
				</p>
				<select value={sortOption} onChange={(e) => setSortOption(e.target.value)}>
					<option value="">Sort By</option>
					<option value="ratingDesc">Rating Descending</option>
					<option value="ratingAsc">Rating Ascending</option>
					<option value="yearDesc">Release Year Descending</option>
					<option value="yearAsc">Release Year Ascending</option>
				</select>
			</div>
			<div>
				<Row className="flex-wrap-movielist">
					{movies.slice(0, visibleMovies).map((movie) => (
						<Col key={movie.id} md={3} className="movie-item-style-2 movie-item-style-1">
							<img src={movie.img_url} alt={movie.name} />
							<div className="hvr-inner">
								<Link to={`/moviedetail/${movie.id}`}> Read more <i className="ion-android-arrow-dropright"></i> </Link>
							</div>
							<div className="mv-item-infor">
								<h6><Link to={`/moviesingle/${movie.id}`}>{movie.name}</Link></h6>
								<p className="rate"><i className="ion-android-star"></i><span>{movie.rate}</span> /10</p>
							</div>
						</Col>
					))}
				</Row>
			</div>
		</div>
	);
}
