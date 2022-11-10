import type { NextPage } from "next";
import FloatingButton from "@components/FloatingButton";
import Item from "@components/Item";
import Layout from "@components/Layout";
import useUser from "@libs/client/useUser";
import Head from "next/head";
import useSWR, { SWRConfig } from "swr";
import { Product } from "@prisma/client";
import { useEffect, useState } from "react";
import usePagination from "@libs/client/usePagination";
import PageNav from "@components/PageNav";
import client from "@libs/server/client";

export interface ProductWithCount extends Product {
  _count: {
    records: number;
  };
}
interface ProductsResponse {
  ok: boolean;
  products: ProductWithCount[];
  countProducts: number;
}
const Home: NextPage = () => {
  const { user } = useUser();
  const [currentPage, setCurrentPage] = useState(1);
  const { data } = useSWR<ProductsResponse>(`/api/products?page=${currentPage}`);
  const {
    currentPage: currentPageGuide,
    isfirstPage,
    plusPage,
    maxPage,
    isLastPage,
    handleClickChangePageList,
    handleClickPage,
  } = usePagination(data ? data?.countProducts : 7, 7);
  useEffect(() => {
    setCurrentPage(currentPageGuide);
  }, [currentPageGuide]);
  return (
    <Layout title="홈" hasTabBar>
      <Head>
        <title>Home</title>
      </Head>
      <div className="flex flex-col space-y-5 divide-y">
        {data?.products?.map((product) => (
          <Item
            image={product.image}
            id={product.id}
            key={product.id}
            title={product.name}
            price={product.price}
            comments={1}
            hearts={product._count.records}
          />
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
      <PageNav
        isfirstPage={isfirstPage}
        handleClickPage={handleClickPage}
        handleClickChangePageList={handleClickChangePageList}
        currentPage={currentPage}
        plusPage={plusPage}
        maxPage={maxPage}
        isLastPage={isLastPage}
      />
    </Layout>
  );
};

const Page: NextPage<ProductsResponse> = ({ products }) => {
  return (
    <SWRConfig
      value={{
        fallback: {
          "/api/products?page=1": { products },
        },
      }}
    >
      <Home />
    </SWRConfig>
  );
};

export async function getServerSideProps() {
  const products = await client.product.findMany({
    take: 7,
    skip: 0,
    include: {
      _count: {
        select: {
          records: {
            where: {
              kind: "Favorite",
            },
          },
        },
      },
    },
  });
  return {
    props: { products: JSON.parse(JSON.stringify(products)) },
  };
}
export default Page;
