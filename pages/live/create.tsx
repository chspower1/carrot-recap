import type { NextPage } from "next";
import Button from "../../components/Button";
import Input from "../../components/Input";
import Layout from "../../components/Layout";
import TextArea from "../../components/TextArea";

const Create: NextPage = () => {
  return (
    <Layout canGoBack title="Go Live">
      <form className=" space-y-4 py-10 px-4">
        <Input required label="Name" name="name" type="text" />
        <Input required label="Price" placeholder="0.00" name="price" type="text" kind="price" />
        <TextArea name="description" label="Description" />
        <Button text="Go live" />
      </form>
    </Layout>
  );
};

export default Create;
