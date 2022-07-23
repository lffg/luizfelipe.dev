import { type GetStaticPaths, type GetStaticProps, type NextPage } from "next";
import Link from "next/link";

import { Crumbs } from "../../components/crumbs";
import { Head } from "../../components/head";
import { PageWrapper } from "../../components/page-wrapper";
import { getPostBySlug, getPostHeads, type Post } from "../../lib/blog";
import articleStyles from "../../styles/article.module.scss";

type Props = {
  post: Post;
};

type Params = {
  slug: string;
};

export const getStaticPaths: GetStaticPaths<Params> = async () => {
  const postHeads = await getPostHeads("pt");

  const paths = postHeads.map((head) => ({
    params: {
      slug: head.meta.slug,
    },
  }));

  return {
    paths,
    fallback: false,
  };
};

export const getStaticProps: GetStaticProps<Props, Params> = async (ctx) => {
  const post = await getPostBySlug("pt", ctx.params!.slug);

  return {
    props: { post },
  };
};

const Article: NextPage<Props> = ({ post }) => {
  const fmt = new Intl.DateTimeFormat(post.head.meta.lang, {
    timeZone: "UTC",
    dateStyle: "long",
  });

  const date = new Date(post.head.meta.date);

  return (
    <>
      <Head title={post.head.title} />

      <PageWrapper>
        <Crumbs>blog</Crumbs>
        <div className={articleStyles.meta}>
          <span>Luiz Felipe Gonçalves</span>, <span>{fmt.format(date)}</span>
        </div>
        <h1>{post.head.title}</h1>
        <div
          id="article-content"
          className={articleStyles.articleContent}
          dangerouslySetInnerHTML={{ __html: post.html }}
        />
      </PageWrapper>
    </>
  );
};

export default Article;
