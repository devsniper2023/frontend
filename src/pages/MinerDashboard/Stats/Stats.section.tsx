import { Card, CardTitle } from 'src/components/layout/Card';
import { StatItem } from 'src/components/StatItem';
import { Tooltip, TooltipContent } from 'src/components/Tooltip';
import { useReduxState } from 'src/rdx/useReduxState';
import { useLocalizedSiFormatter } from 'src/utils/si.utils';
import styled from 'styled-components';
import { AverageEffectivePeriods } from './minerStats.types';

const StatItemGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(100px, 1fr));
  gap: 1rem;
  width: 100%;
`;

const StatGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
`;

const getDisplayPercentage = (
  prefix: string,
  total?: number,
  value?: number
) => {
  const displayValue =
    total && typeof value === 'number'
      ? Math.round((value / total) * 100 * 100) / 100 || '0'
      : '-';
  return `${prefix} (${displayValue}%)`;
};

const AverageTooltipItem = styled.div`
  display: flex;
  justify-content: space-between;
  line-height: 1.4;
  strong {
    margin-left: 1rem;
  }
`;

export const MinerStats: React.FC<{
  averageEffectivePeriods: AverageEffectivePeriods;
}> = ({ averageEffectivePeriods }) => {
  const minerStatsState = useReduxState('minerStats');
  const data = minerStatsState.data;
  const totalShares =
    (data && data.invalidShares + data.staleShares + data.validShares) || 0;
  const siFormatter = useLocalizedSiFormatter();

  return (
    <StatGrid>
      <Card padding>
        <CardTitle>Hashrate</CardTitle>
        <StatItemGrid>
          <StatItem
            title="Current Effective"
            value={siFormatter(data?.currentEffectiveHashrate, { unit: 'H/s' })}
          />
          <Tooltip
            icon={
              <StatItem
                title="Average Effective"
                value={siFormatter(data?.averageEffectiveHashrate, {
                  unit: 'H/s',
                })}
              />
            }
            wrapIcon={false}
          >
            <TooltipContent>
              <AverageTooltipItem>
                12h Average:{' '}
                <strong>
                  {siFormatter(averageEffectivePeriods[12], { unit: 'H/s' })}
                </strong>
              </AverageTooltipItem>
              <AverageTooltipItem>
                6h Average:{' '}
                <strong>
                  {siFormatter(averageEffectivePeriods[6], { unit: 'H/s' })}
                </strong>
              </AverageTooltipItem>
            </TooltipContent>
          </Tooltip>
          <StatItem
            title="Reported"
            value={siFormatter(data?.reportedHashrate, { unit: 'H/s' })}
          />
        </StatItemGrid>
      </Card>
      <Card padding>
        <CardTitle>Shares</CardTitle>
        <StatItemGrid>
          <StatItem
            title={getDisplayPercentage(
              'Valid',
              totalShares,
              data?.validShares
            )}
            value={siFormatter(data?.validShares, { shortenAbove: 100000 })}
          />
          <StatItem
            title={getDisplayPercentage(
              'Stale',
              totalShares,
              data?.staleShares
            )}
            value={siFormatter(data?.staleShares, { shortenAbove: 100000 })}
          />
          <StatItem
            title={getDisplayPercentage(
              'Invalid',
              totalShares,
              data?.invalidShares
            )}
            value={siFormatter(data?.invalidShares, {
              shortenAbove: 100000,
            })}
          />
        </StatItemGrid>
      </Card>
    </StatGrid>
  );
};
