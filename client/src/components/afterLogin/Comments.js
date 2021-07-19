import React, { Component, Fragment } from "react";
import { Form, Button } from "react-bootstrap";
import axios from "axios";

class AddComments extends Component {
  state = {
    user: JSON.parse(localStorage.user),
    comment: ""
  };
  sendComment = e => {
    e.preventDefault();
    const data = {
      user: this.state.user,
      body: this.state.comment
    };
    if (this.state.comment === '') {
      return alert('Enter Your Comment');
    }
    axios.post(`/comment/${this.props._id}`, data)
      .then(res => {
        if (res.status === 202) {
          this.props.commentAdded(res.data);
        }
      })
      .catch(err => {
        console.log(err);
      });
  };

  render() {
    return (
      <Form onSubmit={this.sendComment}>
        <Form.Label>Enter your Comment</Form.Label>
        <Form.Control
          type="text"
          placeholder="comment"
          name="comment"
          onChange={e => this.setState({ comment: e.target.value })}
        />
        <Button type="submit">send</Button>
        <br />
      </Form>
    );
  }
}

//_____________________________________________________________________________________________________

export default class Comments extends Component {
  state = {
    user: JSON.parse(localStorage.user),
    file: this.props.file,
    addComment: false
  };

  commentAdded = file => {
    let temp = this.state.file;
    temp.comments.push(file);
    this.setState({ file: temp });
  };

  deleteComment = (commentId, fileId) => {
    axios.delete(`/comment/${commentId}/${this.state.user._id}/${fileId}`)
      .then(res => {
        if (res.status === 200) {
          let temp = {...this.state.file};
          temp.comments = temp.comments.filter(comment =>{
           return comment._id !== commentId
          });
          this.setState({ file: temp });
        }
      })
      .catch(err => {
        console.log(err);
      });
  }

  render() {
    return (
      <Fragment>
        <section>
          {this.state.file.comments.map((comment, i) => 
            <div className='comment' key={i}>
              <span>{comment.body}</span>
              <i className="fa fa-trash" onClick={() => this.deleteComment(comment._id, this.state.file._id)}></i>
            </div>
          )}
        </section>
        <br />
        <img className='userImg' src={`/image/${this.state.user.profileImageUrl}`} alt="userImg" />
        <Button
          onClick={() => this.setState({ addComment: !this.state.addComment })}
        >
          Add Comment
        </Button>
        {
          this.state.addComment ?
          <AddComments
            _id={this.state.file._id}
            commentAdded={this.commentAdded}
          />
          :
          ""
        }
      </Fragment>
    );
  }
}
