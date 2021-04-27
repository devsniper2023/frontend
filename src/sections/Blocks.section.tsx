import React from 'react';
import DynamicList, {
  DynamicListColumn,
} from 'src/components/layout/List/List';
import { useAsyncState } from 'src/hooks/useAsyncState';
import { fetchApi } from 'src/utils/fetchApi';
import format from 'date-fns/format';
import { useLocalizedActiveCoinValueFormatter } from 'src/hooks/useDisplayReward';
import { LinkMiner } from 'src/components/LinkMiner';
import { Luck } from 'src/components/Luck';
import styled from 'styled-components';
import { getCoinLink } from 'src/utils/coinLinks.utils';
import { useActiveCoinTicker } from 'src/rdx/localSettings/localSettings.hooks';
import { LinkOut, LinkOutCoin } from 'src/components/LinkOut';
import { Mono, Ws } from 'src/components/Typo/Typo';
import { dateUtils } from 'src/utils/date.utils';
import { Tooltip, TooltipContent } from 'src/components/Tooltip';
import { LoaderSpinner } from 'src/components/Loader/LoaderSpinner';
import { useTranslation } from 'react-i18next';

const UnconfirmedSpinner = styled(LoaderSpinner)`
  width: 14px;
  height: 14px;
  overflow: hidden;
  display: inline-block;
  margin-left: 0.5rem;
  svg circle {
    stroke: var(--text-tertiary);
  }
`;

type ApiBlock = {
  confirmed: boolean;
  difficulty: number;
  hash: string;
  luck: number;
  miner: string;
  number: number;
  region: string;
  reward: number;
  roundTime: number;
  timestamp: number;
  type: 'block' | 'uncle' | 'orphan';
};

type ApiBlocks = {
  totalItems: number;
  totalPages: number;
  data: ApiBlock[];
};

const Region = styled.span`
  text-transform: uppercase;
`;

const BlockLink = styled(LinkOut)`
  color: var(--text-primary);
`;

const BlockType = styled.span<{ type: ApiBlock['type'] }>`
  display: inline-block;
  text-transform: capitalize;
  white-space: nowrap;
  & + * {
    margin-left: 0.5rem;
  }

  ${(p) =>
    p.type === 'uncle' &&
    `
      color: var(--warning);
  `}
  ${(p) =>
    p.type === 'orphan' &&
    `
      color: var(--text-tertiary);
  `}

  + * svg {
    fill: var(--text-tertiary);
  }
`;

