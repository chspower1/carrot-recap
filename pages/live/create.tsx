import type { NextPage } from "next";
import Button from "@components/Button";
import Input from "@components/Input";
import Layout from "@components/Layout";
import TextArea from "@components/TextArea";
import { UploadProductForm } from "pages/products/upload";
import { useForm } from "react-hook-form";
import CreateProduct from "@components/createProduct";
import useMutation from "@libs/client/useMutaion";
import { useRouter } from "next/router";
import { useEffect } from "react";

interface CreateStreamRespones {}
const Create: NextPage = () => {
  const router = useRouter();
  const [mutate, { data, loading }] = useMutation("/api/live");
  //useEffect
  useEffect(() => {
    if (data?.ok) {
      router.push(`/live/${data?.stream.id}`);
    }
  }, [data, router]);
  return (
    <Layout canGoBack title="Go Live">
      <CreateProduct loading={loading} mutate={mutate} />
    </Layout>
  );
};

export default Create;
