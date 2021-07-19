import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import { Container, Form, Button } from 'react-bootstrap';
import axios from 'axios';
class Login extends Component {
    state = { email: '', password: '', status: '', isloged: false };
    changeHandler = (e) => {
        let name = e.target.name;
        let value = e.target.value;
        this.setState({ [name]: value });
    }

    loginHandler = (event) => {
        event.preventDefault();
        axios.post("/user/login",
            {
                email: this.state.email,
                password: this.state.password
            })
            .then((response) => {
                if (response.status === 200) {
                    localStorage.setItem("user", JSON.stringify(response.data.user));
                    this.setState({ isloged: true });
                    this.props.toggleLogin();
                }
                else { this.setState({ status: "Email Or Password are unvalid" }); }
            })
            .catch((error) => {
                this.setState({ status: "Email Or Password are unvalid" });
            });
    }

    render() {
        return (
            <div>
                {this.state.isloged ? <Redirect to="/profile" /> : ''}
                <Container>
                    <h1>Login</h1>
                    <Form onSubmit={this.loginHandler}>
                        <Form.Label>Email</Form.Label>
                        <Form.Control type="email" placeholder="Enter email" name='email' onChange={this.changeHandler} />
                        <Form.Label>Password</Form.Label>
                        <Form.Control type="password" placeholder="Password" name='password' onChange={this.changeHandler} />
                        <br />
                        <p style={{ color: "red" }}>{this.state.status}</p>
                        <Button variant="dark" type="submit">Log In</Button>
                    </Form>
                </Container>
            </div >
        );
    }
}

export default Login
