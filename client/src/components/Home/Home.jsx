import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Container, Card } from "react-bootstrap";
import { AiOutlineHeart } from "react-icons/ai";
import { FaRegComment } from "react-icons/fa";
import { Comment } from "react-loader-spinner";
import axios from "axios";
import NavBar from "../NavBar/NavBar";
import Footer from "../Footer/Footer";
import "./Home.css";

export default function Home() {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [blogs, setBlogs] = useState([]);

  useEffect(() => {
    axios
      .get(`${process.env.REACT_APP_BASE_URL}/user/posts`)
      .then((res) => {
        setBlogs(res.data.blogs);
        setInterval(() => {
          setLoading(false);
        }, 1000);
      })
      .catch((err) => {
        console.log(err);
        setInterval(() => {
          setLoading(false);
        }, 1000);
      });
  }, []);

  const handlePost = (id) => {
    navigate(`/blog/${id}`);
  };

  return (
    <>
      <NavBar />
      <div className="home-container">
        <h1 className="main-heading">Recent Blogs</h1>
        {loading ? (
          <div className="loader">
            <Comment
              visible={true}
              height="80"
              width="80"
              ariaLabel="comment-loading"
              wrapperStyle={{}}
              wrapperClass="comment-wrapper"
              color="#eee"
              backgroundColor="#6860d6"
            />
          </div>
        ) : (
          <Container>
            {blogs.length > 0 ? (
              blogs.reverse().map((blog) => {
                return (
                  <Card
                    className="blog-card"
                    key={blog._id}
                    onClick={() => {
                      handlePost(blog._id);
                    }}
                  >
                    {blog.cloudinaryId ? (
                      <Card.Img variant="top" src={blog.image} />
                    ) : null}
                    <Card.Body>
                      <h1>{blog.title}</h1>
                      <div className="blog-info">{blog.author}</div>
                      <div className="blog-info">
                        {new Date(blog.created_at).toDateString()}
                      </div>
                      <div className="blog-items">
                        <span>
                          <AiOutlineHeart /> {blog.likes.length} Likes
                        </span>
                        <span>
                          <FaRegComment /> {blog.comments.length} Comments
                        </span>
                      </div>
                    </Card.Body>
                  </Card>
                );
              })
            ) : (
              <>
                <h1>No Blogs Avaliable</h1>
                <p>Write Your own Blog !!</p>
              </>
            )}
          </Container>
        )}
      </div>
      <Footer />
    </>
  );
}
