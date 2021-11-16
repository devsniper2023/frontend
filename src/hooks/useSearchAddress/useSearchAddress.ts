import { useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { useRouter } from 'next/router';
import { addressSearchSet } from 'src/rdx/addressSearch/addressSearch.actions';
import { getChecksumByTicker } from '@/utils/validators/checksum';

const useSearchAddress = () => {
  const dispatch = useDispatch();
  const router = useRouter();

  const search = useCallback(
    (address: string, coin?: string, callback?: () => void) => {
      let coinType = coin;

      if (!coin) {
        if (getChecksumByTicker('eth')(address)) coinType = 'eth';
        if (getChecksumByTicker('xch')(address)) coinType = 'xch';
      }

      if (!coinType) {
        alert('Please enter a valid Ethereum or Chia wallet address.');
        return false;
      }

      router.push(`/miner/${coinType}/${address}`, undefined).then(async () => {
        callback?.();

        // delay for smoother UI
        await new Promise((resolve) => setTimeout(resolve, 100));

        // Add to search history
        dispatch(
          addressSearchSet({
            coin: coinType as string,
            address: address,
          })
        );
      });

      return true;
    },
    [dispatch, router]
  );

  return search;
};

export default useSearchAddress;
