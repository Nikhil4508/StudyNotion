import React from "react";
import loginImg from "../assets/student3.avif";
import Template from "../components/core/auth/Template";

const Login = () => {
  return (
    <Template
      title="Welcome Back"
      description1="Build skill for today, tomorrow, and beyond."
      description2="Education to future-proof your career."
      image={loginImg}
      formType="login"
    />
  );
};

export default Login;
