import { ReactElement, ReactNode, useEffect } from 'react';
import { NextPage } from 'next';
import Head from 'next/head';
import type { AppProps } from 'next/app';
import { useRouter } from 'next/router';
import { Global } from '@emotion/react';
import { globalStyles } from 'styles/globals';
import BaseLayout from 'layouts/BaseLayout';
import { AppContextProvider } from 'contexts/AppContext';
import {
  getComponentsList,
  getContentPageGroups,
} from 'utils/ContentStack/getContentstackResources';
import getFullPageTitle from 'utils/getFullPageTitle';
import * as ga from 'utils/googleAnalytics';
import { ContentPageGroup } from 'utils/ContentStack/types';

export type NextPageWithLayout = NextPage & {
  getLayout?: (page: ReactElement) => ReactNode;
};

type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout;
  components: any;
  contentPageGroups: Array<ContentPageGroup>;
};

function MyApp({
  Component,
  pageProps,
  components,
  contentPageGroups,
}: AppPropsWithLayout) {
  const getLayout = Component.getLayout ?? (page => page);
  const router = useRouter();

  useEffect(() => {
    const handleRouteChange = url => {
      ga.pageview(url);
    };
    //When the component is mounted, subscribe to router changes
    //and log those page views
    router.events.on('routeChangeComplete', handleRouteChange);

    // If the component is unmounted, unsubscribe
    // from the event with the `off` method
    return () => {
      router.events.off('routeChangeComplete', handleRouteChange);
    };
  }, [router.events]);

  // console.log(contentPageGroups[0].content_pages);

  return (
    <AppContextProvider
      components={components}
      contentPageGroups={contentPageGroups}
    >
      <Head>
        <title>{getFullPageTitle('Home')}</title>
        <meta property="og:title" content={getFullPageTitle('Home')} />
        <meta charSet="utf-8" />
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
        <meta name="generator" content="LeafyGreen UI" />
        <meta
          property="og:title"
          content="LeafyGreen - MongoDB Design System"
        />
        <meta
          property="og:site_name"
          content="LeafyGreen - MongoDB Design System"
        />
        <meta
          name="description"
          content="MongoDB's open-source, accessible design system for designing and building web applications with React."
        />
        <meta
          property="og:description"
          content="MongoDB's open-source, accessible design system for designing and building web applications with React."
        />
        <meta property="og:url" content="https://mongodb.design" />
        <meta
          name="keywords"
          content="mongodb, user interface, component library, react, design, ui, ux"
        />
      </Head>
      <Global styles={globalStyles} />
      <BaseLayout>{getLayout(<Component {...pageProps} />)}</BaseLayout>
    </AppContextProvider>
  );
}

MyApp.getInitialProps = async () => {
  const components = await getComponentsList();
  const contentPageGroups = await getContentPageGroups();
  return { components, contentPageGroups };
};

export default MyApp;
