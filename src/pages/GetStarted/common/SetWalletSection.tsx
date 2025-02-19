import React from 'react';
import { DivText } from 'src/components/Typo/Typo';
import { Spacer } from 'src/components/layout/Spacer';
import { LinkOut } from 'src/components/LinkOut';
import { MineableCoin } from '../mineableCoinList';
import { Trans, useTranslation } from 'next-i18next';
import { SectionWrapper, WalletTextField } from '../common';

type SetWalletSectionProps = {
  position: number;
  data: MineableCoin;
  name?: string;
  desc?: React.ReactNode;
};

export const SetWalletSection = ({
  position,
  data,
  name = 'wallet_address',
  desc,
}: SetWalletSectionProps) => {
  const { t } = useTranslation('get-started');

  return (
    <SectionWrapper position={position} title={t('detail.wallet.title')}>
      {desc ? (
        desc
      ) : (
        <>
          <p>
            <Trans
              ns="get-started"
              i18nKey="detail.wallet.desc_one"
              components={{
                binance: (
                  <LinkOut href="https://www.binance.com/en/register?ref=B2675KF5" />
                ),
                coinbase: <LinkOut href="https://www.coinbase.com" />,
              }}
            />
          </p>
          <p>
            <Trans
              ns="get-started"
              i18nKey="detail.wallet.desc_two"
              components={{
                ledger: <LinkOut href="https://www.ledger.com/" />,
                trezor: <LinkOut href="https://trezor.io/" />,
                strong: <strong />,
              }}
            />
          </p>
        </>
      )}

      <Spacer />
      <DivText>
        <WalletTextField name={name} data={data} />
      </DivText>
    </SectionWrapper>
  );
};
