import Layout from "@components/Layout";
import client from "@libs/server/client";
import { Product } from "@prisma/client";
import { readdirSync, readFileSync } from "fs";
import matter from "gray-matter";
export default function Blog({
  blogPosts,
}: {
  blogPosts: {
    title: string;
    data: string;
    category: string;
  }[];
}) {
  return (
    <Layout title="Blog" seoTitle="Blog">
      <>
        <div>안녕하세요zz</div>
        {blogPosts.map((post, index) => (
          <div key={index}>
            <div>{post.title}</div>
            <div>{post.data}</div>
            <div>{post.category}</div>
          </div>
        ))}
      </>
    </Layout>
  );
}
export async function getStaticProps() {
  const blogPosts = readdirSync("./posts").map((file) => {
    const content = readFileSync(`./posts/${file}`, "utf-8");
    return matter(content).data;
  });
  console.log(blogPosts);
  return {
    props: { blogPosts },
  };
}
