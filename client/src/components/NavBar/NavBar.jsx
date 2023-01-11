import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Navbar,
  Container,
  Nav,
  Form,
  FormControl,
  Button,
  NavDropdown,
} from "react-bootstrap";
import axios from "axios";
import { FaSearch } from "react-icons/fa";
import Identicon from "react-identicons";
import "./NavBar.css";

export default function NavBar() {
  const navigate = useNavigate();

  const [loggedIn, setLoggedIn] = useState(false);
  const [googleLoggedIn, setGoogleLoggedIn] = useState(false);
  const [facebookLoggedIn, setFacebookLoggedIn] = useState(false);
  const [twitterLoggedIn, setTwitterLoggedIn] = useState(false);
  const [githubLoggedIn, setGithubLoggedIn] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [query, setQuery] = useState("");

  useEffect(() => {
    if (localStorage.getItem("token")) {
      setLoggedIn(true);
      axios
        .post(`${process.env.REACT_APP_BASE_URL}/user/data`, {
          token: localStorage.getItem("token"),
        })
        .then((res) => {
          setName(res.data.name);
          setEmail(res.data.email);
        })
        .catch((err) => {
          localStorage.removeItem("token");
          setLoggedIn(false);
        });
    }
  }, []);

  useEffect(() => {
    if (!localStorage.getItem("token")) {
      axios
        .get(`${process.env.REACT_APP_BASE_URL}/auth/google/getuser`, {
          withCredentials: true,
        })
        .then((res) => {
          localStorage.setItem("token", res.data.token);
          setGoogleLoggedIn(true);
          setName(res.data.displayName);
          setEmail(res.data.email);
        })
        .catch((e) => {
          console.log(e);
          setGoogleLoggedIn(false);
        });
    }
  }, []);

  useEffect(() => {
    if (!localStorage.getItem("token")) {
      axios
        .get(`${process.env.REACT_APP_BASE_URL}/auth/facebook/getuser`, {
          withCredentials: true,
        })
        .then((res) => {
          localStorage.setItem("token", res.data.token);
          setFacebookLoggedIn(true);
          setName(res.data.displayName);
          setEmail(res.data.email);
        })
        .catch((e) => {
          console.log(e);
          setFacebookLoggedIn(false);
        });
    }
  }, []);

  useEffect(() => {
    if (!localStorage.getItem("token")) {
      axios
        .get(`${process.env.REACT_APP_BASE_URL}/auth/twitter/getuser`, {
          withCredentials: true,
        })
        .then((res) => {
          localStorage.setItem("token", res.data.token);
          setTwitterLoggedIn(true);
          setName(res.data.displayName);
          setEmail(res.data.email);
        })
        .catch((e) => {
          console.log(e);
          setTwitterLoggedIn(false);
        });
    }
  }, []);

  useEffect(() => {
    if (!localStorage.getItem("token")) {
      console.log("inside");
      axios
        .get(`${process.env.REACT_APP_BASE_URL}/auth/github/getuser`, {
          withCredentials: true,
        })
        .then((res) => {
          localStorage.setItem("token", res.data.token);
          setGithubLoggedIn(true);
          console.log("inside2");
          setName(res.data.displayName);
          setEmail(res.data.email);
        })
        .catch((e) => {
          console.log(e);
          setGithubLoggedIn(false);
        });
    }
  }, []);

  const logout = () => {
    localStorage.removeItem("token");
    setLoggedIn(false);
    setGoogleLoggedIn(false);
    setFacebookLoggedIn(false);
    setTwitterLoggedIn(false);
    setGithubLoggedIn(false);
    axios
      .get(`${process.env.REACT_APP_BASE_URL}/auth/google/logout`, {
        withCredentials: true,
      })
      .then((res) => navigate("/"))
      .catch((e) => console.log(e));
    navigate("/");
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (!query) return;
    navigate(`/search/${query}`);
  };

  return (
    <>
      <Navbar collapseOnSelect expand="lg" sticky="top" variant="dark">
        <Container>
          <Navbar.Brand
            onClick={() => {
              navigate("/");
            }}
          >
            BlogsApp
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="responsive-navbar-nav" />
          <Navbar.Collapse>
            {/* Search Bar */}
            <Nav className="me-auto">
              <Form
                className="d-flex"
                onSubmit={(e) => {
                  handleSearch(e);
                }}
              >
                <FormControl
                  type="search"
                  placeholder="Search"
                  className="me-2"
                  aria-label="Search"
                  value={query}
                  onChange={(e) => {
                    setQuery(e.target.value);
                  }}
                />
                <Button type="submit" variant="success">
                  <FaSearch />
                </Button>
              </Form>
            </Nav>

            {loggedIn ||
            googleLoggedIn ||
            facebookLoggedIn ||
            twitterLoggedIn ||
            githubLoggedIn ? (
              <Nav>
                <Nav.Link>
                  <Button
                    variant="success"
                    className="new-post"
                    onClick={() => {
                      navigate("/new");
                    }}
                  >
                    Create New Post
                  </Button>
                </Nav.Link>
                <NavDropdown
                  align={{ lg: "end" }}
                  title={
                    <Identicon className="user-icon" string={email} size={40} />
                  }
                >
                  <NavDropdown.Item>{name}</NavDropdown.Item>
                  <NavDropdown.Divider />
                  <NavDropdown.Item
                    onClick={() => {
                      navigate("/profile");
                    }}
                  >
                    Profile
                  </NavDropdown.Item>
                  <NavDropdown.Item onClick={logout}>Logout</NavDropdown.Item>
                </NavDropdown>
              </Nav>
            ) : (
              <Nav>
                <Nav.Link>
                  <Button
                    variant="success"
                    className="login"
                    onClick={() => {
                      navigate("/login");
                    }}
                  >
                    Login
                  </Button>
                </Nav.Link>
                <Nav.Link>
                  <Button
                    variant="success"
                    className="signup"
                    onClick={() => {
                      navigate("/signup");
                    }}
                  >
                    Signup
                  </Button>
                </Nav.Link>
              </Nav>
            )}
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </>
  );
}
