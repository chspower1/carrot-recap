import type { NextPage } from "next";
import Button from "@components/Button";
import Input from "@components/Input";
import Layout from "@components/Layout";
import TextArea from "@components/TextArea";
import { useForm } from "react-hook-form";
import useMutation from "@libs/client/useMutaion";
import { Product } from "@prisma/client";
import { useEffect } from "react";
import { useRouter } from "next/router";
import CreateProduct from "@components/createProduct";

// Type
export interface UploadProductForm {
  name: string;
  price: number;
  description: string;
}
interface UploadProductMutation {
  ok: boolean;
  product: Product;
}

const Upload: NextPage = () => {
  // Router
  const router = useRouter();

  // Mutation Product
  const [mutate, { data, loading }] = useMutation<UploadProductMutation>("/api/products");

  //useEffect
  useEffect(() => {
    if (data?.ok) {
      router.push(`/products/${data.product.id}`);
    }
  }, [data, router]);
  return (
    <Layout canGoBack title="Upload Product">
      <CreateProduct mutate={mutate} loading={loading} />
    </Layout>
  );
};

export default Upload;
