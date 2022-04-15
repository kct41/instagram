/** @format */

import React, {useState, useEffect} from "react";
import "./App.css";
import logoImg from "./img/text-logo.png";
import Post from "./Post";
import {auth, db} from "./firebase";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import Input from "@mui/material/Input";
import Button from "@mui/material/Button";
import ImageUpload from "./ImageUpload";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  pt: 2,
  px: 4,
  pb: 3,
};

function App() {
  const [posts, setPosts] = useState([]);
  const [open, setOpen] = useState(false);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [user, setUser] = useState(null);
  const [openSignIn, setOpenSignIn] = useState(false);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((authUser) => {
      if (authUser) {
        //user has logged in...
        setUser(authUser);
      } else {
        //user has logged out...
        setUser(null);
      }
    });

    return () => {
      unsubscribe();
    };
  }, [user, username]);

  useEffect(() => {
    db.collection("posts")
      .orderBy("timestamp", "desc")
      .onSnapshot((snapshot) =>
        setPosts(
          snapshot.docs.map((doc) => ({
            id: doc.id,
            post: doc.data(),
          }))
        )
      );
  }, []);
  // 회원가입
  const signUp = (event) => {
    event.preventDefault();
    auth
      .createUserWithEmailAndPassword(email, password)
      .then((authUser) => {
        return authUser.user.updateProfile({
          displayName: username,
        });
      })
      .catch((error) => alert(error.message));

    setOpen(false);
  };
  // 로그인
  const signIn = (event) => {
    event.preventDefault();

    auth
      .signInWithEmailAndPassword(email, password)
      .catch((error) => alert(error.message));

    setOpenSignIn(false);
  };

  return (
    <div className='App'>
      <Modal open={open} onClose={() => setOpen(false)}>
        <Box sx={{...style, width: 200}}>
          <form className='app__signup'>
            <center>
              <img className='app__modalImage' src={logoImg} alt='logo' />
            </center>
            <Input
              type='text'
              placeholder='username'
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
            <Input
              placeholder='email'
              type='text'
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <Input
              placeholder='password'
              type='password'
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <Button type='submit' onClick={signUp}>
              로그인하긔
            </Button>
          </form>
        </Box>
      </Modal>
      <Modal open={openSignIn} onClose={() => setOpenSignIn(false)}>
        <Box sx={{...style, width: 200}}>
          <form className='app__signup'>
            <center>
              <img className='app__modalImage' src={logoImg} alt='logo' />
            </center>
            <Input
              placeholder='email'
              type='text'
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <Input
              placeholder='password'
              type='password'
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <Button type='submit' onClick={signIn}>
              SUBMIT
            </Button>
          </form>
        </Box>
      </Modal>
      {/* 헤더 */}
      <div className='app__header'>
        <img className='app__headerImage' src={logoImg} alt='logo' />
        {user ? (
          <Button onClick={() => auth.signOut()}>로그아웃</Button>
        ) : (
          <div className='app__loginContainer'>
            <Button className='btn' onClick={() => setOpenSignIn(true)}>
              로그인
            </Button>
            <Button className='btn' onClick={() => setOpen(true)}>
              회원가입
            </Button>
          </div>
        )}
      </div>

      <div className='app__posts'>
        {posts.map(({post, id}) => (
          <Post
            key={id} //key값을 더하면 이미 올라와 있는 포스트는 리렌더 되지 않는다.
            postId={id}
            user={user}
            username={post.username}
            caption={post.caption}
            imageUrl={post.imageUrl}
          />
        ))}
      </div>
      {user?.displayName ? (
        <ImageUpload username={user.displayName} />
      ) : (
        <h3 className='app__loginMent'>댓글 달려면 로그인을 하라긔</h3>
      )}
    </div>
  );
}

export default App;
