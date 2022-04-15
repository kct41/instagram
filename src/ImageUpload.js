/** @format */

import React from "react";
import {useState} from "react";
import Button from "@mui/material/Button";
import {storage, db} from "./firebase";
import "./imageupload.css";

function ImageUpload({username}) {
  const [image, setImage] = useState(null);
  const [progress, setProgress] = useState(0);
  const [caption, setCaption] = useState("");

  const handleChange = (e) => {
    if (e.target.files[0]) {
      setImage(e.target.files[0]);
    }
  };

  const handleUpload = () => {
    const uploadTask = storage.ref(`img/${image.name}`).put(image);
    uploadTask.on(
      "state_changed",
      (snapshot) => {
        //progressbar
        const progress = Math.round(
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100
        );
        setProgress(progress);
      },
      (error) => {
        console.log(error);
        alert(error.message);
      },
      () => {
        //complete function
        storage
          .ref("img")
          .child(image.name)
          .getDownloadURL()
          .then((url) => {
            //post image inside db
            db.collection("posts").add({
              caption: caption,
              imageUrl: url,
              username: username,
            });

            setProgress(0);
            setCaption("");
            setImage(null);
          });
      }
    );
  };
  return (
    <div className='imageupload'>
      <progress className='imageupload__progress' value={progress} max='100' />
      <input
        type='text'
        placeholder='내용을 쓰라긔'
        onChange={(event) => setCaption(event.target.value)}
        value={caption}
      />
      <input type='file' onChange={handleChange} />
      <Button onClick={handleUpload}>올리긔</Button>
    </div>
  );
}

export default ImageUpload;
