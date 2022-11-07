import type { NextPage } from "next";
import Button from "@components/Button";
import Input from "@components/Input";
import Layout from "@components/Layout";
import { useForm } from "react-hook-form";
import { ProfileResponse } from ".";
import useSWR from "swr";
import useMutation from "@libs/client/useMutaion";
import { useEffect } from "react";
import { useRouter } from "next/router";

interface EditForm {
  name: string;
  email?: string;
  phone?: string;
}

const EditProfile: NextPage = () => {
  const router = useRouter();
  const { register, handleSubmit } = useForm<EditForm>();
  const { data: user } = useSWR<ProfileResponse>("/api/users/me");
  const [editProfile, { data: editData, loading: editLoading }] = useMutation("/api/users/edit");
  const onValid = (editForm: EditForm) => {
    console.log(editForm);
    editProfile(editForm);
  };
  useEffect(() => {
    if (editData?.ok) {
      router.push("/profile");
    }
  }, [editData]);
  return (
    <Layout canGoBack title="Edit Profile">
      <form onSubmit={handleSubmit(onValid)} className="py-10 px-4 space-y-4">
        <div className="flex items-center space-x-3">
          <div className="w-14 h-14 rounded-full bg-slate-500" />
          <label
            htmlFor="picture"
            className="cursor-pointer py-2 px-3 border hover:bg-gray-50 border-gray-300 rounded-md shadow-sm text-sm font-medium focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 text-gray-700"
          >
            Change
            <input id="picture" type="file" className="hidden" accept="image/*" />
          </label>
        </div>
        <Input
          register={register("name", { required: "이름을 입력해주세요." })}
          label="name"
          name="name"
          type="text"
          placeholder={user?.profile.name}
        />
        <Input
          register={register(user?.profile.email ? "email" : "phone", { required: true })}
          label={user?.profile.email ? "Email address" : "Phone number"}
          name={user?.profile.email ? "email" : "phone"}
          type={user?.profile.email ? "email" : "phone"}
          placeholder={user?.profile.email ? user.profile.email! : user?.profile.phone!}
        />
        <Button text="Update profile" />
      </form>
    </Layout>
  );
};

export default EditProfile;
