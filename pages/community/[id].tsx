import type { NextPage } from "next";
import Layout from "@components/Layout";
import TextArea from "@components/TextArea";
import { useRouter } from "next/router";
import useSWR from "swr";
import { useForm } from "react-hook-form";
import { Community, Reply, User } from "@prisma/client";
import useMutation from "@libs/client/useMutaion";
import useUser from "@libs/client/useUser";
import community from "@api/community";
import { useEffect, useState } from "react";
import Link from "next/link";

interface ReplyForm {
  description: string;
}
interface DetailReply {
  user: {
    id: number;
    name: string;
    avator: string;
  };
  description: string;
}
interface DetailCommunity extends Community {
  user: {
    id: number;
    name: string;
    avatar: string;
  };
  _count: {
    curious: number;
  };
}
interface DetailCommunityResponse {
  ok: true;
  community: DetailCommunity;
  replies: DetailReply[];

  isCurious: boolean;
}
const CommunityPostDetail: NextPage = () => {
  // community id 추출
  const {
    query: { id },
  } = useRouter();
  const communityId = Number(id);

  // user
  const { user } = useUser();

  // react-hook-form
  const { register, handleSubmit, reset } = useForm<ReplyForm>();

  // community fetch
  const { data, mutate } = useSWR<DetailCommunityResponse>(
    communityId ? `/api/community/${communityId}` : null
  );
  const [curiousCount, setcuriousCount] = useState(data?.isCurious ? 1 : 0);

  // reply && curious mutation
  const [reply, { data: replyData, loading: replyLoading }] = useMutation(
    `/api/community/${communityId}/reply`
  );
  const [curious, { data: curiousData, loading: curiousLoading }] = useMutation(
    `/api/community/${communityId}/curious`
  );

  // form on valid function
  const onValid = (replyForm: ReplyForm) => {
    if (replyLoading || !communityId) return;
    reply(replyForm);
    const newReply = {
      user: {
        id: user?.id!,
        name: user?.name!,
        avator: user?.avatar!,
      },
      description: replyForm?.description!,
    };
    // reply mutate
    mutate({ ...data!, replies: [...data?.replies!, newReply] }, false);
    // Form reset
    reset();
  };

  const toggleCurios = () => {
    if (curiousLoading || !data) return;
    // curious create or delete
    curious({});
    // curious mutate
    console.log(data.isCurious);
    mutate(
      {
        ...data,
        community: {
          ...data?.community,
          _count: { curious: data.community._count.curious + (data.isCurious ? -1 : 1) },
        },
        isCurious: !data.isCurious,
      },
      false
    );
  };

  return (
    <Layout canGoBack>
      <div>
        <span className="inline-flex my-3 ml-4 items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
          동네질문
        </span>
        <div className="flex mb-3 px-4 pb-3  border-b items-center space-x-3">
          <div className="w-10 h-10 rounded-full bg-slate-300" />
          <div>
            <p className="text-sm font-medium text-gray-700">{data?.community?.user?.name}</p>
            <Link href={`/users/${data?.community.userId}`}>
              <p className="text-xs cursor-pointer font-medium text-gray-500">
                View profile &rarr;
              </p>
            </Link>
          </div>
        </div>
        <div>
          <div className="mt-2 px-4 text-gray-700">
            <span className="text-orange-500 font-medium">Q.</span>
            {data?.community?.question}
          </div>
          <div className="flex px-4 space-x-5 mt-3 text-gray-700 py-2.5 border-t border-b-[2px] w-full">
            <span
              onClick={toggleCurios}
              className="flex space-x-2 items-center text-sm hover:cursor-pointer hover:text-orange-500"
            >
              {data?.isCurious ? (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="#2f9237"
                  className="w-4 h-4"
                >
                  <path
                    fill-rule="evenodd"
                    d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zm13.36-1.814a.75.75 0 10-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.14-.094l3.75-5.25z"
                    clip-rule="evenodd"
                  />
                </svg>
              ) : (
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
              )}
              <span>궁금해요 {data?.community?._count?.curious}</span>
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
              <span>답변 {data?.replies.length}</span>
            </span>
          </div>
        </div>
        {/* Reply */}
        {data?.replies?.map((reply, index) => (
          <div key={`reply${index}`} className="px-4 my-5 space-y-5">
            <div className="flex items-start space-x-3">
              <Link href={`/users/${reply.user.id}`}>
                <div className="w-8 h-8 bg-slate-200 rounded-full" />
              </Link>
              <div>
                <span className="text-sm block font-medium text-gray-700">{reply.user.name}</span>
                <span className="text-xs text-gray-500 block ">2시간 전</span>
                <p className="text-gray-700 mt-2">{reply.description}</p>
              </div>
            </div>
          </div>
        ))}
        <form onSubmit={handleSubmit(onValid)} className="px-4">
          <TextArea
            register={register("description", { required: "질문을 입력해주세요." })}
            name="description"
            placeholder="Answer this question!"
            required
          />
          <button className="mt-2 w-full bg-orange-500 hover:bg-orange-600 text-white py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 focus:outline-none ">
            Reply
          </button>
        </form>
      </div>
    </Layout>
  );
};

export default CommunityPostDetail;
