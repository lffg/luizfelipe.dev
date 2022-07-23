import { type GetStaticPaths, type GetStaticProps, type NextPage } from "next";
import Head from "next/head";
import Link from "next/link";

import { PageWrapper } from "../../components/PageWrapper";
import { getPostBySlug, getPostHeads, type Post } from "../../lib/blog";
import postStyles from "../../styles/post.module.scss";

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

const Post: NextPage<Props> = ({ post }) => {
  const fmt = new Intl.DateTimeFormat(post.head.meta.lang, {
    timeZone: "UTC",
    dateStyle: "long",
  });

  const date = new Date(post.head.meta.date);

  return (
    <>
      <Head>
        <title>Luiz Felipe Gonçalves</title>
        <meta
          name="description"
          content="Luiz Felipe Gonçalves' personal blog"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <PageWrapper>
        <div className={postStyles.crumbs}>
          <span>
            <Link href="/">luizfelipe.dev</Link>
          </span>
          <span>blog</span>
        </div>
        <div className={postStyles.meta}>
          <span>Luiz Felipe Gonçalves</span>, <span>{fmt.format(date)}</span>
        </div>
        <h1>{post.head.title}</h1>
        <div
          id="article-content"
          className={postStyles.articleContent}
          dangerouslySetInnerHTML={{ __html: post.html }}
        />
      </PageWrapper>
    </>
  );
};

export default Post;
