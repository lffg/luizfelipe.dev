import NextHead from "next/head";
import { type FC } from "react";

export type Props = {
  title: string;
  description?: string;
};

export const Head: FC<Props> = (props) => (
  <NextHead>
    <title>{props.title}</title>
    {props.description && (
      <meta name="description" content={props.description} />
    )}

    <link rel="icon" href="/favicon.ico" />
  </NextHead>
);
