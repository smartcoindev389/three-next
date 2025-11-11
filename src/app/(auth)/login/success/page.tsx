import { FC } from "react";

import AuthTokenProvider from "@/shared/components/(auth)/AuthTokenProvider/AuthTokenProvider";
import Loader from "@/shared/components/(common)/Loader/Loader";
import { auth } from "@/lib/auth/auth";

interface PageParams {
  searchParams: Promise<{
    provider: string;
    action: string;
  }>;
}

const SuccessSignIn: FC<PageParams> = async ({ searchParams }) => {
  const params = await searchParams;
  const session = await auth();

  return (
    <>
      <AuthTokenProvider
        action={params.action}
        provider={params.provider}
        token={session?.user?.accessToken}
      />
      <Loader />
    </>
  );
};

export default SuccessSignIn;
