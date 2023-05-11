import trpc from "@/utils/trpc";
import React from "react";

type Props = {};

const Signin = (props: Props) => {
  const { mutateAsync } = trpc.signup.credential.useMutation();
  const { data } = trpc.user.get.useQuery();
  const handleSignUp = () => {
    mutateAsync({
      email: "kara.kaan1995@gmail.com",
      password: "Test@123",
    })
      .then((resolve) => {
        console.log(resolve);
      })
      .catch((e) => {
        console.log(e);
      });
  };

  const handleSignIn = () => {};
  const handleTest = () => {
    console.log(data);
  };
  return (
    <div>
      <h1>Signin</h1>

      <button style={{ margin: "1em", padding: "1em" }} onClick={handleSignUp}>
        Sign UP
      </button>
      <button style={{ margin: "1em", padding: "1em" }} onClick={handleSignIn}>
        Sign IN
      </button>
      <button style={{ margin: "1em", padding: "1em" }} onClick={handleTest}>
        test
      </button>
    </div>
  );
};

export default Signin;
