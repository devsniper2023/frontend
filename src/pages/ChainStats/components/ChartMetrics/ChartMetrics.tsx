import React from 'react';
import styled, { css } from 'styled-components';
import { FiArrowDown, FiArrowUp, FiMinus } from 'react-icons/fi';
import { Skeleton } from '@/components/layout/Skeleton';

import useChainStatsHistoryQuery from '@/hooks/api/useChainStatsHistoryQuery';
import { useLocalizedSiFormatter } from '@/utils/si.utils';
import { ChartType } from '../../types';
import { getUnitByChartType } from '../../utils';
import useNetworkStatsChartData, {
  DurationKey,
} from '../../hooks/useNetworkStatsChartData';
import { useActiveCoin } from '@/rdx/localSettings/localSettings.hooks';

const ChartMetricsContainer = styled.div`
  color: var(--text-color);
  white-space: nowrap;
`;

const CurrentMetric = styled.span`
  font-weight: 600;
  font-size: 68px;

  @media screen and (max-width: 768px) {
    font-size: 42px;
  }
`;

const MetricTypeSubtitle = styled.div`
  text-transform: uppercase;
  font-size: 14px;
  line-height: 17px;
  font-weight: 700;
  color: #4a4a4a;
  padding-left: 4px;
  position: relative;
  top: -6px;

  @media screen and (max-width: 768px) {
    top: 0;
    padding-left: 0px;
  }
`;

const MetricUnit = styled.span`
  font-weight: 600;
  font-size: 42px;

  @media screen and (max-width: 768px) {
    font-size: 28px;
  }
`;

const TrendBadge = styled.span<{ type: 'up' | 'down' | 'stay' }>`
  display: inline-flex;
  justify-content: center;
  align-items: center;
  top: -8px;
  position: relative;

  ${(p) => {
    if (p.type === 'up') {
      return css`
        background-color: #ed4f3221;
        color: var(--danger);
      `;
    } else if (p.type === 'down') {
      return css`
        background-color: #15cd7221;
        color: var(--success);
      `;
    } else {
      return css`
        background-color: #4a4a4a21;
        color: #4a4a4a;
      `;
    }
  }}

  padding: 8px 16px;
  border-radius: 8px;
  font-size: 16px;
  margin-left: 18px;

  @media screen and (max-width: 768px) {
    font-size: 12px;
    padding: 6px 8px;
    top: -5px;
    margin-left: 8px;
  }
`;

export const ChartMetricsSkeleton = styled(Skeleton)`
  width: 340px;
  height: 95.2px;
  margin: 0;
`;

const renderBadgeContent = (trend: number) => {
  let Indicator = FiArrowUp;
  let type = 'up';

  if (Math.abs(trend * 100).toFixed(2) === '0.00') {
    Indicator = FiMinus;
    type = 'stay';
  }
  if (trend < 0) {
    Indicator = FiArrowDown;
    type = 'down';
  }

  return (
    <TrendBadge type={type as any}>
      <Indicator />
      {Math.abs(trend * 100).toFixed(2)}%
    </TrendBadge>
  );
};

export const ChartMetrics = ({
  type,
  coin,
  duration,
}: {
  coin: { ticker: string; hashrateUnit: string };
  type: ChartType;
  duration: DurationKey;
}) => {
  const formatter = useLocalizedSiFormatter();

  const activeCoin = useActiveCoin(coin.ticker);

  const { data: currentDurationStats } = useNetworkStatsChartData(
    coin.ticker,
    duration
  );

  const { data: dailyStats, isLoading } = useChainStatsHistoryQuery(
    {
      coin: coin.ticker,
      duration: 'day',
      period: '10m',
    },
    {
      select: (data) => {
        return data.map(({ difficulty, blockTime }) => ({
          difficulty: difficulty,
          blocktime: blockTime,
          hashrate: (difficulty * activeCoin!.difficultyFactor) / blockTime,
        }));
      },
    }
  );

  let metricValue: string | null = null;
  let metricUnit: string | null = null;
  let trend: number | null = null;

  if (dailyStats && currentDurationStats) {
    const currentMetric = dailyStats[0][type];
    const previousMetric = currentDurationStats[0][type];

    const formattedMetric = formatter(currentMetric, {
      decimals: 2,
    });

    if (formattedMetric) {
      const [value, si] = formattedMetric.split(' ');
      metricValue = value;
      metricUnit = si + getUnitByChartType(type, coin);
    }

    trend = (currentMetric - previousMetric) / previousMetric;
  }

  if (isLoading) return <ChartMetricsSkeleton />;

  return (
    <ChartMetricsContainer>
      <CurrentMetric>{metricValue}</CurrentMetric>
      <MetricUnit>{metricUnit}</MetricUnit>
      {trend !== null && renderBadgeContent(trend)}
      <MetricTypeSubtitle>Current {type}</MetricTypeSubtitle>
    </ChartMetricsContainer>
  );
};

export default ChartMetrics;
