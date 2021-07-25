import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

import { Content } from '../../../src/components/layout/Content';
import { Page } from '../../../src/components/layout/Page';
import { NicehashGuidePage } from '../../../src/pages/GetStarted/Nicehash/NicehashGuide.page';

export const GetStartedNicehashPage = () => {
  return (
    <Page>
      {/* <Helmet>
        <title>Start mining with Flexpool</title>
      </Helmet> */}
      <Content paddingLg>
        <NicehashGuidePage />
      </Content>
    </Page>
  );
};

export default GetStartedNicehashPage;

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
