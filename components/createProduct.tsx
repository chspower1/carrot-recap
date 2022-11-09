import type { NextPage } from "next";
import Button from "@components/Button";
import Input from "@components/Input";
import Layout from "@components/Layout";
import TextArea from "@components/TextArea";
import { useForm } from "react-hook-form";
import { Product } from "@prisma/client";
import { useEffect, useState } from "react";
import Image from "next/image";
import useUser from "@libs/client/useUser";
import useImageUpload from "@libs/client/useImageUpload";

// Type
interface UploadProductForm {
  image: FileList;
  name: string;
  price: number;
  description: string;
}
interface UploadProductMutation {
  ok: boolean;
  product: Product;
}
interface CreateProductProps {
  loading: boolean;
  mutate: (data: any) => void;
}
export default function CreateProduct({ loading, mutate }: CreateProductProps) {
  const { user } = useUser();
  const { imageUpload } = useImageUpload();
  const [imagePreview, setImagePreview] = useState("");
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
  } = useForm<UploadProductForm>();
  const image = watch("image");
  const onValid = async ({ name, price, description }: UploadProductForm) => {
    if (loading) return;
    if (image && image.length > 0 && user) {
      const { id } = await imageUpload({
        image,
        userId: user.id,
        category: "product",
      });
      mutate({
        name,
        price,
        description,
        image: `${process.env.NEXT_PUBLIC_IMG_URL}/${id}/public`,
        isNew: true,
      });
    } else {
      mutate({ name, price, description, isNew: true });
    }
    reset();
  };
  useEffect(() => {
    if (image && image.length > 0) {
      const file = image[0];
      console.log(URL.createObjectURL(file));
      setImagePreview(URL.createObjectURL(file));
    }
  }, [image]);
  return (
    <form className="p-4 space-y-4" onSubmit={handleSubmit(onValid)}>
      <div>
        <label className="relative w-full cursor-pointer text-gray-600 hover:border-orange-500 hover:text-orange-500 flex items-center justify-center border-2 border-dashed border-gray-300 h-48 rounded-md">
          {imagePreview ? (
            <Image src={imagePreview} fill alt="Product Image" className="object-contain" />
          ) : (
            <svg
              className="h-12 w-12"
              stroke="currentColor"
              fill="none"
              viewBox="0 0 48 48"
              aria-hidden="true"
            >
              <path
                d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          )}
          <input {...register("image")} className="hidden" type="file" accept="image/*" />
        </label>
      </div>
      <Input
        label="Name"
        name="name"
        type="text"
        errorMessage={errors.name?.message}
        register={register("name", { required: "이름을 입력해주세요." })}
      />
      <Input
        label="Price"
        name="price"
        type="number"
        kind="price"
        placeholder="0.00"
        errorMessage={errors.price?.message}
        register={register("price", { required: "가격을 입력해주세요.", valueAsNumber: true })}
      />
      <TextArea
        name="description"
        label="Description"
        errorMessage={errors.description?.message}
        register={register("description", { required: "설명을 입력해주세요." })}
      />
      <Button text={loading ? "Loading" : "Upload item"} />
    </form>
  );
}
