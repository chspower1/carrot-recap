import type { NextPage } from "next";
import Link from "next/link";
import FloatingButton from "@components/FloatingButton";
import Layout from "@components/Layout";
import useSWR from "swr";
import { Community } from "@prisma/client";
import useCoords from "@libs/client/useCoords";
import { useEffect, useState } from "react";
import usePagination from "@libs/client/usePagination";
import PageNav from "@components/pageNav";

interface HomeCommunity extends Community {
  user: {
    name: string;
  };
  _count: {
    replies: number;
    curious: number;
  };
}

interface CommunityResponse {
  ok: boolean;
  communities: HomeCommunity[];
  countCommunity: number;
}

const CommunityPage: NextPage = () => {
  // 현재 위치정보 불러오기
  const { latitude, longitude } = useCoords();
  const [currentPage, setCurrentPage] = useState(1);

  // 위치기반 Communities 불러오기
  const { data } = useSWR<CommunityResponse>(
    latitude && longitude
      ? `/api/community?latitude=${latitude}&longitude=${longitude}&page=${currentPage}`
      : `/api/community?page=${currentPage}`
  );
  const {
    currentPage: currentPageGuide,
    isfirstPage,
    plusPage,
    maxPage,
    isLastPage,
    handleClickChangePageList,
    handleClickPage,
  } = usePagination(data ? data.countCommunity : 5, 5);
  useEffect(() => {
    setCurrentPage(currentPageGuide);
  }, [currentPageGuide]);
  return (
    <Layout hasTabBar title="동네생활">
      <div className="space-y-4 divide-y-[2px]">
        {data?.communities?.map((community) => (
          <Link key={community.id} href={`/community/${community.id}`}>
            <div className="flex cursor-pointer flex-col pt-4 items-start">
              <span className="flex ml-4 items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                동네질문
              </span>
              <div className="mt-2 px-4 text-gray-700">
                <span className="text-orange-500 font-medium">Q.</span> {community.question}
              </div>
              <div className="mt-5 px-4 flex items-center justify-between w-full text-gray-500 font-medium text-xs">
                <span>{community.user.name}</span>
                <span>{community.createAt + ""}</span>
              </div>
              <div className="flex px-4 space-x-5 mt-3 text-gray-700 py-3 border-b w-full">
                <span className="flex space-x-2 items-center text-sm">
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    ></path>
                  </svg>
                  <span>궁금해요 {community?._count?.curious}</span>
                </span>
                <span className="flex space-x-2 items-center text-sm">
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                    ></path>
                  </svg>
                  <span>답변 {community?._count?.replies}</span>
                </span>
              </div>
            </div>
          </Link>
        ))}
        <PageNav
          isfirstPage={isfirstPage}
          handleClickPage={handleClickPage}
          handleClickChangePageList={handleClickChangePageList}
          currentPage={currentPage}
          plusPage={plusPage}
          maxPage={maxPage}
          isLastPage={isLastPage}
        />
        <FloatingButton href="/community/upload">
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
              d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
            ></path>
          </svg>
        </FloatingButton>
      </div>
    </Layout>
  );
};

export default CommunityPage;
