import type { NextPage } from "next";
import Item from "@components/Item";
import Layout from "@components/Layout";
import useSWR from "swr";
import { RecordResponsse } from "./bought";

const Loved: NextPage = () => {
  const { data } = useSWR<RecordResponsse>("/api/users/me/record?kind=Favorite");
  return (
    <Layout title="좋아요 목록" canGoBack>
      <div className="flex flex-col space-y-5 pb-10  divide-y">
        {data?.records?.map(({ product }) => (
          <Item
            key={product.id}
            id={product.id}
            title={product.name}
            price={product.price}
            hearts={product._count.records}
          />
        ))}
      </div>
    </Layout>
  );
};

export default Loved;
