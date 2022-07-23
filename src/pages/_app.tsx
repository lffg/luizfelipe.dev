import { type AppProps } from "next/app";

import "../styles/globals.scss";
import "../styles/vendor/atom-one-light.css";

const MyApp = ({ Component, pageProps }: AppProps) => (
  <Component {...pageProps} />
);

export default MyApp;
