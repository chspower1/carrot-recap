import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import useSWR from "swr";

async function fetcher(url: string) {
  return await (await fetch(url)).json();
}

export default function useUser() {
  const { data: user } = useSWR("api/users/me", fetcher);
  const router = useRouter();
  return user;
}
