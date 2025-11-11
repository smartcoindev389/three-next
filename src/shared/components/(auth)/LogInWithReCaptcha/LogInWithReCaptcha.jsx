"use client";

import { useState } from "react";

import AuthTypeTabs from "@/shared/components/(auth)/LogInWithReCaptcha/AuthTypeTabs/AuthTypeTabs";
import LoginWithPassword from "@/shared/components/(auth)/LogInWithReCaptcha/LoginWithPassword/LoginWithPassword";
import LoginWithPhone from "@/shared/components/(auth)/LogInWithReCaptcha/LoginWithPhone/LoginWithPhone";

const LogInWithReCaptcha = () => {
  const [type, setType] = useState("email");

  return (
    <>
      <AuthTypeTabs setType={setType} type={type} />
      {type === "email" ? <LoginWithPassword /> : <LoginWithPhone />}
    </>
  );
};

export default LogInWithReCaptcha;
