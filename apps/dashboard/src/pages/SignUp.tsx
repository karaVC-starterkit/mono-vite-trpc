import React from "react";
import trpc from "../utils/trpc";

type Props = {};

const SignUp = (props: Props) => {
  const { mutateAsync } = trpc.signup.credential.useMutation();
  const handleRegister = () => {
    mutateAsync({ email: "kara.kaan1995@gmail.com", password: "Test@123" });
  };
  return <button onClick={handleRegister}>SignUp</button>;
};

export default SignUp;
