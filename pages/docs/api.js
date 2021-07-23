import { Content } from 'src/components/layout/Content';
import { Page } from 'src/components/layout/Page';
import { Spacer } from 'src/components/layout/Spacer';
import SwaggerUI from 'swagger-ui-react';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

export const ApiDocsPage = () => {
  return (
    <Page>
      <Content padding>
        <Spacer size="xl" />
        <SwaggerUI url="https://static.flexpool.io/api/openapi.json" />
        <Spacer size="xl" />
      </Content>
    </Page>
  );
};

export default ApiDocsPage;

export async function getStaticProps({ locale }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ['common'])),
    },
  };
}
