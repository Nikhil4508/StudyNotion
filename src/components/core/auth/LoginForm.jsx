import React from "react";
import { useState } from "react";
import { Link,useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import {AiOutlineEye,AiOutlineEyeInvisible} from "react-icons/ai";

import {login} from "../../../services/operations/authAPI";


const LoginForm = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [formData,setFromData] = useState({
        email:"",
        password:"",
    });
    
    const [showPassword,setShowPassword] = useState(false);
    const {email,password} = formData;

    const handleOnChange = (e) => {
        setFromData((prevData) => ({
            ...prevData,
            [e.target.name]: e.target.value,
        }))
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        dispatch(login(email,password,navigate))
    }


return (
    <form
        onSubmit={handleSubmit}
        className="mt-4 flex w-full flex-col gap-y-4"
    >
        <label className="w-full ">
            <p className="mb-1 text-[0.875rem] leading-5 text-richblack-5">
                Email Address <sup className="text-pink-200" >*</sup> 
            </p>
            <input 
                required
                type="text"
                name="email"
                value={email}
                onChange={handleOnChange}
                placeholder="Enter your email address"
                style={{
                    boxShadow:"inset 0px -1px 0px rgba(255,255,255,0.18)",
                }}
                className="w-full rounded-[0.5rem] bg-richblack-800 p-[12px] text-richblack-5"
            />
        </label>
        <label className="relative ">
            <p className="mb-1 text-[0.875rem] leading-5 text-richblack-5">
                Password <sup className="text-pink-200" >*</sup> 
            </p>
            <input 
                required
                type={showPassword ? "text" : "password"}
                name="password"
                value={password}
                onChange={handleOnChange}
                placeholder="Enter password"
                style={{
                    boxShadow:"inset 0px -1px 0px rgba(255,255,255,0.18)",
                }}
                className="w-full rounded-[0.5rem] bg-richblack-800 p-[12px] text-richblack-5"
            />
            <span 
                className="absolute right-3 top-[38px] z-10 cursor-pointer "
                onClick={()=> setShowPassword((prev) => !prev)}
            >
                {
                    showPassword ? (
                        <AiOutlineEyeInvisible fontsize={24} fill="#AFB2BF" />
                    ) : (
                        <AiOutlineEye fontsize={24} fill="#AFB2BF" />
                    )
                }
            </span>
            <Link to={"/forgot-password"}>
                <p className="mt-2 ml-auto text-right text-xs text-blue-100">Forgot Password</p>
            </Link>
        </label>
        <button
            type="submit"
            className="mt-6 rounded-[8px] bg-yellow-50 py-[8px] px-[12px] font-semibold text-richblack-900 cursor-pointer"
        >
            Sign In 
        </button>

    </form>

);
};

export default LoginForm;
