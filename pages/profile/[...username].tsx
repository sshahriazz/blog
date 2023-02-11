import { GetServerSidePropsContext } from "next";
import React from "react";

const Profile = (props: { username: string }) => {
  console.log(props);

  return <div>Profile{props.username}</div>;
};

export default Profile;

export const getServerSideProps = async (
  context: GetServerSidePropsContext
) => {
  const { username } = context.query;

  return {
    props: { username },
  };
};
