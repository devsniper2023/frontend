import React from 'react';
import Head from 'next/head';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

import { Content } from '../src/components/layout/Content';
import { Page } from '../src/components/layout/Page';
import { Spacer } from '../src/components/layout/Spacer';
import { HeaderStat } from '../src/components/layout/StatHeader';
import { MinersDistributionChart } from '../src/pages/Miners/components/MinerDistrubutionChart/MinersDistrubution.chart';
import { TopMinersSection } from '../src/pages/Miners/components/TopMiners/TopMiners.section';

function MinersPage() {
  const { t } = useTranslation('miners');

  return (
    <Page>
      <Head>
        <title>{t('head_title')}</title>
      </Head>
      <HeaderStat>
        <h1>{t('title')}</h1>
      </HeaderStat>
      <Content padding>
        <TopMinersSection />
        <MinersDistributionChart />
      </Content>
      <Spacer size="xl" />
    </Page>
  );
}

export default MinersPage;

export async function getStaticProps({ locale }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, [
        'common',
        'miners',
        'cookie-consent',
      ])),
    },
  };
}
