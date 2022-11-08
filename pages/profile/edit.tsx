import type { NextPage } from "next";
import Button from "@components/Button";
import Input from "@components/Input";
import Layout from "@components/Layout";
import { useForm } from "react-hook-form";
import { ProfileResponse } from ".";
import useSWR from "swr";
import useMutation from "@libs/client/useMutaion";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import useUser from "@libs/client/useUser";
import { watch } from "fs";
import { url } from "inspector";

interface EditForm {
  avator: FileList;
  name: string;
  email?: string;
  phone?: string;
}

const EditProfile: NextPage = () => {
  const router = useRouter();
  const { register, handleSubmit, watch, setValue } = useForm<EditForm>();
  const [imagePreview, setImagePreview] = useState("");
  const { user } = useUser();
  const [editProfile, { data: editData, loading: editLoading }] = useMutation("/api/users/edit");
  const avator = watch("avator");
  const onValid = ({ name, email, phone }: EditForm) => {
    console.log(name, email, phone);
    if (avator && avator.length > 0) {
      // ask for CFurl
      editProfile({ name, email, phone, avatorUrl: "" });
    }
    editProfile({ name, email, phone });
  };
  useEffect(() => {
    if (avator && avator.length > 0) {
      console.log(avator);
      const file = avator[0];
      console.log(URL.createObjectURL(file));
      setImagePreview(URL.createObjectURL(file));
    }
  }, [avator]);
  useEffect(() => {
    if (editData?.ok) {
      router.push("/profile");
    }
  }, [editData, router]);
  useEffect(() => {
    if (user) {
      setValue("name", user.name);
      if (user?.email) {
        setValue("email", user.email);
      } else if (user?.phone) {
        setValue("phone", user.phone);
      }
    }
  }, [user, setValue]);
  return (
    <Layout canGoBack title="Edit Profile">
      <form onSubmit={handleSubmit(onValid)} className="py-10 px-4 space-y-4">
        <div className="flex items-center space-x-3">
          <img src={imagePreview} className="w-14 h-14 rounded-full bg-slate-500" />
          <label
            htmlFor="picture"
            className="cursor-pointer py-2 px-3 border hover:bg-gray-50 border-gray-300 rounded-md shadow-sm text-sm font-medium focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 text-gray-700"
          >
            Change
            <input
              {...register("avator")}
              id="picture"
              type="file"
              className="hidden"
              accept="image/*"
            />
          </label>
        </div>
        <Input
          register={register("name", { required: "이름을 입력해주세요." })}
          label="name"
          name="name"
          type="text"
          placeholder={user?.name}
        />
        {!user ? (
          <Input
            register={register("email", { required: true })}
            label="loading"
            name="loading"
            type="text"
            placeholder="loading"
          />
        ) : (
          <Input
            register={register(user?.email ? "email" : "phone", { required: true })}
            label={user?.email ? "Email address" : "Phone number"}
            name={user?.email ? "email" : "phone"}
            type={user?.email ? "email" : "phone"}
            placeholder={user?.email ? user.email! : user?.phone!}
          />
        )}

        <Button text="Update profile" />
      </form>
    </Layout>
  );
};

export default EditProfile;
