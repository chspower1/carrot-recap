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
import useSWR from "swr";
import { Product } from "@prisma/client";
import Item from "@components/Item";
import FloatingButton from "@components/FloatingButton";
import { ProductWithCount } from "pages";
import Link from "next/link";

interface CreateStreamRespones {}
interface MyProductsRespones {
  ok: boolean;
  products: ProductWithCount[];
}
const Create: NextPage = () => {
  const router = useRouter();

  // fetch products
  const { data: productData } = useSWR<MyProductsRespones>("/api/products/me");
  // mutate
  const [mutate, { data, loading }] = useMutation("/api/stream");

  const handleClickProduct = (productId: number) => {
    mutate({ productId, isNew: false });
  };

  //useEffect
  useEffect(() => {
    if (data?.ok) {
      router.push(`/stream/${data?.stream.id}`);
    }
  }, [data, router]);
  return (
    <Layout canGoBack title="Go Stream">
      <CreateProduct loading={loading} mutate={mutate} />
      <div className="flex flex-col space-y-5 divide-y">
        {productData?.products?.map((product) => (
          <div key={product.id} className="relative">
            <Item
              disableLink={true}
              id={product.id}
              title={product.name}
              price={product.price}
              comments={1}
              hearts={product._count.records}
            />
            <button
              className="absolute top-5 right-3 text-xs text-orange-500 font-black hover:text-orange-700"
              onClick={() => handleClickProduct(product.id)}
            >
              이 상품으로 라이브 진행하기!
            </button>
          </div>
        ))}
        <FloatingButton href="/products/upload">
          <svg
            className="h-6 w-6"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M12 6v6m0 0v6m0-6h6m-6 0H6"
            />
          </svg>
        </FloatingButton>
      </div>
    </Layout>
  );
};

export default Create;
