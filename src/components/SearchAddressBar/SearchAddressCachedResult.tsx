import { FaTimesCircle } from 'react-icons/fa';
import { useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import {
  addressSearchRemove,
  addressSearchSet,
} from 'src/rdx/addressSearch/addressSearch.actions';
import { useReduxState } from 'src/rdx/useReduxState';
import styled from 'styled-components';

const ItemWrap = styled.div`
  border-top: 1px solid var(--border-color);
  display: flex;
  align-items: center;
  height: 55px;
`;
const HistoryItem = styled(Link)`
  color: var(--text-primary);
  height: 100%;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding: 0 0 0 1rem;
  overflow: hidden;
  cursor: pointer;
  user-select: none;
  -webkit-user-select: none;
  font-family: 'Roboto Mono', monospace;
  font-weight: 500;
  flex-grow: 1;
  &:hover {
    color: var(--primary);
    text-decoration: none;
  }
`;

const CoinLabel = styled.span`
  background: var(--primary);
  color: var(--text-on-bg);
  padding: 0.2rem 0.3rem;
  text-transform: uppercase;
  border-radius: 5px;
  font-size: 0.875rem;
  margin-left: 1rem;
`;

const Address = styled.span`
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const ItemRight = styled.div`
  display: flex;
  align-items: center;
`;
const RemoveWrap = styled.button`
  padding: 0 0.75rem;
  height: 30px;
  display: flex;
  align-items: center;
  cursor: pointer;
  opacity: 0.3;
  height: 100%;
  background: transparent;
  outline: none !important;
  border: none !important;
  color: var(--text-primary);
  &:hover {
    opacity: 1;
  }
`;

export const SearchAddressCachedResult: React.FC<{ isOpen?: boolean }> = ({
  isOpen = true,
}) => {
  const data = useReduxState('addressSearch');
  const d = useDispatch();

  if (!isOpen) {
    return null;
  }
  return (
    <>
      {data.slice(0, 6).map((item) => (
        <ItemWrap key={item.address}>
          <HistoryItem
            type="button"
            onClick={() => {
              d(addressSearchSet(item));
              if (document.activeElement instanceof HTMLElement) {
                document.activeElement?.blur();
              }
            }}
            to={`/miner/${item.coin}/${item.address}`}
          >
            <Address>{item.address}</Address>
            <ItemRight>
              <CoinLabel>{item.coin}</CoinLabel>
            </ItemRight>
          </HistoryItem>
          <RemoveWrap
            type="button"
            onClick={(e) => {
              d(addressSearchRemove(item.address));
            }}
          >
            <FaTimesCircle />
          </RemoveWrap>
        </ItemWrap>
      ))}
    </>
  );
};
