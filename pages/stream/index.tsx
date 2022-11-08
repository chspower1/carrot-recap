import type { NextPage } from "next";
import Link from "next/link";
import FloatingButton from "@components/FloatingButton";
import Layout from "@components/Layout";
import useSWR from "swr";
import { Product, Stream, User } from "@prisma/client";

export interface StreamWithUserAndProduct extends Stream {
  user: User;
  product: Product;
}

interface StreamProps {
  ok: boolean;
  streams: StreamWithUserAndProduct[];
}

const StreamPage: NextPage = () => {
  const { data } = useSWR<StreamProps>("api/stream");

  return (
    <Layout hasTabBar title="라이브">
      <div className=" divide-y-[1px] space-y-4">
        {data?.streams.map((stream) => (
          <Link key={stream.id} href={`/stream/${stream.id}`}>
            <div className="pt-4 block  px-4">
              <div className="w-full rounded-md shadow-sm bg-slate-300 aspect-video" />
              <div className="flex justify-between items-end">
                <h1 className="text-2xl mt-2 font-bold text-gray-900">{stream.product.name}</h1>
                <span className="text-base mt-2 font-bold text-gray-700">
                  {stream.product.price} 원
                </span>
              </div>
            </div>
          </Link>
        ))}
        <FloatingButton href="/stream/create">
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
            ></path>
          </svg>
        </FloatingButton>
      </div>
    </Layout>
  );
};

export default StreamPage;
