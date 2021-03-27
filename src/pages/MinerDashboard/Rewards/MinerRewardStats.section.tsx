import { isBefore, subDays } from 'date-fns';
import React from 'react';
import { CardGrid } from 'src/components/layout/Card';
import DynamicList from 'src/components/layout/List/List';
import { useAsyncState } from 'src/hooks/useAsyncState';
import { getActiveCoinDisplayValue } from 'src/hooks/useDisplayReward';
import {
  useActiveCoin,
  useActiveCoinTicker,
  useCounterTicker,
} from 'src/rdx/localSettings/localSettings.hooks';
import { useReduxState } from 'src/rdx/useReduxState';
import { ApiMinerReward } from 'src/types/Miner.types';
import { getDisplayCounterTickerValue } from 'src/utils/currencyValue';
import { fetchApi } from 'src/utils/fetchApi';

const getIndexInterval = (index: number) => {
  switch (index) {
    case 0:
      return 'Daily';
    case 1:
      return 'Weekly';
    case 2:
      return 'Monthly';
    default:
      return 'Unknown';
  }
};

export const MinerRewardStatsSection: React.FC<{
  rewards: ApiMinerReward[];
  counterPrice: number;
  averagePoolHashrate?: number | null;
}> = ({ rewards, counterPrice = 0, averagePoolHashrate }) => {
  const dailyRewardPerGhState = useAsyncState('dailyRewGh', 0);
  const coinTicker = useActiveCoinTicker();
  const counterTicker = useCounterTicker();
  const activeCoin = useActiveCoin();

  const headerStatsState = useReduxState('minerHeaderStats');

  React.useEffect(() => {
    dailyRewardPerGhState.start(
      fetchApi('/pool/dailyRewardPerGigahashSec', {
        query: {
          coin: coinTicker,
        },
      })
    );
  }, [coinTicker]);

  const summary: [number, number, number] = React.useMemo(() => {
    const dailySum = rewards[0] ? rewards[0].totalRewards : 0;

    const weeklySum = rewards
      .filter((item) =>
        isBefore(subDays(new Date(), 7), new Date(item.timestamp * 1000))
      )
      .reduce((res, next) => {
        return res + next.totalRewards;
      }, 0);

    const monthlySum = rewards.reduce((res, next) => {
      return res + next.totalRewards;
    }, 0);

    return [dailySum, weeklySum, monthlySum];
  }, [rewards]);

  const pastData = React.useMemo(() => {
    return summary.map((item) => ({
      coinValue: item ? getActiveCoinDisplayValue(item, activeCoin) : '-',
      counterValue: item
        ? getDisplayCounterTickerValue(
            (item / Math.pow(10, activeCoin?.decimalPlaces || 1000)) *
              counterPrice,
            counterTicker
          )
        : '-',
    }));
  }, [summary, activeCoin, counterPrice, counterTicker]);

  const futureData = React.useMemo(() => {
    const daily =
      averagePoolHashrate &&
      dailyRewardPerGhState.data &&
      headerStatsState.data?.roundShare
        ? (averagePoolHashrate *
            dailyRewardPerGhState.data *
            headerStatsState.data?.roundShare) /
          1000000000
        : 0;

    return [1, 7, 30.5].map((item) => ({
      coinValue: getActiveCoinDisplayValue(daily * item, activeCoin),
      counterValue: getDisplayCounterTickerValue(
        ((item * daily) /
          Math.pow(10, activeCoin?.decimalPlaces || 1000000000)) *
          counterPrice,
        counterTicker
      ),
    }));
  }, [
    averagePoolHashrate,
    dailyRewardPerGhState.data,
    activeCoin,
    headerStatsState.data?.roundShare,
    counterPrice,
    counterTicker,
  ]);

  console.log('pastData', pastData);

  return (
    <div>
      <CardGrid>
        <div>
          <h2>Past Earnings</h2>
          <DynamicList
            data={pastData}
            columns={[
              {
                title: '',
                Component: ({ index }) => {
                  return <strong>{getIndexInterval(index)}</strong>;
                },
              },
              {
                title: coinTicker,
                Component: ({ data }) => {
                  return <>{data.coinValue}</>;
                },
              },
              {
                title: counterTicker,
                Component: ({ data }) => {
                  return <>{data.counterValue}</>;
                },
              },
            ]}
          />
        </div>
        <div>
          <h2>Forecasted Earnings</h2>
          <DynamicList
            data={futureData}
            columns={[
              {
                title: '',
                Component: ({ index }) => {
                  return <strong>{getIndexInterval(index)}</strong>;
                },
              },
              {
                title: coinTicker,
                Component: ({ data }) => {
                  return <>{data.coinValue}</>;
                },
              },
              {
                title: counterTicker,
                Component: ({ data }) => {
                  return <>{data.counterValue}</>;
                },
              },
            ]}
          />
        </div>
      </CardGrid>
    </div>
  );
};
