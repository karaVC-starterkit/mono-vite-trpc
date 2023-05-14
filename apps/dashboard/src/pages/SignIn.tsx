import React from "react";
import trpc from "../utils/trpc";

type Props = {};

const SignIn = (props: Props) => {
  const { mutateAsync } = trpc.signin.credential.useMutation();
  const handleSignIn = () => {
    mutateAsync({ email: "kara.kaan1995@gmail.com", password: "Test@123" });
  };
  const handleSignInGoogle = async () => {
    const data = await fetch("http://localhost:5001/auth/google");
    console.log(data);
  };
  const handleSignInGithub = async () => {
    const data = await fetch("http://localhost:5001/auth/github");
    console.log(data);
  };
  return (
    <>
      <button onClick={handleSignIn}>SignIn</button>;
      <a href="http://localhost:5001/auth/google">Sign in with Google</a>;
      <a href="http://localhost:5001/auth/microsoft">Sign in with microsoft</a>;
    </>
  );
};

export default SignIn;
