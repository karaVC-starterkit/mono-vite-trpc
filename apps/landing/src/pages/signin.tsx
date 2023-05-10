import trpc from "@/utils/trpc";
import React from "react";

type Props = {};

const Signin = (props: Props) => {
  const { mutateAsync } = trpc.signup.credential.useMutation();
  const handleLogin = () => {
    mutateAsync({
      email: "kara.kaan1995@gmail.com",
      password: "Test@123",
    }).catch((e) => {
      console.log(e);
    });
  };
  return (
    <div>
      <h1>Signin</h1>
      <button onClick={handleLogin}>Sign in</button>
    </div>
  );
};

export default Signin;
