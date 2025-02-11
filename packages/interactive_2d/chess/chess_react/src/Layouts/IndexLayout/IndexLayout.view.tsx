import type { Metadata } from "next";
import type { FC, ReactNode } from "react";

import StoreProvider from "../../Store/StoreProvider";
import { CSSVariables } from "../../Components/CSSVariables";
import "@ui/SASS/index.scss";
import "./index.scss";

export const metadata: Metadata = {
  title: "Chess React & PixiJs",
  description: "Generated by create next app",
};

export type IndexLayoutViewProps = {
  children: ReactNode;
};

export const IndexLayoutView: FC<IndexLayoutViewProps> = ({ children }) => (
  <html lang="en">
    <body>
      <StoreProvider>
        <CSSVariables />

        {children}
      </StoreProvider>
    </body>
  </html>
);
