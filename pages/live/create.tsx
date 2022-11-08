import type { NextPage } from "next";
import Button from "@components/Button";
import Input from "@components/Input";
import Layout from "@components/Layout";
import TextArea from "@components/TextArea";
import { UploadProductForm } from "pages/products/upload";
import { useForm } from "react-hook-form";
import CreateProduct from "@components/createProduct";
import useMutation from "@libs/client/useMutaion";

const Create: NextPage = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<UploadProductForm>();
  const onValid = (data: UploadProductForm) => {};
  const [mutate, { data, loading }] = useMutation("/api/live");
  return (
    <Layout canGoBack title="Go Live">
      <CreateProduct loading={loading} mutate={mutate} />
    </Layout>
  );
};

export default Create;
