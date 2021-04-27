import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';
import { Content } from 'src/components/layout/Content';
import { Page } from 'src/components/layout/Page';
import { Spacer } from 'src/components/layout/Spacer';

import { HeaderStat } from 'src/components/layout/StatHeader';
import { MinersDistributionChart } from './MinersDistrubution.chart';
import { TopMinersSection } from './TopMiners.section';

export const MinersPage = () => {
  const { t } = useTranslation('miners');
  return (
    <Page>
      <Helmet>
        <title>{t('head_title')}</title>
      </Helmet>
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
};

export default MinersPage;
