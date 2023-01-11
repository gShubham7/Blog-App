import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Container, Card, Form, Button, Spinner } from "react-bootstrap";
import axios from "axios";
import NavBar from "../NavBar/NavBar";
import Footer from "../Footer/Footer";
import "./Login.css";

export default function Login() {
  const navigate = useNavigate();

  const [validated, setValidated] = useState(false);
  const [error, setError] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (localStorage.getItem("token")) {
      navigate("/");
    }
  }, [navigate]);

  const handleSubmit = (event) => {
    const form = event.currentTarget;
    event.preventDefault();
    setSubmitting(true);
    if (form.checkValidity() === false) {
      event.stopPropagation();
      setSubmitting(false);
      return;
    }

    axios
      .post(`${process.env.REACT_APP_BASE_URL}/auth/login`, {
        email,
        password,
      })
      .then((res) => {
        localStorage.setItem("token", res.data.token);
        setSubmitting(false);
        navigate("/");
      })
      .catch((err) => {
        setSubmitting(false);
        setError(true);
        setErrorMsg(err.response.data.error);
        setTimeout(() => {
          setError(false);
          setErrorMsg("");
        }, 3000);
      });

    setValidated(true);
  };

  const googleLogin = () => {
    window.open(`${process.env.REACT_APP_BASE_URL}/auth/google`, "_self");
  };

  return (
    <>
      <NavBar />

      <Container className="login-container">
        <Card>
          <Card.Body>
            <Card.Title>Login</Card.Title>
            <Form noValidate validated={validated} onSubmit={handleSubmit}>
              <Form.Group className="mb-3">
                <Form.Label>Email address</Form.Label>
                <Form.Control
                  style={{ width: "100%" }}
                  type="email"
                  placeholder="Enter email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
                <Form.Control.Feedback type="invalid">
                  Please provide email
                </Form.Control.Feedback>
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Password</Form.Label>
                <Form.Control
                  style={{ width: "100%" }}
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <Form.Control.Feedback type="invalid">
                  Please enter password
                </Form.Control.Feedback>
              </Form.Group>
              <div className="d-flex justify-content-center">
                <Button
                  style={{ width: "50%" }}
                  variant="primary"
                  type="submit"
                  {...(submitting ? { disabled: true } : {})}
                >
                  {submitting ? (
                    <Spinner as="span" animation="border" role="status" />
                  ) : (
                    "Submit"
                  )}
                </Button>
              </div>
              <p
                style={{
                  textAlign: "center",
                  fontWeight: "bold",
                  margin: "10px",
                }}
              >
                ------ Or login with ------
              </p>
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                }}
              >
                <div>
                  <img
                    src="https://cdn-icons-png.flaticon.com/512/2702/2702602.png"
                    alt="google"
                    style={{ width: "30px", margin: "20px" }}
                    onClick={googleLogin}
                  />
                </div>
                <div>
                  <img
                    src="https://cdn-icons-png.flaticon.com/512/145/145802.png"
                    alt="facebook"
                    style={{ width: "30px", margin: "20px" }}
                  />
                </div>
                <div>
                  <img
                    src="https://cdn-icons-png.flaticon.com/512/3670/3670151.png"
                    alt="twitter"
                    style={{ width: "30px", margin: "20px" }}
                  />
                </div>
                <div>
                  <img
                    src="https://cdn-icons-png.flaticon.com/512/25/25231.png"
                    alt="github"
                    style={{ width: "30px", margin: "20px" }}
                  />
                </div>
              </div>
            </Form>
            <div className="error">{error && <p>{errorMsg}</p>}</div>
          </Card.Body>
        </Card>
      </Container>

      <Footer />
    </>
  );
}
