import React, { Component } from 'react';
import { Row, Col } from "react-bootstrap";
import { Link } from "react-router-dom";
import "./ArtistPage.css";

class ArtistPage extends Component {
    render() {
        console.log(this.props.location.artist.artist);
        let files = this.props.location.artist.artist.assets.map((file, index) => (
            <Col sm={4} key={index}>
                <i className="fa fa-trash" onClick={() => this.deleteFile(file._id, this.state.user._id)}></i>
                <video key={index} src={`/video/${file.fileLink}`} controls></video>
            </Col>
        ));
        return (
            <div className='container'>
                <br />
                <Link className='btn btn-primary' to='/'>Back To Home</Link>
                <br />
                isArtist: {''}
                {this.props.location.artist.artist.isArtist ? <i className='fas fa-check text-success'></i> : <i className='fas fa-times-circle text-danger'></i>}
                <br />
                <br />
                <div className="card grid-2">
                    <div className="col-sm-6">
                        <img className='ArtistPageImg' src={`/image/${this.props.location.artist.artist.profileImageUrl}`} alt="userImg" />
                        <h4>{this.props.location.artist.artist.fullName}</h4>
                        <p>{this.props.location.artist.artist.email}</p>
                        <p>{this.props.location.artist.artist.age}</p>
                    </div>
                </div>
                <div className="card grid-2 align-self-center">
                    <div className="align-self-center">
                        <div className='badge badge-primary'>assets:{this.props.location.artist.artist.assets.length}</div>
                        <div className='badge badge-success'>likedFiles:{this.props.location.artist.artist.likedFiles.length}</div>
                    </div>
                    <Row>
                        {files}
                    </Row>
                </div>
            </div>
        )
    }
}

export default ArtistPage;
