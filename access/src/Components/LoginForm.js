import React, { useEffect } from "react";
import axios from "axios";
import { Box, Button, TextField, Typography } from "@mui/material";
import Swal from "sweetalert2";
import { useDispatch, useSelector } from "react-redux";
import { setUserName, setPassword, setAccessKey, clearUser } from "../Redux/userSlice";
import bg from './assets/bg.jpg'

const LoginForm = ({ setIsLoggedIn }) => {
  const dispatch = useDispatch();
  const userName = useSelector((state) => state.user.userName);
  const password = useSelector((state) => state.user.password);

  const handleLogin = async () => {
    try {
      const response = await axios.get("https://mocki.io/v1/eb1f9aa9-d8ee-42f1-b99f-c3fae38c144b");
      const users = response.data;
      const user = users.find((user) => user.username === userName && user.password === password);

      if (user) {
        Swal.fire({
          title: "Authentication Successful",
          icon: "success",
          showConfirmButton: false,
          timer: 2000,
          allowOutsideClick: false,
          backdrop: true,
          backdropFilter: "blur(5px",
        }).then(() => {
          setIsLoggedIn(true)
          const accessKey = generateAccessKey();
          dispatch(setAccessKey(accessKey));
          dispatch(setUserName(userName));
          dispatch(setPassword(password));
        });
      } else {
        Swal.fire({
          title: "Authentication Failed",
          icon: "error",
          showConfirmButton: false,
          timer: 2000,
          allowOutsideClick: false,
          backdrop: true,
          backdropFilter: "blur(5px",
        }).then(() => {
          dispatch(setUserName(""));
          dispatch(setPassword(""));
        });
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      Swal.fire("Error", "An error occurred!", "error");
    }
  };

  const generateAccessKey = () => { 
    const storedAccessKey=localStorage.getItem(`accessKey_${userName}`)//if already stored key means
    if(storedAccessKey){
      return storedAccessKey
    }
    else{
    const accessKey = Math.floor(10000 + Math.random() * 90000);
    localStorage.setItem(`accessKey_${userName}`,accessKey.toString())
    return accessKey.toString();
  }
}
  useEffect(() => {
    const accessKey=generateAccessKey()
      dispatch(setAccessKey(accessKey));
  }, [dispatch, userName]);

  return (
    <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: "100vh", backgroundImage:`url(${bg})`,backgroundSize:'cover' , padding: 4 }}>
      <Typography variant="h4" gutterBottom sx={{color:'white', fontWeight:'bold',fontStyle:'italic'} }>
        Login Form 🐱‍🏍
      </Typography>
      <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", backgroundColor: "white", padding: 4, borderRadius: 2, boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)" }}>
        <TextField label="Username" variant="outlined" value={userName} onChange={(e) => dispatch(setUserName(e.target.value))} margin="normal" />
        <TextField label="Password" type="password" variant="outlined" value={password} onChange={(e) => dispatch(setPassword(e.target.value))} margin="normal" />
        <Button variant="contained" color="primary" onClick={handleLogin} sx={{ mt: 2 }}>
          Login
        </Button>
      </Box>
    </Box>
  );
};

export default LoginForm;