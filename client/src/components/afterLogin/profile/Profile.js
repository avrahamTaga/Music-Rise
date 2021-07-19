import React, { Component } from "react";
import { Container, Form, Button, Row, Col } from "react-bootstrap";
import axios from "axios";
import "./Profile.css";

class Profile extends Component {
   state = {
      user: JSON.parse(localStorage.user),
      isUplode: false,
      title: "",
      description: "",
      userFile: "",
      isDownloadAble: false
   };

   changeHandler = event => {
      let name = event.target.name;
      let value = event.target.value;
      this.setState({ [name]: value });
   };

   sendUserFile = event => {
      event.preventDefault();
      const formData = new FormData();
      formData.append("user", JSON.stringify(this.state.user));
      formData.append("title", this.state.title);
      formData.append("description", this.state.description);
      formData.append("userFile", this.state.userFile);
      formData.append("isDownloadAble", this.state.isDownloadAble);
      axios
         .post("/file/upload", formData)
         .then(response => {
            console.log(response);
            localStorage.user = JSON.stringify(response.data.user);
            this.setState({ user: JSON.parse(localStorage.user) });
         })
         .catch(error => {
            console.log(error);
         });
   };

   //!Delete File
   deleteFile = (file_id, user_id) => {
      axios.delete(`/file/${file_id}/${user_id}`)
         .then(res => {
            if (res.status === 200) {
               let temp = this.state.user;
               temp.assets = temp.assets.filter(item => item._id !== file_id);
               localStorage.user = JSON.stringify(temp);
               this.setState({ user: JSON.parse(localStorage.user) });
            }
         }).catch(error => {
            console.log(error);
         });
   }

   render() {
      let files = this.state.user.assets.map((file, index) => (
         <Col key={index} md={6} sm={12} lg={4} style={{ position: "relative" }}>
            <i className="fa fa-trash" onClick={() => this.deleteFile(file._id, this.state.user._id)}></i>
            <video key={index} src={`/video/${file.fileLink}`} controls></video>
         </Col>
      ));
      return (
         <section className="Profile">
            <div className="themePicture">
               <img
                  id="themePicture"
                  src="https://cdn.pixabay.com/photo/2020/01/22/13/43/mountains-4785337__340.jpg"
                  alt=""
               />
               <label htmlFor="fileUpload" className="fileUpload">
                  <i className="fa fa-edit"></i>
               </label>
               <input id="fileUpload" type="file" style={{ display: "none" }} />
            </div>
            <Container>
               <div className="user">
                  <div>
                     <img
                        src={`/image/${this.state.user.profileImageUrl}`}
                        alt="userImg"
                        id="profileImage"
                     />
                  </div>
                  <div className="userDetails">
                     <p>{this.state.user.fullName}</p>
                     <p>{this.state.user.age}</p>
                     <p>{this.state.user.email}</p>
                     <Button
                        onClick={() => {
                           this.setState({ isUplode: !this.state.isUplode });
                        }}
                     >
                        Upload File
              </Button>
                  </div>
               </div>
               {this.state.isUplode ? (
                  <div className="col-sm-8">
                     <Form>
                        <Form.Label>Title</Form.Label>
                        <Form.Control
                           type="text"
                           name="title"
                           placeholder="Insert title"
                           onChange={this.changeHandler}
                        />

                        <Form.Label>Description</Form.Label>
                        <Form.Control
                           type="text"
                           name="description"
                           placeholder="Insert description"
                           onChange={this.changeHandler}
                        />

                        <Form.Label>File</Form.Label>
                        <Form.Control
                           type="file"
                           name="userFile"
                           onChange={event => {
                              this.setState({ userFile: event.target.files[0] });
                           }}
                        />

                        <Form.Check
                           type="checkbox"
                           label="isDownloadAble"
                           onChange={event => {
                              this.setState({ isDownloadAble: event.target.checked });
                           }}
                        />
                        <Button type="submit" onClick={this.sendUserFile}>
                           Upload Your File
                </Button>
                     </Form>
                  </div>
               ) : (
                     ""
                  )}
               <Row className="videos mt-2">{files}</Row>
            </Container>
         </section>
      );
   }
}

export default Profile;
