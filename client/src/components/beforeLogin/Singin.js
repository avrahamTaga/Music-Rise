import React, { Component } from "react";
import { Container, Form, Button, Col } from "react-bootstrap";
import axios from "axios";

class Singin extends Component {
  state = {
    fullName: "",
    email: "",
    age: 0,
    password: 0,
    confirmPassword: 0,
    profilePicture: "",
    isArtist: false,
  };
  changeHandler = (e) => {
    let name = e.target.name;
    let value = e.target.value;
    this.setState({ [name]: value });
  };

  sendUserInfo = (event) => {
    event.preventDefault();
    const formData = new FormData();
    formData.append("fullName", this.state.fullName);
    formData.append("email", this.state.email);
    formData.append("age", this.state.age);
    formData.append("password", this.state.password);
    formData.append("confirmPassword", this.state.confirmPassword);
    formData.append("isArtist", this.state.isArtist);
    formData.append("file", this.state.profilePicture);
    if (this.state.password === this.state.confirmPassword) {
      axios
        .post("/user/signin", formData)
        .then((response) => {
          console.log(response.data);
        })
        .catch((error) => {
          console.log(error);
        });
    } else {
      alert("worng password");
    }
  };

  render() {
    return (
      <div>
        <Container>
          <h1>sing In</h1>
          <Form className="form">
            <Form.Label>Full name</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter Full name"
              name="fullName"
              onChange={this.changeHandler}
            />

            <Form.Label>Age</Form.Label>
            <Form.Control
              type="number"
              placeholder="Age"
              name="age"
              onChange={this.changeHandler}
            />

            <Form.Label>Email</Form.Label>
            <Form.Control
              type="email"
              placeholder="Email"
              name="email"
              onChange={this.changeHandler}
            />

            <Form.Label>Password</Form.Label>
            <Form.Control
              type="password"
              placeholder="Password"
              name="password"
              onChange={this.changeHandler}
            />

            <Form.Label>Confirm password</Form.Label>
            <Form.Control
              type="password"
              placeholder="Confirm password"
              name="confirmPassword"
              onChange={this.changeHandler}
            />

            <Form.Label>Profile picture</Form.Label>
            <Form.Control
              type="file"
              name="profilePicture"
              onChange={(event) => {
                this.setState({ profilePicture: event.target.files[0] });
              }}
            />

            <Form.Check
              type="checkbox"
              label="Artis"
              onChange={(event) => {
                this.setState({ isArtist: event.target.checked });
              }}
            />

            <Button variant="dark" type="submit" onClick={this.sendUserInfo}>
              Sing In
            </Button>
          </Form>
        </Container>
      </div>
    );
  }
}

export default Singin;
