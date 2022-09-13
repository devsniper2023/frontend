import React from 'react';
import { useRouter } from 'next/router';
import { useTranslation } from 'next-i18next';

import { Page } from 'src/components/layout/Page';

import { MineableCoinHardware, mineableCoins } from '../mineableCoinList';
import { ViewDashboardSection } from '../GPU/ViewDashboard.section';
import merge from 'lodash.merge';
import { NextSeo } from 'next-seo';

import { SetWorkerNameSection } from '../common/SetWorkerNameSection';
import { SetWalletSection } from './SetWalletSection';
import { PingTestSection } from '../common/PingTestSection';
import { MinerCommandSection } from '../common/MinerCommand.section';
import GuideForm from '../common/GuideForm';
import MainCoinButtonGroup from './MainCoinButtonGroup';
import ViewDashboard from './ViewDashboard';

import { SectionWrapper } from '../common/SectionWrapper';

export const MineableCoinGuidePage: React.FC = () => {
  const router = useRouter();
  const ticker = router.query.ticker;
  const { t, i18n } = useTranslation('get-started');
  const { t: seoT } = useTranslation('seo');

  const mineableCoin = React.useMemo(() => {
    return mineableCoins.find((item) => item.ticker === ticker);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const jsonHw = t(`detail_${ticker}.hardware`, {
    returnObjects: true,
  }) as MineableCoinHardware[];

  const mineableCoinConfig = React.useMemo(() => {
    const mergedHw = merge(mineableCoin?.hardware, jsonHw);
    return mergedHw.find(
      (item) =>
        item.key ===
        router.pathname.substring(router.pathname.lastIndexOf('/') + 1)
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!mineableCoin || !mineableCoinConfig) {
    if (typeof window !== 'undefined') {
      router.push('/get-started');
    }
    return null;
  }

  const seoTitle = seoT('title.get_started_gpu', {
    coinName: mineableCoin.name,
    coinTicker: mineableCoin.ticker.toUpperCase(),
  });

  const seoDescription = seoT('website_description.get_started_gpu', {
    coinName: mineableCoin.name,
    coinTicker: mineableCoin.ticker.toUpperCase(),
    coinAlgorithm: mineableCoin.algorithm,
  });

  return (
    <Page>
      <NextSeo
        title={seoTitle}
        description={seoDescription}
        openGraph={{
          title: seoTitle,
          description: seoDescription,
          locale: i18n.language,
        }}
        additionalMetaTags={[
          {
            property: 'keywords',
            content: seoT('keywords.get_started_gpu', {
              coinName: mineableCoin.name,
              coinTicker: mineableCoin.ticker.toUpperCase(),
              coinAlgorithm: mineableCoin.algorithm,
            }),
          },
        ]}
      />

      {/* TODO: i18n */}
      <h1>GPU Dual Mining Zilliqa (ZIL)</h1>

      <GuideForm
        initialValue={{
          worker_name: '',
          main_wallet_address: '',
          dual_wallet_address: '',
          main_primary_server: '',
          main_secondary_server: '',
          dual_primary_server: 'zil.flexpool.io',
          dual_secondary_server: 'zil.flexpool.io',
          main_coin: 'eth',
        }}
      >
        {({ values }) => {
          const isMiningEth = values.main_coin === 'eth';

          return (
            <>
              <SectionWrapper
                position={1}
                title="Select your dual mining config"
              >
                <p>This is the main coin you mine when dual mining ZIL.</p>
                <MainCoinButtonGroup name="main_coin" />
              </SectionWrapper>

              <SetWorkerNameSection position={2} />

              <SetWalletSection
                position={3}
                data={
                  values.main_coin === 'eth'
                    ? mineableCoins[0]
                    : mineableCoins[1]
                }
                nameMain="main_wallet_address"
                nameDual="dual_wallet_address"
              />

              <PingTestSection
                position={4}
                data={
                  isMiningEth
                    ? mineableCoins[0].regions
                    : mineableCoins[1].regions
                }
                namePrimary="main_primary_server"
                nameSecondary="main_secondary_server"
              />

              <MinerCommandSection
                data={mineableCoins[3].hardware[0].miners}
                replaces={{
                  ALGO: isMiningEth ? 'ethash' : 'etchash',
                  CLOSEST_SERVER:
                    values.main_primary_server || 'PRIMARY_SERVER',
                  BACKUP_SERVER:
                    values.main_secondary_server || 'BACKUP_SERVER',
                  MAIN_WALLET_ADDRESS:
                    values.main_wallet_address || 'MAIN_WALLET_ADDRESS',
                  DUAL_WALLET_ADDRESS:
                    values.dual_wallet_address || 'DUAL_WALLET_ADDRESS',
                  WORKER_NAME: values.worker_name || 'WORKER_NAME',
                }}
              />

              {values.main_wallet_address && values.dual_wallet_address && (
                <ViewDashboard
                  primary={{
                    coin: isMiningEth ? mineableCoins[0] : mineableCoins[1],
                    address: values.main_wallet_address,
                  }}
                  dual={{
                    coin: mineableCoins[3],
                    address: values.dual_wallet_address,
                  }}
                />
              )}
            </>
          );
        }}
      </GuideForm>
    </Page>
  );
};
