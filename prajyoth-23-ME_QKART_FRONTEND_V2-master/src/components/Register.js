import { Button, CircularProgress, Stack, TextField } from "@mui/material";
//import { flexbox } from '@mui/system';

import { Box, flexbox } from "@mui/system";
import axios from "axios";
import { useSnackbar } from "notistack";
import React, { useState } from "react";
import { config } from "../App";
import Footer from "./Footer";
import Header from "./Header";
import "./Register.css";
import { useHistory, Link } from "react-router-dom";

const Register = () => {
  const { enqueueSnackbar } = useSnackbar();
  const [username, setUser] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirm] = useState("")
  const [loading, setLoading] = useState(false)
  const history = useHistory();


  // TODO: CRIO_TASK_MODULE_REGISTER - Implement the register function



  /**
   * Definition for register handler
   * - Function to be called when the user clicks on the register button or submits the register form
   *
   * @param {{ username: string, password: string, confirmPassword: string }} formData
   *  Object with values of username, password and confirm password user entered to register
   *
   * API endpoint - "POST /auth/register"
   *
   * Example for successful response from backend for the API call:
   * HTTP 201
   * {
   *      "success": true,
   * }
   *
   * Example for failed response from backend for the API call:
   * HTTP 400
   * {
   *      "success": false,
   *      "message": "Username is already taken"
   * }
   */
  const register = async ({username, password, confirmPassword}) => {
    //{username: e.target.username.value, password: e.target.password.value, confirmPassword: e.target.confirmPassword.value}

    // console.log("Register\n")
    // console.log("Username\n", username)
    // console.log("Password\n", password)
    // console.log("Confirm Password\n", confirmPassword)
    // console.log("config", config)
    if(validateInput({username, password, confirmPassword})){
      try{
        setLoading(true)
        let res = await axios.post(`${config.endpoint}/auth/register`, {username, password})
        setLoading(false)
        if (res.status === 201){
          enqueueSnackbar("Registered successfully", {variant:"success"})
          history.push("/login")
        }
        // setUser("")
        // setPassword("")
        // setConfirm("")
        
        // res.status = 201
        // res.data = {success:true}
        // console.log(res)
      }catch(err){
        setLoading(false)
        //  err.response.data = {success:"false", message:"Username already exists"} 
        // err.response.status = 400 
        // err.response = undefined 
        if (err.response === undefined){
          enqueueSnackbar("Something went wrong. Check that the backend is running, reachable and returns valid JSON.", {variant:"error"})
        }
        else if (err.response.status === 400){
          enqueueSnackbar(err.response.data.message, {variant:"error"})
        }else{
          enqueueSnackbar("Something went wrong. Check that the backend is running, reachable and returns valid JSON.", {variant:"error"})
        }
      }
        // console.log("Error", err)
        // console.log("Error response:", err.response)
        // console.log("Error Status:", err.status)
    }
    
    // enqueueSnackbar("Snackbar message", {variant:"error"})

  };

  // TODO: CRIO_TASK_MODULE_REGISTER - Implement user input validation logic
  /**
   * Validate the input values so that any bad or illegal values are not passed to the backend.
   *
   * @param {{ username: string, password: string, confirmPassword: string }} data
   *  Object with values of username, password and confirm password user entered to register
   *
   * @returns {boolean}
   *    Whether validation has passed or not
   *
   * Return false if any validation condition fails, otherwise return true.
   * (NOTE: The error messages to be shown for each of these cases, are given with them)
   * -    Check that username field is not an empty value - "Username is a required field"
   * -    Check that username field is not less than 6 characters in length - "Username must be at least 6 characters"
   * -    Check that password field is not an empty value - "Password is a required field"
   * -    Check that password field is not less than 6 characters in length - "Password must be at least 6 characters"
   * -    Check that confirmPassword field has the same value as password field - Passwords do not match
   */
  const validateInput = ({username, password, confirmPassword}) => {
    if (username.length === 0){
      enqueueSnackbar("Username is a required field", {variant:"warning"})
      return false
    }else if(username.length < 6){
      enqueueSnackbar("Username must be at least 6 characters", {variant:"warning"})
      return false
    }else if(password.length === 0){
      enqueueSnackbar("Password is a required field", {variant:"warning"})
      return false
    }else if(password.length < 6){
      enqueueSnackbar("Password must be at least 6 characters", {variant:"warning"})
      return false
    }else if(password !== confirmPassword){
      enqueueSnackbar("Passwords do not match", {variant:"warning"})
      return false
    }else{
      return true
    }
  };

  return (
    <Box
      display="flex"
      flexDirection="column"
      justifyContent="space-between"
      minHeight="100vh"
    >
      <Header hasHiddenAuthButtons />
      <Box className="content">
        <Stack spacing={2} className="form" component="form"
        onSubmit={(e)=>{
          e.preventDefault()
          register({username, password, confirmPassword})
        }}
        >
          <h2 className="title">Register</h2>
          <TextField
            id="username"
            label="Username"
            variant="outlined"
            title="Username"
            name="username"
            value={username}
            onChange={(e)=>{setUser(e.target.value)}}
            placeholder="Enter Username"
            fullWidth
          />
          <TextField
            id="password"
            variant="outlined"
            label="Password"
            name="password"
            value={password}
            onChange={(e)=>{setPassword(e.target.value)}}
            type="password"
            helperText="Password must be atleast 6 characters length"
            fullWidth
            placeholder="Enter a password with minimum 6 characters"
          />
          <TextField
            id="confirmPassword"
            variant="outlined"
            label="Confirm Password"
            name="confirmPassword"
            value={confirmPassword}
            onChange={(e)=>{setConfirm(e.target.value)}}
            type="password"
            fullWidth
          />
           {!loading && <Button className="button" variant="contained" type="submit">
            Register Now
           </Button>}
           {loading && <Box sx={{display:'flex', justifyContent:'center', width:1}}><CircularProgress /></Box>}
          <p className="secondary-action">
            Already have an account?{" "}
             <Link to="/login">
              Login here
             </Link>
          </p>
        </Stack>
      </Box>
      <Footer />
    </Box>
  );
};

export default Register;
