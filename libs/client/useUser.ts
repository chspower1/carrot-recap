import { User } from "@prisma/client";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import useSWR from "swr";

interface UserWithOk {
  ok: boolean;
  profile: User;
}

export default function useUser() {
  const { data, error } = useSWR<UserWithOk>("/api/users/me");
  return { user: data?.profile, isLoading: !data && !error };
}
