import { useQuery } from 'react-query';
import { fetchApi } from '@/utils/fetchApi';
import { ApiPoolCoin } from '@/types/PoolCoin.types';

type PoolCoinsResponse = {
  coins: ApiPoolCoin[];
  countervalues: string[];
};

const usePoolCoinsQuery = () => {
  return useQuery(
    ['/pool/coins'],
    ({ queryKey }) => fetchApi<PoolCoinsResponse>(queryKey[0]),
    {
      staleTime: 30 * 60 * 1000, // 30 minutes
      keepPreviousData: true,
    }
  );
};

export default usePoolCoinsQuery;
