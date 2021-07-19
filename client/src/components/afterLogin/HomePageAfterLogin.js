import React, { Component } from "react";
import { Container, Carousel, Row, Col } from "react-bootstrap";
import axios from "axios";
import Comments from './Comments';
import '../../css/HomePageAfterLogin.css'

class HomePageAfterLogin extends Component {
    state = { files: [], user: JSON.parse(localStorage.user) };

    addLike = file_id => {
        axios
            .post(`/file/like/${file_id}/${this.state.user._id}`, JSON.stringify(localStorage.user))
            .then(response => {
                if (response.status === 200) {
                    let temp = this.state.files;
                    let file = temp.find(item => { return item._id === file_id });
                    response.data === "Added" ?
                        file.likes = file.likes + 1
                        : file.likes = file.likes - 1;
                    this.setState({ files: temp });
                }
            })
            .catch(err => {
                console.log(err);
            });
    };

    componentDidMount() {
        axios
            .get("/file")
            .then(response => {
                this.setState({ files: response.data });
            })
            .catch(err => {
                console.log(err);
            });
    }

    render() {
        let files = this.state.files;
        let videos = files.map((file, index) => (
            <div key={index}>
                <Row>
                    <Col>
                        <video
                            key={index}
                            src={`/video/${file.fileLink}`}
                            controls
                        ></video>
                        <br />
                        <i
                            className="fa fa-heart"
                            style={{ color: "grey" }}
                            onClick={() => {
                                this.addLike(file._id);
                            }}
                        >
                            {file.likes}
                        </i>
                        <Comments file={file} />
                    </Col>
                </Row>
            </div>
        ));

        return (
            <div>
                <Carousel className="topCarousel">
                    <Carousel.Item>
                        <img
                            className="d-block w-100"
                            src="/images/elvis-presley-1482026.jpg"
                            alt="First slide"
                        />
                    </Carousel.Item>
                    <Carousel.Item>
                        <img
                            className="d-block w-100"
                            src="/images/microphone-1209816.jpg"
                            alt="First slide"
                        />
                    </Carousel.Item>
                    <Carousel.Item>
                        <img
                            className="d-block w-100"
                            src="/images/musician-349790.jpg"
                            alt="First slide"
                        />
                    </Carousel.Item>
                    <Carousel.Item>
                        <img
                            className="d-block w-100"
                            src="/images/band-2179313.jpg"
                            alt="First slide"
                        />
                    </Carousel.Item>
                </Carousel>
                <Container className="HomePageAfterLogin">
                    {videos}
                </Container>
            </div>
        );
    }
}

export default HomePageAfterLogin;