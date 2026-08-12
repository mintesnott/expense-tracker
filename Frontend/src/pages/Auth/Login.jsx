import React, { useContext, useState } from 'react'
import AuthLayout from '../../components/layouts/AuthLayout'

import Input from '../../components/Inputs/Input'
import { Link, useNavigate } from 'react-router-dom';

import { validateEmail, getEmailValidationError } from '../../utils/helper'

import axiosInstance from '../../utils/axiosinstance';
import { API_PATHS } from '../../utils/apiPaths';
import { UserContext } from '../../context/UserContext';

function Login() {

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);

  const [showVerification, setShowVerification] = useState(false);

  const { updateUser } = useContext(UserContext);

  const navigate = useNavigate();

  //handle Login form

  const handleLogin = async(e) => {

    e.preventDefault();

    if(!validateEmail(email)) {
      setError(getEmailValidationError(email));
      return;
    }

    if(!password) {
      setError("Please enter a password")
      return;
    }

    setError("");

    //login api call
    try {
        const response = await axiosInstance.post(API_PATHS.AUTH.LOGIN, {
        email,
        password,
      });

      const {token, user} = response.data;

      if(token) {
        localStorage.setItem("token", token);
        updateUser(user);
        navigate("/dashboard")
      }
    } catch(err) {
        const message = err.backendMessage || "Login failed";

        setError(message);

        if (message === "Please verify your email before logging in") {
            setShowVerification(true);
        } else {
            setShowVerification(false);
        }
    }
  }


  return (
    <AuthLayout>
      <div className='lg:w-[70%] h-3/4 md:h-full flex flex-col justify-center'>
        <h3 className='text-xl font-semibold text-black '>Welcome Back</h3>
        <p className='text-xs text-slate-700 mt-[5px] mb-6'>
          Please enter your details to log in
        </p>

        <form  onSubmit={handleLogin} action="">
          <Input
            value= {email}
            onChange = {({ target }) => {
                      setEmail(target.value);
                      setShowVerification(false);
                  }}
            label = "Email Address"
            placeholder = "melos@example.com.et"
            type="text"
          />

          <Input
            value= {password}
            onChange = {({ target }) => {
                setPassword(target.value);
                setShowVerification(false);
              }}
            label = "Password"
            placeholder = 'enter a password with a minimum of 8 character'
            type="password"
          />

          {error && <p className='text-red-500 text-xs pb-2.5'>{error}</p>}

          {showVerification && (

              <p className="text-[13px] text-slate-800 mb-3">
              Didn't verify your email?{" "}
              <Link
                  className="font-medium text-primary underline"
                  to="/resend-verification"
              >
                  Resend verification email
              </Link>
             </p>
          )}


          <button type='submit' className='btn-primary'>
              LOGIN
          </button>

          <p className='text-[13px] text-slate-800 mt-3'>
            Don't have an account?{" "}
            <Link className='font-medium text-primary underline' to="/signup">
            SignUp
            </Link>
          </p>
        </form>
        
      </div>
    </AuthLayout>
  )
}

export default Login
