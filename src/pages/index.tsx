import { type GetStaticProps, type NextPage } from "next";
import Link from "next/link";

import { Head } from "../components/head";
import { PageWrapper } from "../components/page-wrapper";
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
    <Head
      title="Luiz Felipe Gonçalves"
      description="Luiz Felipe Gonçalves' personal blog"
    />

    <PageWrapper>
      <header>
        <h1>Luiz Felipe Gonçalves</h1>
        <ul className={homeStyles.linkList}>
          <li>
            <Link href="/about">Sobre mim</Link>
          </li>
          <li>
            <a href="https://twitter.com/lffgz">Twitter</a>
          </li>
          <li>
            <a href="https://github.com/lffg">GitHub</a>
          </li>
          <li>
            <code style={{ fontSize: "95%" }}>Discord @ Luiz#2029</code>
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
