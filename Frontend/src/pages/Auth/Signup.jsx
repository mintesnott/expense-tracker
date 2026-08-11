import React, { useState } from 'react'
import { toast } from 'react-hot-toast';

import AuthLayout from '../../components/layouts/AuthLayout'

import Input from '../../components/Inputs/Input'
import ProfilePhotoSelector from '../../components/Inputs/ProfilePhotoSelector'

import { Link, useNavigate } from 'react-router-dom';

import { validateEmail, getEmailValidationError } from '../../utils/helper'
import axiosInstance from '../../utils/axiosinstance';
import { API_PATHS } from '../../utils/apiPaths';
import uploadImage from '../../utils/uploadImage';

const Signup = () => {

  const [profilePic, setProfilePic] = useState(null);
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [error, setError] = useState(null);

  const navigate = useNavigate();

  //handle signup
  const handleSignUp = async(e) => {
        
        e.preventDefault();

        if(!fullName) {
          setError("Please enter your name");
          return;
        }
        if(!validateEmail(email)) {
          setError(getEmailValidationError(email));
          return;
        }
        if(!password) {
          setError("Please enter a password")
          return;
        }
    
        setError("");
    
        //signup api call
        try{
          let profileImageUrl = '';
          if(profilePic) {
            const imageUpload = await uploadImage(profilePic);
            profileImageUrl = imageUpload.imageUrl || "";
          }

          const response = await axiosInstance.post(API_PATHS.AUTH.REGISTER, {
            fullName,
            email,
            password,
            profileImageUrl,
          });
          
          if (response.data && (response.data.success === true || response.status === 201))
            
            {
            toast.success("Successfully registered! Please Verify Your email.");
            navigate("/login")
          }
        } catch(err) {
          setError(err.backendMessage);
        }
  }

  return (
    <AuthLayout>
      <div className="lg:w-[100%] h-auto md:h-full mt-10 flex flex-col justify-center">
        <h3 className='text-xl font-semibold text-black'> Create an Account</h3>
        <p className="text-xs text-slate-700 mt-[5px] mb-6">
          Join us today by entering your details below
        </p>

        <form action="" onSubmit={handleSignUp}>
          <ProfilePhotoSelector image={profilePic} setImage={setProfilePic} />
          <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
            <Input
              value={fullName}
              onChange={({target}) => setFullName(target.value)}
              label="Full Name"
              placeholder="Melos Abera" 
              type="text"
            />

            <Input
              value= {email}
              onChange = {({ target }) => {setEmail(target.value)}}
              label = "Email Address"
              placeholder = "melos@example.com.et"
              type="text"
            />
            <div className="col-span-2">
              <Input
                value= {password}
                onChange = {({ target }) => {setPassword(target.value)}}
                label = "Password"
                placeholder = 'enter a password with a minimum of 8 character'
                type="password"
              />
            </div>
           

          </div>

          {error && <p className='text-red-500 text-xs pb-2.5'>{error}</p>}
          
            <button type='submit' className='btn-primary'>
              Sign Up
            </button>
  
            <p className='text-[13px] text-slate-800 mt-3'>
              Already have an account?{" "}
              <Link className='font-medium text-primary underline' to="/login">
              Login
              </Link>
            </p>
        </form>
      </div>
    </AuthLayout>
  )
}

export default Signup
