import React from 'react';
import { Helmet } from 'react-helmet-async';

import { Content } from 'src/components/layout/Content';
import { SelectCoin } from 'src/components/SelectCoin';
import { StatBox, StatBoxContainer } from 'src/components/StatBox';
import { useAsyncState } from 'src/hooks/useAsyncState';
import { fetchApi } from 'src/utils/fetchApi';
import { formatSi } from 'src/utils/si.utils';
import styled from 'styled-components/macro';

const Hero = styled.div`
  /* background: var(--primary); */
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
`;

export const StatisticsPage = () => {
  const statsState = useAsyncState('poolStats');
  const init = { query: { coin: 'eth' } };

  React.useEffect(() => {
    statsState.start(
      Promise.all([
        fetchApi<{
          total: number;
        }>('/pool/hashrate', init),
        fetchApi<number>('/pool/averageLuck', init),
        fetchApi<number>('/pool/minerCount', init),
        fetchApi<number>('/pool/workerCount', init),
      ])
    );
  }, []);

  return (
    <Hero>
      <Helmet>
        <title>Statistics</title>
      </Helmet>
      <Content padding>
        <Header>
          <h1>Pool Statistics</h1>
          <SelectCoin />
        </Header>
      </Content>
      {!!statsState.data && (
        <Content>
          <StatBoxContainer>
            <StatBox
              title="Pool hashrate"
              value={formatSi(statsState.data[0].total, 'H/s')}
            />
            <StatBox
              title="Average Luck"
              value={`${Math.round(statsState.data[1] * 100 * 10) / 10}%`}
            />
            <StatBox title="Miners" value={statsState.data[2]} />
            <StatBox title="Workers" value={statsState.data[3]} />
          </StatBoxContainer>
        </Content>
      )}
    </Hero>
  );
};
