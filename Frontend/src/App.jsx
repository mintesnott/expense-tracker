import React from "react"
import { Toaster } from 'react-hot-toast';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate
} from "react-router-dom"

import Login from "./pages/Auth/Login";
import SignUp from "./pages/Auth/Signup";

import VerifyEmail from "./pages/Auth/VerifyEmail";
import ResendVerification from "./pages/Auth/ResendVerification";

import Profile from "./pages/Dashboard/Profile";
import Home from "./pages/Dashboard/Home";

import Income from "./pages/Dashboard/Income";
import Expense from "./pages/Dashboard/Expense";


function App() {

  return (
    <div className="">
      <Toaster 
          position="top" 
          reverseOrder={false}
          toastOptions={{
            className: {},
            style: {

            },
            duration: 3000,
          }}
           />
      <Router>
        <Routes>
          <Route path="/" element={<Root />} />
          <Route path="/verify-email" element={<VerifyEmail />} />
          <Route path="/resend-verification" element={<ResendVerification />}/>
          <Route path="/signUp" exact element={<SignUp />} />
          <Route path="/login" exact element={<Login />} />
          <Route path="/dashboard" exact element={<Home />} />
          <Route path="/income" exact element={<Income />} />
          <Route path="/expense" exact element={<Expense />} />
          <Route path="/profile" element={<Profile />} />
        </Routes>
      </Router>
    </div>  
  )
}

export default App;

const Root = () => {
  //check if token is exists in Local storage

  const isAuthenticated = !!localStorage.getItem("token");

  //redirect to dashboard if authenticated, otherwise to login
  return isAuthenticated ? (
    <Navigate to="/dashboard" />
  ) : (
    <Navigate to="/login" />
  );
};
