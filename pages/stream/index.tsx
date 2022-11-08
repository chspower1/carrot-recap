import type { NextPage } from "next";
import Link from "next/link";
import FloatingButton from "@components/FloatingButton";
import Layout from "@components/Layout";
import useSWR from "swr";
import { Product, Stream, User } from "@prisma/client";
import { useEffect, useState } from "react";
import { cls } from "@libs/client/utils";
import usePagination from "@libs/client/usePagination";
import PageNav from "@components/pageNav";

export interface StreamWithUserAndProduct extends Stream {
  user: User;
  product: Product;
}

interface StreamProps {
  ok: boolean;
  streams: StreamWithUserAndProduct[];
  countStream: number;
}

const StreamPage: NextPage = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const { data } = useSWR<StreamProps>(`api/stream?page=${currentPage}`);
  const {
    currentPage: currentPageGuide,
    isfirstPage,
    plusPage,
    maxPage,
    isLastPage,
    handleClickChangePageList,
    handleClickPage,
  } = usePagination(data ? data?.countStream : 5);
  useEffect(() => {
    setCurrentPage(currentPageGuide);
  }, [currentPageGuide]);
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
        <div className="relative flex w-full h-full justify-center items-center gap-4 pt-3">
          <PageNav
            isfirstPage={isfirstPage}
            handleClickPage={handleClickPage}
            handleClickChangePageList={handleClickChangePageList}
            currentPage={currentPage}
            plusPage={plusPage}
            maxPage={maxPage}
            isLastPage={isLastPage}
          />
        </div>
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
