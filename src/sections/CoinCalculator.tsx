import { Formik } from 'formik';
import React from 'react';
import { Button } from 'src/components/Button';
import { SelectField } from 'src/components/Form/Select/Select';
import { TextField } from 'src/components/Form/TextInput';
import { Card, CardBody } from 'src/components/layout/Card';
import { Tooltip } from 'src/components/Tooltip';
import { useCounterTicker } from 'src/rdx/localSettings/localSettings.hooks';
import { ApiPoolCoinFull } from 'src/types/PoolCoin.types';
import { getDisplayCounterTickerValue } from 'src/utils/currencyValue';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

const FieldContainer = styled.div`
  display: flex;
  margin-top: 0.75rem;
  flex-wrap: wrap;
  margin-left: -0.25rem;
  margin-right: -0.25rem;
  & > * {
    margin: 0.25rem;
  }

  @media screen and (max-width: 1280px) {
    & > *:first-child {
      width: 100%;
    }
    & > *:not(:first-child) {
      flex-grow: 1;
    }
  }
`;

const Revenue = styled.div`
  font-size: 1.5rem;
  font-weight: 600;
`;

const RCounter = styled.span`
  color: var(--text-secondary);
`;

const StartMiningButton = styled(Button)`
  width: 100%;
  margin-top: 0.5rem;
  justify-content: center;
`;

type Period = 'd' | 'm' | 'y';

type PeriodObject<T> = { [k in Period]: T };

const periodsAvailable: Period[] = ['d', 'm', 'y'];
const periodMap: PeriodObject<number> = { d: 1, m: 30.5, y: 365.25 };

export const CoinCalculator: React.FC<{ coin: ApiPoolCoinFull }> = ({
  coin,
}) => {
  const siMap = { '': 1, k: 1000, M: 1000000, G: 1000000000, T: 1000000000000 };
  const counterTicker = useCounterTicker();
  const counterPrice = coin.marketData.prices[counterTicker];

  const periodNameMap: PeriodObject<string> = {
    d: 'Per Day',
    m: 'Per Month',
    y: 'Per Year',
  };

  const incomePerHash =
    coin.chainData.dailyRewardPerGigaHashSec /
    1000000000 /
    Math.pow(10, coin.decimalPlaces);

  const initValues: {
    si: keyof typeof siMap;
    period: Period;
    val: number;
  } = {
    si: 'M',
    period: 'm',
    val: 100,
  };

  return (
    <div>
      <Formik initialValues={initValues} onSubmit={() => {}}>
        {({ values }) => {
          const revenueEth = `${
            Math.round(
              values.val *
                siMap[values.si] *
                incomePerHash *
                periodMap[values.period] *
                100000
            ) / 100000
          } ${coin.ticker.toUpperCase()}`;

          const revenueCounter = getDisplayCounterTickerValue(
            Math.round(
              values.val *
                siMap[values.si] *
                incomePerHash *
                periodMap[values.period] *
                100 *
                counterPrice
            ) / 100,
            counterTicker
          );

          return (
            <Card>
              <CardBody>
                <h2>
                  Income Calculator{'  '}
                  <Tooltip>
                    <p style={{ padding: '5px', textAlign: 'center' }}>
                      The Estimated Income is calculated based on the 24-hour
                      average network difficulty and the 24-hour average block
                      reward. This calculation does not include Stale and
                      Invalid shares.
                    </p>
                  </Tooltip>
                </h2>
                <FieldContainer>
                  <TextField name="val" type="number" inputMode="decimal" />
                  <SelectField
                    name="si"
                    options={coin.applicableHashrateSiPrefixes.map((si) => {
                      return { value: si, label: `${si}H/s` };
                    })}
                  />
                  <SelectField
                    name="period"
                    options={periodsAvailable.map((period) => {
                      return { value: period, label: periodNameMap[period] };
                    })}
                  />
                </FieldContainer>
              </CardBody>
              <CardBody>
                <Revenue>
                  ≈ {revenueEth}
                  <RCounter> ({revenueCounter}) </RCounter>
                  {periodNameMap[values.period]}
                </Revenue>
              </CardBody>
            </Card>
          );
        }}
      </Formik>
      <StartMiningButton
        as={Link}
        to={`/get-started/${coin.ticker}`}
        variant="primary"
      >
        Start Mining
      </StartMiningButton>
    </div>
  );
};
