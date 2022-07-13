import { NextPageContext } from "next";
import { getSession } from "next-auth/react";

export const getServerSideProps = async (ctx: NextPageContext) => {
  const session = await getSession(ctx);

  console.log("session from AUTH", session);
  if (!session) {
    return {
      redirect: { destination: "/madmin" },
    };
  }
  return {
    props: {
      session,
    },
  };
};

function auth() {
  return <div>test</div>;
}

export default auth;