export const BlocksSection: React.FC<{ address?: string }> = ({ address }) => {
  const { t } = useTranslation('blocks');
  const blockState = useAsyncState<ApiBlocks>('blocks', {
    totalItems: 0,
    totalPages: 0,
    data: [],
  });
  const coinTicker = useActiveCoinTicker();
  const [currentPage, setCurrentPage] = React.useState(0);

  const activeCoinFormatter = useLocalizedActiveCoinValueFormatter();

  React.useEffect(() => {
    blockState.start(
      fetchApi(address ? '/miner/blocks' : '/pool/blocks', {
        query: { coin: coinTicker, page: currentPage, address },
      })
    );
    // eslint-disable-next-line
  }, [currentPage, coinTicker, address]);

  const totalPages = blockState.data?.totalPages || 0;

  const blocks = React.useMemo(() => {
    return blockState.data?.data || [];
  }, [blockState.data]);

  const blockCols: {
    [key: string]: DynamicListColumn<
      ApiBlock,
      {
        coinTicker: string;
        totalPages: number;
        currentPage: number;
        totalItems: number;
      }
    >;
  } = React.useMemo(
    () => ({
      countNumber: {
        title: '#',
        skeletonWidth: 40,
        Component: ({ config, index }) => {
          return (
            <Mono>
              #
              {(config.totalItems % 10) -
                index +
                (config.totalPages - (config.currentPage + 1)) * 10}
            </Mono>
          );
        },
      },
      number: {
        title: t('table.table_head.number'),
        skeletonWidth: 80,
        Component: ({ data, config }) => {
          const url = getCoinLink('block', data.hash, config.coinTicker);

          const content = (
            <Ws>
              {data.number}
              {!data.confirmed && (
                <Tooltip icon={<UnconfirmedSpinner />}>
                  <TooltipContent message={t('waiting_confirmation_tooltip')} />
                </Tooltip>
              )}
            </Ws>
          );

          if (url) {
            return <BlockLink href={url}>{content}</BlockLink>;
          }
          return <>{content}</>;
        },
      },
      type: {
        title: t('table.table_head.type'),
        skeletonWidth: 50,
        Component: ({ data }) => {
          const msg =
            data.type === 'orphan'
              ? t('orphan_tooltip')
              : data.type === 'uncle'
              ? t('uncle_tooltip')
              : null;

          return (
            <Ws>
              <BlockType type={data.type}>{t(`type.${data.type}`)}</BlockType>
              {msg && (
                <Tooltip>
                  <TooltipContent
                    message={msg}
                    // action={<a href="/">Learn more</a>}
                  />
                </Tooltip>
              )}
            </Ws>
          );
        },
      },
      date: {
        title: t('table.table_head.date'),
        skeletonWidth: 180,
        Component: ({ data }) => (
          <Ws>{format(data.timestamp * 1000, 'PPp')}</Ws>
        ),
      },
      region: {
        title: t('table.table_head.region'),
        skeletonWidth: 40,
        Component: ({ data }) => <Region>{data.region}</Region>,
      },
      miner: {
        title: t('table.table_head.miner'),
        skeletonWidth: 210,
        Component: ({ data, config }) => (
          <Mono>
            <Ws>
              <LinkMiner coin={config.coinTicker} address={data.miner} />
            </Ws>
          </Mono>
        ),
      },
      reward: {
        title: t('table.table_head.reward'),
        alignRight: true,
        skeletonWidth: 80,
        Component: ({ data }) => {
          return (
            <Mono>
              <Ws>{activeCoinFormatter(data.reward)}</Ws>
            </Mono>
          );
        },
      },
      roundTime: {
        title: t('table.table_head.round_time'),
        skeletonWidth: 75,
        Component: ({ data }) => {
          return (
            <Ws>
              {dateUtils.durationWords(data.roundTime, {
                includeSeconds: true,
                short: true,
              })}
            </Ws>
          );
        },
      },
      luck: {
        title: t('table.table_head.luck'),
        skeletonWidth: 70,
        Component: ({ data }) => <Luck value={data.luck} />,
      },
      blockHash: {
        title: t('table.table_head.hash'),
        skeletonWidth: 200,
        alignRight: true,
        Component: ({ data, config }) => (
          <Mono>
            <Ws>
              <LinkOutCoin
                type="block"
                hash={data.hash}
                hashLength={10}
                coin={config.coinTicker}
              />
            </Ws>
          </Mono>
        ),
      },
    }),
    [activeCoinFormatter, t]
  );

  const columns = React.useMemo(() => {
    // if no address, displaying default view
    if (!address) {
      return [
        blockCols.number,
        blockCols.type,
        blockCols.date,
        blockCols.region,
        blockCols.miner,
        blockCols.reward,
        blockCols.roundTime,
        blockCols.luck,
      ];
    }
    return [
      blockCols.countNumber,
      blockCols.number,
      blockCols.type,
      blockCols.date,
      blockCols.region,
      blockCols.reward,
      blockCols.blockHash,
    ];
  }, [address, blockCols]);

  return (
    <>
      {address && blockState.data && blockState.data.totalItems > 0 && (
        <h2>{t('table.title_miner', { count: blockState.data.totalItems })}</h2>
      )}
      {!address && blockState.data && blockState.data.totalItems > 0 && (
        <h2>{t('table.title', { count: blockState.data.totalItems })}</h2>
      )}
      <DynamicList
        pagination={{
          currentPage,
          setCurrentPage,
          totalPages,
        }}
        isLoading={blockState.isLoading}
        loadingRowsCount={10}
        data={blocks}
        config={{
          coinTicker,
          totalPages,
          totalItems: blockState.data?.totalItems || 0,
          currentPage,
        }}
        columns={columns}
        contentEmpty={
          <h3>
            {!!address
              ? t('table.title_miner', { count: 0 })
              : t('table.title', { count: 0 })}
          </h3>
        }
      />
    </>
  );
};
