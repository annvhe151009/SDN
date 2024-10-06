import React, { useState } from "react";
import { Button, Col, Form, Image } from "react-bootstrap";
import { Link } from "react-router-dom";
import { getCurrentDate } from "./MovieDetailService";
import axios from "axios";
import { toast } from 'react-toastify';
function MovieDetailComment({
  data,
  isParent = false,
  handleSubmitComment,
  movieId,
  userId,
}) {
  const [showReplyForm, setShowReplyForm] = useState(false);
  const [newReply, setNewReply] = useState("");
  const [showMore, setShowMore] = useState("Show More");
  const [showReportForm, setShowReportForm] = useState(false);
  const [newReport, setNewReport] = useState("");
  const [message, setMessage] = useState("");

  const handleShowReplyForm = (e) => {
    e.preventDefault();
    setShowReplyForm(!showReplyForm);
  };

  const handleNewReplyChange = (e) => {
    setNewReply(e.target.value);
  };

  const handleShowMore = (e) => {
    e.preventDefault();
    setShowMore(showMore === "Show More" ? "Show Less" : "Show More");
  };

  const handleNewReplyKeyPress = (e, parentCommentId) => {
    if (e.key === "Enter") {
      e.preventDefault();
      if (newReply.trim() !== "") {
        handleSubmitComment({
          movie_id: movieId,
          user_id: userId,
          content: newReply,
          create_at: getCurrentDate(),
          status: true,
          parent_comment_id: parentCommentId,
        });
        setNewReply("");
        setShowReplyForm(false);
      }
    }
  };

  const handleShowReportForm = (e) => {
    e.preventDefault();
    setShowReportForm(true);
  };

  const handleReportSubmit = (e, commentId) => {
    e.preventDefault();

    // Validate the report reason
    if (newReport.trim() === "") {
      setMessage("Please enter a reason for the report.");
      return;
    }

    // Assuming you have a function to submit the report to the server
    axios
      .post(`http://localhost:9999/report`, {
        user_id: userId, // Assuming you have the user's ID
        comment_id: commentId,
        reason: newReport,
        create_at: getCurrentDate(),
        status: "Chờ xử lí",
      })
      .then(res => {
        if (res.status === 201)
        toast.success("Report submitted successfully")
    }).catch(err => console.error(err))

    // Close the report form after submission
    setShowReportForm(false);
  };



  return (
    <Col
      md={12}
      className="mv-user-review-item"
      style={isParent ? { marginBottom: "20px" } : { padding: "0" }}
    >
      <div className="user-infor">
        <Link to={`user/${data.user.id}`}>
          <img
            src={data.user.avatar}
            style={{ borderRadius: "100px", width: "28px", height: "28px" }}
            alt="img"
          />
        </Link>
        <span style={{ paddingLeft: "16px", color: "white" }}>
          <Link to={`user/${data.user.id}`}>{data.user.username}</Link>
        </span>
        <span style={{ padding: "0 16px" }} className="time">
          {data.create_at}
        </span>
        <a href="java" className="reply-link" onClick={handleShowReplyForm}>
          replies
        </a>
        <a href="" style={{ padding: "0 16px" }} onClick={handleShowReportForm}>
          report
        </a>
        {/* Report Form */}
        {showReportForm && (
          <Form>
            <Form.Group controlId="reportReason">
              <Form.Control
                type="text"
                placeholder="Enter reason for report"
                value={newReport} // You can change this to a different state if needed
                onChange={(e) => setNewReport(e.target.value)}
              />
            </Form.Group>
            {message ? <p className="text-danger">{message}</p> : ''}
            <Button variant="primary" onClick={(e) => handleReportSubmit(e, data.id)}>
              Submit Report
            </Button>
          </Form>
        )}
      </div>
      <p style={{ marginBottom: "4px", whiteSpace: "pre-line" }}>
        {data.content}
      </p>
      {isParent && data.replies.length !== 0 && (
        <a href="javascript" onClick={handleShowMore}>
          {showMore}
        </a>
      )}
      {showReplyForm && (
        <Form.Group controlId="comment">
          <Form.Control
            type="text"
            placeholder="Your Comment"
            value={newReply}
            onChange={handleNewReplyChange}
            onKeyPress={(e) => handleNewReplyKeyPress(e, data.id)}
          />
        </Form.Group>
      )}
      {(showMore !== "Show More" || !isParent) && (
        <div style={{ paddingLeft: "60px" }}>
          {data?.replies.map((item, index) => (
            <MovieDetailComment
              key={index}
              data={item}
              handleSubmitComment={handleSubmitComment}
              movieId={movieId}
              userId={userId}
            />
          ))}
        </div>
      )}


    </Col>
  );
}

export default MovieDetailComment;
