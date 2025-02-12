import { useState, useEffect, useContext } from "react";
import { useRouter } from "next/router";
import { AppProps } from "next/app";
import { appWithTranslation, useTranslation } from "next-i18next";
import { Refine } from "@refinedev/core";
import routerProvider from "@refinedev/nextjs-router";
import { DataProvider } from "@refinedev/strapi-v4";
import CustomSlider from "@components/customSlider";
import "@refinedev/antd/dist/reset.css";
import { authProvider, axiosInstance } from "src/authProvider";
import { API_URL } from "src/constants";
import { NextPage } from "next";
import { BackTop, Layout } from "antd";
import { Analytics } from "@vercel/analytics/react";
export type NextPageWithLayout<P = {}, IP = P> = NextPage<P, IP> & {
  noLayout?: boolean;
};

type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout;
};

const CustomLayout = ({ children }: { children: React.ReactNode }) => {
  const router = useRouter();
  const { pathname } = router;
  const pathSegments = pathname.split("/");
  const lastSegment = pathSegments[pathSegments.length - 1];
  const [selectedKey, setSelectedKey] = useState("1");

  useEffect(() => {
    setSelectedKey(lastSegment);
  }, []);

  const setSelectedKeyHandler = (key: string) => {
    setSelectedKey(key);
  };

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Analytics />
      <CustomSlider
        selectedKey={selectedKey}
        setSelectedKey={setSelectedKeyHandler}
      />

      <Layout>
        <Layout.Content
          style={{
            padding: "20px",
            backgroundColor: "white",
            minHeight: 280,
          }}
        >
          {children}
          <BackTop />
        </Layout.Content>
      </Layout>
    </Layout>
  );
};

function MyApp({ Component, pageProps }: AppPropsWithLayout): JSX.Element {
  const renderComponent = () => {
    if (Component.noLayout) {
      return <Component {...pageProps} />;
    }

    return (
      <CustomLayout>
        <Component {...pageProps} />
      </CustomLayout>
    );
  };

  return (
    <Refine
      routerProvider={routerProvider}
      authProvider={authProvider}
      dataProvider={DataProvider(API_URL + `/api`, axiosInstance)}
      resources={[]}
    >
      {renderComponent()}
    </Refine>
  );
}

export default appWithTranslation(MyApp);
