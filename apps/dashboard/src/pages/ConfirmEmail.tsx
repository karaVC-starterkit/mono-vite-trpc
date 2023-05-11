import React, { useEffect } from "react";
import { Navigate, redirect, useSearchParams } from "react-router-dom";
import trpc from "../utils/trpc";

type Props = {};

const ConfirmEmail = (props: Props) => {
  const [searchParams] = useSearchParams();
  const { mutateAsync, error, isSuccess } =
    trpc.signup.verifyEmail.useMutation();
  useEffect(() => {
    const code = searchParams.get("t");
    mutateAsync({ code });
  }, []);

  //TODO: if url is malformed, or key is wrong i.e. /confirm-email  - without query params then show box with message "Your email verification request couldn't be processed. Make sure the link is correct."
  console.log(error);

  //TODO: Error is not caught on client side
  return (
    <div>
      {/* {isError && (
        <h1>
          Your email verification request couldn't be processed. Make sure the
          link is correct.
        </h1>
      )} */}
      {isSuccess && <Navigate to={"/welcome"} />}
    </div>
  );
};

export default ConfirmEmail;
