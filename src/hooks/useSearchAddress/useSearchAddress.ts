import { useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { useRouter } from 'next/router';
import { addressSearchSet } from 'src/rdx/addressSearch/addressSearch.actions';
import { getChecksumByTicker } from '@/utils/validators/checksum';

const useSearchAddress = () => {
  const dispatch = useDispatch();
  const router = useRouter();

  const search = useCallback(
    (address: string) => {
      let coin;
      if (getChecksumByTicker('eth')(address)) coin = 'eth';
      if (getChecksumByTicker('xch')(address)) coin = 'xch';

      if (!coin) {
        alert('Please enter a valid Ethereum or Chia wallet address.');
        return false;
      }

      // Add to search history
      dispatch(
        addressSearchSet({
          coin,
          address: address,
        })
      );

      router.push(`/miner/${coin}/${address}`, undefined, {
        // shallow routing is true if not on miner dashboard
        shallow: !router.query.address,
      });

      return true;
    },
    [dispatch, router]
  );

  return search;
};

export default useSearchAddress;
