import Link from "next/link";
import { Children, type FC } from "react";

import crumbsStyles from "./crumbs.module.scss";

export type Props = {
  children: React.ReactNode;
  hideBase?: boolean;
};

export const Crumbs: FC<Props> = ({ children, hideBase = false }) => (
  <nav className={crumbsStyles.crumbs}>
    {!hideBase && (
      <div>
        <Link href="/">luizfelipe.dev</Link>
      </div>
    )}
    {Children.map(children, (node) => (
      <div>{node}</div>
    ))}
  </nav>
);
