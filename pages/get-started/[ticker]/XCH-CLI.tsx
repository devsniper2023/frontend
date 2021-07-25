import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

import { Content } from '../../../src/components/layout/Content';
import { Page } from '../../../src/components/layout/Page';
import { ChiaCliGuidePage } from '../../../src/pages/GetStarted/ChiaCli/Guide.page';

export const GetStartedPage = () => {
  return (
    <Page>
      {/* <Helmet>
        <title>Start mining with Flexpool</title>
      </Helmet> */}
      <Content paddingLg>
        <ChiaCliGuidePage />
      </Content>
    </Page>
  );
};

export default GetStartedPage;

export async function getStaticProps({ locale }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, [
        'common',
        'get-started',
        'nicehash',
        'cookie-consent',
      ])),
    },
  };
}

export async function getStaticPaths() {
  return {
    paths: [],
    fallback: 'blocking',
  };
}
