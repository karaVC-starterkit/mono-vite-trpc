import trpc from "@/utils/trpc";
import React from "react";

const login = () => {
  const { mutateAsync } = trpc.signup.credential.useMutation();

  const handleLogin = () => {
    mutateAsync({email: 'kara.kaan1995@gmail.com', password: 'password'})
  }
  return <button onClick={handleLogin}>login</button>;
};

export default login;
