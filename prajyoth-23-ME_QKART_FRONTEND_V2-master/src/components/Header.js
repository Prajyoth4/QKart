import {Search} from "@mui/icons-material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { Avatar, Button, Stack, TextField, InputAdornment } from "@mui/material";
import Box from "@mui/material/Box";
import React, {useState, useEffect} from "react";
import { useHistory, Link } from "react-router-dom";
import "./Header.css";

const Header = ({ children, hasHiddenAuthButtons, productPage, handleSearch, username, setUsername }) => {
  const history = useHistory()

  //const [username, setUsername] = useState("")
  // let hasHiddenAuthButtons=false;
  useEffect(()=>{
    const nextUsername = localStorage.getItem("username");

    if (productPage &&(nextUsername!== username)){
      setUsername(nextUsername)
    }
    //console.log(username)
    //console.log(hasHiddenAuthButtons)
    
    // if (username === null){
    //   hasHiddenAuthButtons=false;
    // }else{
    //   hasHiddenAuthButtons=true;
    // }
    //console.log(hasHiddenAuthButtons)
  }, [productPage])
  // console.log(hasHiddenAuthButtons)


  const logout = () => {
    localStorage.removeItem("username")
    localStorage.removeItem("token")
    localStorage.removeItem("balance")
    setUsername(null)
  }

    return (
      <Box className="header">
        <Box className="header-title" onClick={()=>{history.push("/")}}>
            <img src="logo_light.svg" alt="QKart-icon"></img>
        </Box>
        {productPage && <TextField
        className="search-desktop"
        size="small"
        onChange={(e)=>{handleSearch(e)}}
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <Search color="primary" />
            </InputAdornment>
          ),
        }}
        placeholder="Search for items/categories"
        name="search"
      />}
        {!productPage && <Button
            className="explore-button"
            startIcon={<ArrowBackIcon />}
            variant="text"
            onClick={()=>{history.push("/")}}
        >
          Back to explore
        </Button>}
        
        {productPage && (username === null) && <Box><Link to="/login"><Button className="button"><Box className="login-btn">Login</Box></Button></Link><Link to="/register"><Button className="button" variant="contained">Register</Button></Link></Box>}
        {productPage && (username !== null) && <Box className="avatar-box"><Avatar alt={username} src="public/avatar.png" /><Box className="username-text1">{username}</Box><Button className="button" onClick={()=>{logout()}}>Logout</Button></Box>}
      </Box>
    );
};

export default Header;
