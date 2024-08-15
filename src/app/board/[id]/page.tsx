"use client";
import List from "@/app/components/list";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
export default function Board() {
  const { data: session } = useSession();
  const router = useRouter();

  if (!session) {
    router.push("/api/auth/signin");
    return null;
  }

  return (
    <div className="flex-grow flex flex-col overflow-y-hidden overflow-x-auto scrollbar scrollbar-thumb-neutral-500 scrollbar-track-[#00000026]">
      <List />
    </div>
  );
}
