/** @format */
import React, {useEffect, useState} from "react";
import "./post.css";
import {Avatar} from "@mui/material";
import {db} from "./firebase";
import firebase from "firebase/compat/app";

function Post({username, user, caption, imageUrl, postId}) {
  const [comments, setComments] = useState([]);
  const [comment, setComment] = useState("");

  const postComment = (e) => {
    e.preventDefault();

    db.collection("posts").doc(postId).collection("comments").add({
      text: comment,
      username: user.displayName,
      timestamp: firebase.firestore.FieldValue.serverTimestamp(),
    });
    setComment("");
  };

  useEffect(() => {
    let unsubscribe;
    if (postId) {
      unsubscribe = db
        .collection("posts")
        .doc(postId)
        .collection("comments")
        .orderBy("timestamp", "desc")
        .onSnapshot((snapshot) => {
          setComments(snapshot.docs.map((doc) => doc.data()));
        });
    }
    return () => {
      unsubscribe();
    };
  }, [postId]);

  return (
    <div className='post'>
      <div className='post__header'>
        <Avatar
          className='post__avatar'
          alt={user}
          src='/static/images/avatar/1.jpg'
        />
        <h3 className=''>{username}</h3>
      </div>

      <img className='post__image' src={imageUrl} alt='' />

      <h4 className='post__text'>
        <strong>{username}</strong> {caption}
      </h4>

      <div>
        {comments.map((comment) => (
          <p className='post__comments'>
            <strong className='post__comment'>{comment.username}</strong>
            {comment.text}
          </p>
        ))}
      </div>

      {user && (
        <form className='post__commentBox'>
          <input
            className='post__input'
            type='text'
            placeholder='내용을 쓰라긔'
            value={comment}
            onChange={(e) => setComment(e.target.value)}
          />
          <button
            disabled={!comment}
            className='post__button'
            type='submit'
            onClick={postComment}>
            댓글달긔
          </button>
        </form>
      )}
    </div>
  );
}

export default Post;
