import type { NextPage } from "next";
import Layout from "@components/Layout";
import Message from "@components/Message";
import useSWR from "swr";
import { useRouter } from "next/router";
import { StreamWithUserAndProduct } from "./index";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import useMutation from "@libs/client/useMutaion";
interface DetailStreamResponse {
  ok: boolean;
  stream: StreamWithUserAndProduct;
}
interface MessageForm {
  message: string;
}
const Stream: NextPage = () => {
  // router
  const router = useRouter();
  const { id } = router.query;

  // Fetch Stream
  const { data } = useSWR<DetailStreamResponse>(id ? `/api/stream/${id}` : null);

  //mutate Message
  const [sendMessage, { loading, data: sendMessageData }] = useMutation(
    `/api/stream/${id}/messages`
  );
  
  // React-hook-form
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<MessageForm>();

  // Form valid
  const onValid = (messageForm: MessageForm) => {
    reset();
    console.log(messageForm);
  };

  // 해당 Stream이 없을 경우 404
  useEffect(() => {
    if (data && !data?.ok) {
      router.push("/404");
    }
  }, [data, router]);
  return (
    <Layout canGoBack>
      <div className="py-10 px-4  space-y-4">
        <div className="w-full rounded-md shadow-sm bg-slate-300 aspect-video" />
        <div className="mt-5">
          <h1 className="text-3xl font-bold text-gray-900">{data?.stream?.product?.name}</h1>
          <span className="text-2xl block mt-3 text-gray-900">{data?.stream?.product?.price}</span>
          <p className=" my-6 text-gray-700">{data?.stream?.product?.description}</p>
        </div>
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Live Chat</h2>
          <div className="py-10 pb-16 h-[50vh] overflow-y-scroll  px-4 space-y-4">
            <Message message="Hi how much are you selling them for?" />
            <Message message="I want ￦20,000" reversed />
            <Message message="미쳤어" />
          </div>
          <div className="fixed py-2 bg-white  bottom-0 inset-x-0">
            <form
              onSubmit={handleSubmit(onValid)}
              className="flex relative max-w-md items-center  w-full mx-auto"
            >
              <input
                type="text"
                {...register("message", { required: true })}
                className="shadow-sm rounded-full w-full border-gray-300 focus:ring-orange-500 focus:outline-none pr-12 focus:border-orange-500"
              />
              <div className="absolute inset-y-0 flex py-1.5 pr-1.5 right-0">
                <button className="flex focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 items-center bg-orange-500 rounded-full px-3 hover:bg-orange-600 text-sm text-white">
                  &rarr;
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Stream;
