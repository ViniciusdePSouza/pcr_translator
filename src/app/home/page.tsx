"use client";

import { useEffect } from "react";
import { useUser } from "../hooks/userContext";

export default function Home() {
  const { user } = useUser();

  useEffect(() => {
    console.log(user);
  }, [user]);

  return <h1>Home component works!</h1>;
}
