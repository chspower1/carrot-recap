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
import Image from "next/image";
import localImage from "../../public/local.jpg";
interface EditForm {
  avatar: FileList;
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
  const avatar = watch("avatar");

  const onValid = async ({ name, email, phone }: EditForm) => {
    console.log(name, email, phone);
    if (avatar && avatar.length > 0 && user) {
      const { uploadURL } = await (await fetch("/api/files")).json();
      const form = new FormData();
      form.append("file", avatar[0], user.id + "");
      const {
        result: { id },
      } = await (
        await fetch(uploadURL, {
          method: "POST",
          body: form,
        })
      ).json();
      editProfile({
        name,
        email,
        phone,
        avatar: `${process.env.NEXT_PUBLIC_IMG_URL}/${id}/avatar`,
      });
    }
    editProfile({ name, email, phone });
  };

  useEffect(() => {
    if (avatar && avatar.length > 0) {
      const file = avatar[0];
      console.log(URL.createObjectURL(file));
      setImagePreview(URL.createObjectURL(file));
    }
  }, [avatar]);

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
          <Image
            src={imagePreview ? imagePreview : user?.avatar ? user.avatar : localImage}
            width={44}
            height={44}
            className="w-14 h-14 rounded-full bg-slate-500 object-cover"
            alt="user"
          />
          <label
            htmlFor="picture"
            className="cursor-pointer py-2 px-3 border hover:bg-gray-50 border-gray-300 rounded-md shadow-sm text-sm font-medium focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 text-gray-700"
          >
            Change
            <input
              {...register("avatar")}
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
