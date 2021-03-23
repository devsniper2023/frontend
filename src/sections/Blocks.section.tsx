import React from 'react';
import { Content } from 'src/components/layout/Content';
import DynamicList from 'src/components/layout/List/List';
import { useAsyncState } from 'src/hooks/useAsyncState';
import { useReduxState } from 'src/rdx/useReduxState';
import { fetchApi } from 'src/utils/fetchApi';
import { getDisplayLuck } from 'src/utils/luck.utils';
import format from 'date-fns/format';
import formatDuration from 'date-fns/formatDuration';
import intervalToDuration from 'date-fns/intervalToDuration';
import { useActiveCoinDisplayValue } from 'src/hooks/useDisplayReward';
import { LinkMiner } from 'src/components/LinkMiner';
import { Luck } from 'src/components/Luck';
import styled from 'styled-components';
import { Button } from 'src/components/Button';

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
  type: string;
};

type ApiBlocks = {
  totalItems: number;
  totalPages: number;
  data: ApiBlock[];
};

const Region = styled.span`
  text-transform: uppercase;
`;

const TypeBlock = styled.span`
  text-transform: capitalize;
`;
const TypeUncle = styled.span`
  text-transform: capitalize;
  opacity: 0.3;
`;

const PaginationContainer = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 1rem;
`;

const PaginationItems = styled.div`
  display: flex;
  align-items: center;
  & > * {
    margin: 0 0.25rem;
  }
`;

const PaginSplit = styled.span`
  opacity: 0.3;
`;

const Pagination: React.FC<{
  currentPage: number;
  totalPages: number;
  onPageSelect: React.MouseEventHandler<HTMLButtonElement>;
}> = ({ currentPage, totalPages, onPageSelect }) => {
  const showStart = currentPage - 1 > 0;
  const showEnd = currentPage + 2 < totalPages;

  const pageList = [
    currentPage - 1,
    currentPage,
    currentPage + 1,
    currentPage + 2,
  ]
    .filter((item) => item >= 0 && item < totalPages)
    .slice(0, 3);
  return (
    <PaginationItems>
      {showStart && (
        <>
          <Button size="sm" onClick={onPageSelect} value={0}>
            {1}
          </Button>
          <PaginSplit>—</PaginSplit>
        </>
      )}
      {pageList.map((item) => (
        <Button
          variant={currentPage === item ? 'primary' : undefined}
          key={item}
          size="sm"
          onClick={onPageSelect}
          value={item}
        >
          {item + 1}
        </Button>
      ))}
      {showEnd && (
        <>
          <PaginSplit>—</PaginSplit>
          <Button size="sm" onClick={onPageSelect} value={totalPages - 1}>
            {totalPages}
          </Button>
        </>
      )}
    </PaginationItems>
  );
};

export const BlocksSection = () => {
  const blockState = useAsyncState<ApiBlocks>('blocks', {
    totalItems: 0,
    totalPages: 0,
    data: [],
  });
  const localSettingsState = useReduxState('localSettings');
  const [currentPage, setCurrentPage] = React.useState(0);

  React.useEffect(() => {
    blockState.start(
      fetchApi('/pool/blocks', {
        query: { coin: localSettingsState.coin, page: currentPage },
      })
    );
  }, [currentPage]);

  const totalPages = blockState.data?.totalPages || 0;

  const blocks = React.useMemo(() => {
    return blockState.data?.data || [];
  }, [blockState.data]);

  const handleChangePage = React.useCallback(
    (e: React.MouseEvent<HTMLButtonElement>) => {
      const nextPage = Number((e.target as HTMLButtonElement).value);
      if (
        totalPages &&
        typeof nextPage === 'number' &&
        nextPage >= 0 &&
        nextPage < totalPages
      ) {
        setCurrentPage(nextPage);
      }
    },
    [totalPages]
  );

  return (
    <Content padding>
      <DynamicList
        data={blocks}
        columns={[
          {
            title: 'Number',
            Component: ({ data }) => <>{data.number}</>,
          },
          {
            title: 'Type',
            Component: ({ data }) =>
              data.type === 'uncle' ? (
                <TypeUncle>{data.type}</TypeUncle>
              ) : (
                <TypeBlock>{data.type}</TypeBlock>
              ),
          },
          {
            title: 'Date',
            Component: ({ data }) => (
              <>{format(data.timestamp * 1000, 'PPp')}</>
            ),
          },
          {
            title: 'Region',
            Component: ({ data }) => <Region>{data.region}</Region>,
          },
          {
            title: 'Miner',
            Component: ({ data }) => (
              <LinkMiner coin={localSettingsState.coin} address={data.miner} />
            ),
          },
          {
            title: 'Reward',
            Component: ({ data }) => {
              const displayReward = useActiveCoinDisplayValue(data.reward);

              return <>{displayReward}</>;
            },
          },
          {
            title: 'Round Time',
            Component: ({ data }) => {
              const interval = intervalToDuration({
                start: 0,
                end: data.roundTime * 1000 - 60 * 60,
              });
              console.log(interval);
              return (
                <>
                  {format(data.roundTime * 1000 - 1000 * 60 * 60, 'HH:mm:ss')}
                </>
              );
            },
          },
          {
            title: 'Luck',
            Component: ({ data }) => <Luck value={data.luck} />,
          },
        ]}
      />
      <PaginationContainer>
        <Button
          disabled={currentPage === 0}
          size="sm"
          onClick={handleChangePage}
          value={currentPage - 1}
        >
          Prev
        </Button>
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages || 0}
          onPageSelect={handleChangePage}
        />
        <Button
          disabled={currentPage >= totalPages - 1}
          size="sm"
          onClick={handleChangePage}
          value={currentPage + 1}
        >
          Next
        </Button>
      </PaginationContainer>
    </Content>
  );
};
