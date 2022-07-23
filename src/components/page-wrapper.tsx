import { type FC, type ReactNode } from "react";

import commonStyles from "../styles/common.module.scss";

export type Props = {
  children: ReactNode;
};

export const PageWrapper: FC<Props> = ({ children }) => (
  <div className={commonStyles.container}>{children}</div>
);
