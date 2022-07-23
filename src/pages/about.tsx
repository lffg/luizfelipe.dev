import { type NextPage } from "next";

import { Crumbs } from "../components/crumbs";
import { PageWrapper } from "../components/page-wrapper";
import { Head } from "../components/head";

const About: NextPage = () => (
  <>
    <Head title="About &middot; Luiz Felipe Gonçalves" />

    <PageWrapper>
      <Crumbs>about me</Crumbs>
      <h1>About me</h1>
      <p>Hello, world!</p>
    </PageWrapper>
  </>
);

export default About;
