import React from 'react';
import { Helmet } from 'react-helmet-async';
import { useRouteMatch } from 'react-router';
import { useAsyncState } from 'src/hooks/useAsyncState';
import {
  useActiveCoinTicker,
  useCounterTicker,
} from 'src/rdx/localSettings/localSettings.hooks';
import { useReduxState } from 'src/rdx/useReduxState';
import { ApiMinerReward } from 'src/types/Miner.types';
import { fetchApi } from 'src/utils/fetchApi';
import { MinerPplnsStats } from './MinerPplnsStats.section';
import { MinerRewardStatsSection } from './MinerRewardStats.section';
import RewardsChart from './Rewards.chart';

export const MinerRewardsPage = () => {
  const {
    params: { address },
  } = useRouteMatch<{ address: string }>();

  const poolStatsState = useReduxState('poolStats');

  const minerRewardsState = useAsyncState<{
    price: number;
    data: ApiMinerReward[];
  }>('minerRewards', { price: 0, data: [] });

  const coinTicker = useActiveCoinTicker();
  const counterTicker = useCounterTicker();

  React.useEffect(() => {
    minerRewardsState.start(
      fetchApi('/miner/rewards', {
        query: {
          address,
          coin: coinTicker,
          countervalue: counterTicker,
        },
      })
    );
  }, [address, coinTicker, counterTicker]);

  return (
    <>
      <Helmet>
        <title>Miner rewards</title>
      </Helmet>
      <RewardsChart
        counterPrice={minerRewardsState.data?.price || 0}
        rewards={minerRewardsState.data?.data || []}
        error={minerRewardsState.error}
        isLoading={minerRewardsState.isLoading}
      />
      <MinerRewardStatsSection
        counterPrice={minerRewardsState.data?.price || 0}
        rewards={minerRewardsState.data?.data || []}
        averagePoolHashrate={poolStatsState.data?.averageHashrate}
      />
      <MinerPplnsStats
        averagePoolHashrate={poolStatsState.data?.averageHashrate}
        poolHashrate={poolStatsState.data?.hashrate.total}
      />
    </>
  );
};
