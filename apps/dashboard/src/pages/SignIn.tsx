import React from "react";
import trpc from "../utils/trpc";

type Props = {};

const SignIn = (props: Props) => {
  const { mutateAsync } = trpc.signin.credential.useMutation();
  const handleSignIn = () => {
    mutateAsync({ email: "kara.kaan1995@gmail.com", password: "Test@123" });
  };
  return <button onClick={handleSignIn}>SignIn</button>;
};

export default SignIn;
