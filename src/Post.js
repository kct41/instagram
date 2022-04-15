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
        .orderBy("timestamp", "asc")
        .onSnapshot((snapshot) => {
          setComments(snapshot.docs.map((doc) => doc.data()));
        });
    }
    return () => {
      unsubscribe();
    };
  }, [postId]);

  const [click, setClicked] = useState(0);

  const onClick = (current) => {
    setClicked((current) => current + 1);
  };
  return (
    <div className='post'>
      <div className='post__header'>
        <Avatar className='post__avatar' src='/static/images/avatar/1.jpg' />
        <h3 className=''>{username}</h3>
      </div>

      <img className='post__image' src={imageUrl} alt='' />
      <div className='post__menu'>
        <div className='icon__box'>
          <i onClick={onClick} className='fa-regular fa-heart'></i>
          <i class='fa-regular fa-comment'></i>
          <i class='fa-regular fa-paper-plane'></i>
        </div>
        <i class='fa-regular fa-bookmark'></i>
      </div>
      <div className='post__like'>
        좋아요가 <strong>{click}</strong>번 클릭되었습니다
      </div>
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
          <i class='fa-regular fa-face-smile'></i>
          <input
            className='post__input'
            type='text'
            placeholder='댓글 달기...'
            value={comment}
            onChange={(e) => setComment(e.target.value)}
          />
          <button
            disabled={!comment}
            className='post__button'
            type='submit'
            onClick={postComment}>
            게시
          </button>
        </form>
      )}
    </div>
  );
}

export default Post;
