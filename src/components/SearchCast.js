import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Container, Row, Col, Form, InputGroup } from 'react-bootstrap';
import axios from 'axios';
import Slider from 'rc-slider';
import 'rc-slider/assets/index.css';

const SearchCast = () => {
    const [casts, setCasts] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const location = useLocation();
    const [visibleMovies, setVisibleMovies] = useState(12); // Number of movies to display initially
    const [sortOption, setSortOption] = useState(''); // Default sort by popularity

    useEffect(() => {
        const fetchData = async () => {
            try {
                const searchQuery = new URLSearchParams(location.search).get('search');
                setSearchTerm(searchQuery);

                const castsResponse = await axios.get('http://localhost:9999/cast');
                const casts = castsResponse.data;

                let filteredCasts = casts.filter((p) => p.name.toLowerCase().includes(searchTerm.toLowerCase()));
                console.log(filteredCasts)
                switch (sortOption) {
                    case 'Desc':
                        filteredCasts.sort((a, b) => b.name.localeCompare(a.name));
                        break;
                    case 'Asc':
                        filteredCasts.sort((a, b) => a.name.localeCompare(b.name));
                        break;
                    default:
                        break;
                }

                setCasts(filteredCasts);
                setVisibleMovies(12);
            } catch (error) {
                console.error(error);
            }
        };

        fetchData();
    }, [location.search, sortOption]);

    const handleScroll = () => {
        const { scrollTop, scrollHeight, clientHeight } = document.documentElement;

        if (scrollTop + clientHeight >= scrollHeight - 240) {
            setVisibleMovies((prevVisibleMovies) => prevVisibleMovies + 12);
        }
    };

    useEffect(() => {
        window.addEventListener('scroll', handleScroll);

        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, [handleScroll]);

    const fetchMoviesBySearchTerm = async (newSearchTerm) => {
        try {
                const castsResponse = await axios.get('http://localhost:9999/cast');
                const casts = castsResponse.data;

                let filteredCasts = casts.filter((p) => p.name.toLowerCase().includes(newSearchTerm.toLowerCase()));
                console.log(filteredCasts)
                switch (sortOption) {
                    case 'Desc':
                        filteredCasts.sort((a, b) => b.name.localeCompare(a.name));
                        break;
                    case 'Asc':
                        filteredCasts.sort((a, b) => a.name.localeCompare(b.name));
                        break;
                    default:
                        break;
                }

            setCasts(filteredCasts);
            setVisibleMovies(12);
        } catch (error) {
            console.error(error);
        }
    };

    const handleSearchInputChange = (e) => {
        const newSearchTerm = e.target.value;
        fetchMoviesBySearchTerm(newSearchTerm);
    };
    
    return (
        <Row>
            <Col md={1}></Col>
            <Col md={10} style={{ paddingTop: '240px' }}>
                <Form.Control
                    type="text"
                    placeholder="Search..."
                    onChange={handleSearchInputChange}
                    style={{
                        backgroundColor: '#000',
                        color: '#fff',
                        width: '24%',
                        marginBottom: '20px'
                    }}
                />
                <div className="topbar-filter">
                    <p>Found <span>{casts.length} casts</span> in total</p>
                    <select value={sortOption} onChange={(e) => setSortOption(e.target.value)}>
                        <option value="">Sort By</option>
                        <option value="Asc">Sort A - Z</option>
                        <option value="Desc">Sort Z- A</option>
                    </select>
                </div>
                <div>
                    <Row className="flex-wrap-movielist">
                        {casts.slice(0, visibleMovies).map((cast) => (
                            <Col key={cast.id} md={2} className="movie-item-style-2 movie-item-style-1">
                                <img src={cast.img} alt={cast.name} />
                                <div className="hvr-inner">
                                    <Link to={`/castdetail/${cast.id}`}> Read more <i className="ion-android-arrow-dropright"></i> </Link>
                                </div>
                                <div className="mv-item-infor">
                                    <h4><Link to={`/castdetail/${cast.id}`} style={{color: 'white'}}>{cast.name}</Link></h4>
                                </div>
                            </Col>
                        ))}
                    </Row>
                </div>
            </Col>
            
        </Row>
    );
};

export default SearchCast;
