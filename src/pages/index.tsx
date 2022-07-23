import { type GetStaticProps, type NextPage } from "next";
import Head from "next/head";
import Link from "next/link";

import { PageWrapper } from "../components/PageWrapper";
import { getPostHeads, type PostHead } from "../lib/blog";
import homeStyles from "../styles/home.module.scss";

type Props = {
  postHeads: PostHead[];
};

export const getStaticProps: GetStaticProps<Props> = async () => {
  const postHeads = await getPostHeads("pt");

  return {
    props: { postHeads },
  };
};

const Home: NextPage<Props> = ({ postHeads }) => (
  <>
    <Head>
      <title>Luiz Felipe Gonçalves</title>
      <meta name="description" content="Luiz Felipe Gonçalves' personal blog" />
      <link rel="icon" href="/favicon.ico" />
    </Head>

    <PageWrapper>
      <header>
        <h1>Luiz Felipe Gonçalves</h1>
        <ul className={homeStyles.linkList}>
          <li>
            <a href="https://twitter.com/lffgz">Twitter</a>
          </li>
          <li>
            <a href="https://github.com/lffg">GitHub</a>
          </li>
          <li>
            <code>Discord @ Luiz#2029</code>
          </li>
        </ul>
      </header>
      <h2>Artigos</h2>
      <ul>
        {postHeads.map((head) => (
          <li key={`${head.meta.slug}-${head.meta.lang}`}>
            <Link href={`/articles/${head.meta.slug}`}>{head.title}</Link>
          </li>
        ))}
      </ul>
    </PageWrapper>
  </>
);

export default Home;
