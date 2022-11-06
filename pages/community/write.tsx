import type { NextPage } from "next";
import Button from "@components/Button";
import Layout from "@components/Layout";
import TextArea from "@components/TextArea";
import { useForm } from "react-hook-form";
import useMutation from "@libs/client/useMutaion";
import { Community } from "@prisma/client";
import { useRouter } from "next/router";
import { useEffect } from "react";

interface CommunityForm {
  question: string;
}
interface WriteCommunityResponse {
  ok: boolean;
  community: Community;
}

const Write: NextPage = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CommunityForm>();
  const [community, { data, loading, error }] =
    useMutation<WriteCommunityResponse>("/api/community");

  const router = useRouter();
  console.log(data);
  const onValid = (data: CommunityForm) => {
    if (loading) return;
    community(data);
  };
  useEffect(() => {
    if (data?.ok) {
      router.push(`/community/${data.community.id}`);
    }
  }, [data, router]);
  return (
    <Layout canGoBack title="Write Post">
      <form onClick={handleSubmit(onValid)} className="p-4 space-y-4">
        <TextArea
          name="question"
          register={register("question", { required: "질문을 입력해주세요." })}
          errorMessage={errors?.question?.message}
          placeholder="Ask a question!"
        />
        <Button text="Submit" />
      </form>
    </Layout>
  );
};

export default Write;
