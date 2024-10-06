import React, { useEffect, useState } from "react";
import { Container, Row, Col, Form, InputGroup } from "react-bootstrap";
import Slider from 'rc-slider';
import 'rc-slider/assets/index.css';
import axios from 'axios';
export default function Filter() {
  const [genres, setGenres] = useState([]);
  
  useEffect(() => {
	axios.get("http://localhost:9999/genre")
		.then((res) => setGenres(res.data))
		.catch((err) => console.error(err));
}, []);

  const handle = (value) => {
    // Handle the slider value change
    console.log(value);
  };

  const getCurrentYear = new Date().getFullYear();

  return (
    <div style={{ paddingTop: '280px' }}>
      <div className="sidebar">
        <div className="search-form">
          <h4 className="sb-title">Search for movie</h4>
          <Form className="form-style-1" action="#">
            <Row>
              <Col md={12} className="form-it">
                <Form.Group controlId="genres">
                  <Form.Label>Genres</Form.Label>
                  <InputGroup style={{ width: '100%' }}>
                    {genres.map((genre) => (
                      <Form.Check
                        style={{ display: 'flex', alignItems: 'end' }}
                        key={genre.id}
                        type="checkbox"
                        id={genre.id}
                        label={`\u00A0\u00A0${genre.name}`}
                      />
                    ))}
                  </InputGroup>
                </Form.Group>
              </Col>
              <Col md={12} className="form-it">
                <Form.Group controlId="ratingRange">
                  <Form.Label>Rating Range</Form.Label>
                  <Slider
                    range
                    defaultValue={[0, 10]}
                    min={0}
                    max={10}
                    step={1}
                    onChange={handle}
                    marks={{ 0: '0', 10: '10' }}
                    handleStyle={{
                      borderColor: '#00bcd4',
                      height: 20,
                      width: 20,
                      marginLeft: 0,
                      marginTop: -8,
                      backgroundColor: '#00bcd4',
                    }}
                  />
                </Form.Group>
              </Col>
              <Col md={12} className="form-it">
                <Form.Group controlId="releaseYear">
                  <Form.Label>Release Year</Form.Label>
                  <Slider
                    range
                    defaultValue={[1900, getCurrentYear]}
                    min={1900}
                    max={getCurrentYear}
                    step={1}
                    onChange={handle}
                    marks={{ 1900: '1900', [getCurrentYear]: `${getCurrentYear}` }}
                    handleStyle={{
                      borderColor: '#00bcd4',
                      height: 20,
                      width: 20,
                      marginLeft: 0,
                      marginTop: -8,
                      backgroundColor: '#00bcd4',
                    }}
                  />
                </Form.Group>
              </Col>
            </Row>
          </Form>
        </div>
        <div className="ads">
          <img src="images/uploads/ads1.png" alt="" />
        </div>
        <div className="sb-facebook sb-it">
          <h4 className="sb-title">Find us on Facebook</h4>
          <iframe
            src="#"
            data-src="https://www.facebook.com/plugins/page.php?href=https%3A%2F%2Fwww.facebook.com%2Ftemplatespoint.net%2F%3Ffref%3Dts&tabs=timeline&width=340&height=315px&small_header=true&adapt_container_width=false&hide_cover=false&show_facepile=true&appId"
            height="315"
            style={{ width: '100%', border: 'none', overflow: 'hidden' }}
          ></iframe>
        </div>
      </div>
    </div>
  );
}
