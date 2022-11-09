import type { NextPage } from "next";
import Link from "next/link";
import Layout from "@components/Layout";
import useMutation from "@libs/client/useMutaion";
import { useEffect } from "react";
import Router, { useRouter } from "next/router";
import useSWR from "swr";
import { Review, User } from "@prisma/client";
import useUser from "@libs/client/useUser";
import { cls } from "@libs/client/utils";
import Image from "next/image";
import localImage from "../../public/local.jpg";
export interface ProfileResponse {
  ok: boolean;
  profile: User;
}

interface ProfileReview extends Review {
  createBy: {
    id: number;
    name: string;
    avator: string;
  };
}

interface ReviewsResponse {
  ok: boolean;
  reviews: ProfileReview[];
}

const Profile: NextPage = () => {
  const router = useRouter();
  const [logout, { data: logoutData, loading }] = useMutation("api/logout");
  const { user } = useUser();
  const { data: reviews, mutate: mutateReviews } = useSWR<ReviewsResponse>("/api/reviews");
  console.log(reviews);
  // 로그아웃 클릭시 발동 함수
  const handleClickLogout = () => {
    logout({});
  };
  useEffect(() => {
    if (logoutData?.ok) {
      router.push("/enter");
    }
  }, [logoutData, router]);
  return (
    <Layout hasTabBar title="나의 캐럿">
      <div className="px-4">
        <div className="flex items-center mt-4 space-x-3 relative">
          <Image
            src={user?.avatar ? user.avatar : localImage}
            className="w-16 h-16 rounded-full object-cover"
            width={300}
            height={300}
            quality={100}
            alt="user"
          />
          <div className="flex flex-col">
            <span className="font-medium text-gray-900">{user?.name}</span>
            <Link href="/profile/edit">
              <div className="text-sm text-gray-700">Edit profile &rarr;</div>
            </Link>
          </div>
          <div
            onClick={handleClickLogout}
            className="cursor-pointer absolute right-0 p-2 bg-red-500 hover:bg-red-700 text-white text-sm rounded-sm top-2 font-bold"
          >
            로그아웃
          </div>
        </div>
        <div className="mt-10 flex justify-around">
          <Link href="/profile/sold">
            <div className="flex flex-col items-center">
              <div className="w-14 h-14 text-white bg-orange-400 rounded-full flex items-center justify-center">
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
                    d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                  ></path>
                </svg>
              </div>
              <span className="text-sm mt-2 font-medium text-gray-700">판매내역</span>
            </div>
          </Link>
          <Link href="/profile/bought">
            <div className="flex flex-col items-center">
              <div className="w-14 h-14 text-white bg-orange-400 rounded-full flex items-center justify-center">
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
                    d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                  ></path>
                </svg>
              </div>
              <span className="text-sm mt-2 font-medium text-gray-700">구매내역</span>
            </div>
          </Link>
          <Link href="/profile/loved">
            <div className="flex flex-col items-center">
              <div className="w-14 h-14 text-white bg-orange-400 rounded-full flex items-center justify-center">
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
                    d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                  ></path>
                </svg>
              </div>
              <span className="text-sm mt-2 font-medium text-gray-700">관심목록</span>
            </div>
          </Link>
        </div>
        {/* Reviews */}
        {reviews?.reviews?.map((review) => (
          <div key={review.id} className="mt-12">
            <div className="flex space-x-4 items-center">
              <div className="w-12 h-12 rounded-full bg-slate-500" />
              <div>
                <h4 className="text-sm font-bold text-gray-800">{review.createBy.name}</h4>
                {/* 별점 */}
                <div className="flex items-center">
                  {new Array(5).fill(0).map((_, index) => (
                    <svg
                      key={index}
                      className={cls(
                        "h-5 w-5",
                        review.score >= index + 1 ? "text-yellow-400" : "text-gray-400 "
                      )}
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                      aria-hidden="true"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
              </div>
            </div>
            <div className="mt-4 text-gray-600 text-sm">
              <p>{review.review}</p>
            </div>
          </div>
        ))}
      </div>
    </Layout>
  );
};

export default Profile;
