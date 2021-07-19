import React, { Component, Fragment } from 'react';
import { BrowserRouter, Route, Switch, Redirect } from 'react-router-dom';
import Home from './beforeLogin/Home';
import Singin from './beforeLogin/Singin';
import Login from './beforeLogin/Login';
import Profile from './afterLogin/profile/Profile';
import { Navbar, Nav, Form, Button } from 'react-bootstrap';
import HomePageAfterLogin from './afterLogin/HomePageAfterLogin';
import axios from "axios";
import "../css/NavBar.css";
import SearchResult from './afterLogin/search/SearchResult';
import ArtistPage from './afterLogin/search/ArtistPage';

class NavBarComponent extends Component {
  state = { isLogedin: localStorage.user, query: '', page: 1, serchResult: [], isSearch: false };
  toggleLogin = () => {
    this.setState({ isLogedin: localStorage.user });
  };

  //!Serch
  search = (e) => {
    e.preventDefault();
    axios.get(`/search/${this.state.query}/${this.state.page}`)
      .then(result => {
        if (result.status === 200) {
          this.setState({ serchResult: result.data, isSearch: true });
        }
        else {
          this.setState({ serchResult: [] });
        }
      })
      .catch(err => {
        console.log("Error:**", err);
      })
  }


  render() {
    return (
      <BrowserRouter>
        <div className="NavBarComponent" >
          <Navbar bg="dark" variant="dark" expand="lg" sticky="top" style={{ zIndex: 10000 }}>
            <Navbar.Toggle aria-controls="basic-navbar-nav" />
            <Navbar.Brand href="/" ml={5}><h2>MusicRise</h2></Navbar.Brand>
            <Navbar.Collapse id="basic-navbar-nav">
              {this.state.isLogedin === undefined ?
                /* Non loged in navbar */
                <Nav className="w-100 d-flex justify-content-center">
                  <Nav.Link href='/'><h4>Home</h4></Nav.Link>
                  <Nav.Link href='/singin'><h4>Create account</h4></Nav.Link>
                  <Nav.Link href='/' style={{ display: "none" }}><h4>home</h4></Nav.Link>
                  <Nav.Link href='/login'><h4>Login</h4></Nav.Link>
                </Nav>
                :
                /* logedin navbar */
                <Fragment>
                  <Nav className="w-100 d-flex justify-content-center" >
                    <Nav.Link href='/'><h4>Home</h4></Nav.Link>
                    <Nav.Link href='/profile'><h4>Profile</h4></Nav.Link>
                    <Nav.Link onClick={() => {
                      localStorage.clear();
                      this.setState({ isLogedin: localStorage.user });
                    }} href="/"><h4>Logout</h4></Nav.Link>
                    <Form inline style={{ marginLeft: "200px" }} className="search" onSubmit={this.search}>
                      <Form.Control type="text" placeholder="Search By Artist" className=" mr-sm-2"
                        onChange={((e) => {
                          this.setState({ query: e.target.value })
                        })} />
                      <Button type="submit">Search</Button>
                    </Form>
                  </Nav>
                </Fragment>
              }
            </Navbar.Collapse>
          </Navbar>
          <Switch>
            {
              this.state.isLogedin === undefined ?
                <Fragment>
                  <Route exact path='/' component={Home} />
                  <Route exact path='/singin' component={Singin} />
                  <Route exact path='/login' render={(props) => <Login toggleLogin={this.toggleLogin}{...props} />} />
                </Fragment>
                :
                <Fragment>
                  {this.state.isSearch ? <Redirect to='/search/:query' /> : ''}
                  <Route exact path='/' component={HomePageAfterLogin} />
                  <Route exact path='/profile' component={Profile} />
                  <Route exact path='/search/:query' render={(props) => <SearchResult serchResult={this.state.serchResult}  {...props} />} />
                  <Route exact path='/artist/:fullName' component={ArtistPage}/>
                </Fragment>
            }
          </Switch>
        </div>
      </BrowserRouter>
    );
  }
}

export default NavBarComponent;
