// TODO: Remove this TS nocheck
// @ts-nocheck
import React from 'react';
import Head from 'next/head';

import { useRouter } from 'next/router';
import { Trans, useTranslation } from 'next-i18next';
import styled from 'styled-components';
//
// import { Redirect, useRouteMatch } from 'react-router';
import { CopyButton } from 'src/components/CopyButton';
import { Img } from 'src/components/Img';
import { Content } from 'src/components/layout/Content';
import DynamicList, {
  DynamicListColumn,
} from 'src/components/layout/List/List';
import { Page } from 'src/components/layout/Page';
import { Spacer } from 'src/components/layout/Spacer';
import { LinkOut } from 'src/components/LinkOut';
import { Highlight, Mono, Ws } from 'src/components/Typo/Typo';
import { MineableCoinRegion, mineableCoins } from '../mineableCoinList';

import nh1 from './assets/nh_1.jpg';
import nh2 from './assets/nh_2.jpg';
import nh3 from './assets/nh_3.jpg';

export const ServerList: React.FC<{
  data: MineableCoinRegion[];
}> = ({ data }) => {
  const { t } = useTranslation('get-started');

  const cols: DynamicListColumn<MineableCoinRegion>[] = React.useMemo(
    () => [
      {
        title: t('detail.region.table_head.location'),
        Component: ({ data }) => {
          return (
            <Ws>
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <Img
                  src={`https://static.flexpool.io/assets/countries/${data.imageCode}.svg`}
                  style={{ width: '32px', marginRight: '10px' }}
                  alt={data.imageCode}
                />
                {t(`regions.${data.code}`)}
              </div>
            </Ws>
          );
        },
      },
      {
        title: t('detail.region.table_head.domain'),
        Component: ({ data }) => (
          <Mono>
            <Ws>
              {data.domain} <CopyButton text={data.domain} />
            </Ws>
          </Mono>
        ),
      },
      {
        title: t('detail.region.table_head.port'),
        Component: ({ data }) => (
          <Mono>
            <Ws>{data.high_diff_avail ? '14444' : '5555'}</Ws>
          </Mono>
        ),
      },
    ],
    []
  );

  const serverList = React.useMemo(() => {
    return data.filter((item) => item.high_diff_avail);
  }, []);

  return <DynamicList data={serverList} columns={cols} />;
};

const GuideImg = styled(Img)`
  max-width: 462px;
  width: 100%;
  margin-top: 2rem;
`;

export const NicehashGuidePage = () => {
  const router = useRouter();
  const ticker = router.query.ticker;

  const { t } = useTranslation('get-started');

  const mineableCoin = React.useMemo(() => {
    return mineableCoins.find((item) => item.ticker === ticker);
  }, []);

  if (!mineableCoin) {
    router.push('/get-started');
  }

  const algo =
    mineableCoin?.algorithm === mineableCoin?.nicehash_algorithm
      ? mineableCoin?.algorithm
      : `${mineableCoin?.nicehash_algorithm} (${mineableCoin?.algorithm})`;

  const stepOneDirections = t('nicehash.step_one.description', {
    returnObjects: true,
    algorithm: algo,
  });
  const stepTwoDirections = t('nicehash.step_two.description', {
    returnObjects: true,
    algorithm: algo,
  });
  const stepThreeDirections = t('nicehash.step_three.description', {
    returnObjects: true,
    algorithm: algo,
  });
  const stepFourDirections = t('nicehash.step_four.description', {
    returnObjects: true,
    algorithm: algo,
  });

  return (
    <Page>
      <Head>
        <title>{t('nicehash.head_title')}</title>
      </Head>
        <Content md paddingLg>
          <h1>{t('nicehash.title')}</h1>
          <p>{t('nicehash.description')}</p>

          <h2>
            <Highlight>#1</Highlight> {t('nicehash.step_one.title')}
          </h2>
          {stepOneDirections &&
            <>
              {stepOneDirections.map((p) => (
                <p key={p}>{p}</p>
              ))}
            </>
          }
          <LinkOut href={nh1.src}>
            <GuideImg src={nh1.src} alt="nicehash guide" />
          </LinkOut>
          <h2>
            <Highlight>#2 </Highlight>
            {t('nicehash.step_two.title')}
          </h2>
          {stepTwoDirections &&
            <>
              {stepTwoDirections.map((p) => (
                <p key={p} dangerouslySetInnerHTML={{ __html: p }}/>
              ))}
            </>
          }
          <Spacer />
          <ServerList data={mineableCoin?.regions} />
          <Spacer />
          <LinkOut href={nh2.src}>
            <GuideImg src={nh2.src} alt="nicehash guide" />
          </LinkOut>
          <h2>
            <Highlight>#3 </Highlight>
            {t('nicehash.step_three.title')}
          </h2>
          {stepThreeDirections &&
            <>
              {stepThreeDirections.map((p) => (
                <p key={p} dangerouslySetInnerHTML={{ __html: p }}/>
              ))}
            </>
          }
          <LinkOut href={nh3.src}>
            <GuideImg src={nh3.src} alt="nicehash guide" />
          </LinkOut>
          <h2>
            <Highlight>#4</Highlight> {t('nicehash.step_four.title')}
          </h2>
          {stepFourDirections &&
            <>
              {stepFourDirections.map((p) => (
                <p key={p} dangerouslySetInnerHTML={{ __html: p }}/>
              ))}
            </>
          }
        </Content>
    </Page>
  );
};
