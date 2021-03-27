import React from 'react';
import { useDispatch } from 'react-redux';
import {
  Route,
  RouteComponentProps,
  Switch,
  useRouteMatch,
  Redirect,
} from 'react-router';
import { Content } from 'src/components/layout/Content';
import { Page } from 'src/components/layout/Page';
import {
  useActiveCoin,
  useCounterTicker,
} from 'src/rdx/localSettings/localSettings.hooks';
import { minerDetailsGet } from 'src/rdx/minerDetails/minerDetails.actions';
import { minerHeaderStatsGet } from 'src/rdx/minerHeaderStats/minerHeaderStats.actions';
import { minerStatsGet } from 'src/rdx/minerStats/minerStats.actions';
import { useReduxState } from 'src/rdx/useReduxState';
import { AccountHeader } from './Header/AccountHeader';
import { HeaderGreetings } from './Header/Greetings';
import { HeaderStats } from './Header/Stats';
import { MinerDetails } from './Header/MinerDetails';
import { MinerStatsPage } from './Stats/MinerStats.page';
import styled from 'styled-components';
import { NavLink } from 'react-router-dom';
import { FaChartBar, FaWallet } from 'react-icons/fa';
import { Spacer } from 'src/components/layout/Spacer';
import { MinerPaymentsPage } from './Payments/MinerPayments.page';
import { Helmet } from 'react-helmet-async';
import { MinerBlocksPage } from './Blocks/MinerBlocks.page';
import { MinerRewardsPage } from './Rewards/MinerRewards.page';
import { localSettingsSet } from 'src/rdx/localSettings/localSettings.actions';

const TabContent = styled.div`
  box-shadow: inset -1px 18px 19px -13px var(--bg-secondary);
  border-top: 2px solid var(--border-color);
  padding-top: 2rem;
`;

const TabLinkContainer = styled(Content)`
  margin-top: 3rem;
  display: flex;
  overflow-x: auto;
  overflow-y: hidden;
`;

const TabLink = styled(NavLink)`
  font-weight: 600;
  font-size: 1.125rem;
  height: 3rem;
  display: flex;
  align-items: center;
  color: var(--text-primary);
  padding: 0 1.5rem;
  border-bottom: 2px solid transparent;
  margin-bottom: -2px;
  svg {
    margin-right: 0.5rem;
  }
  &.active {
    color: var(--primary);
    border-color: var(--primary);
  }
`;

export const MinerDashboardPage: React.FC<
  RouteComponentProps<{
    coin: string;
    address: string;
  }>
> = (props) => {
  const { coin: coinTicker, address } = props.match.params;
  const activeCoin = useActiveCoin(coinTicker);
  const match = useRouteMatch();
  const counterTicker = useCounterTicker();

  const d = useDispatch();

  // globaly set active coin ticker
  React.useEffect(() => {
    d(localSettingsSet({ coin: coinTicker }));
  }, [coinTicker, d]);

  React.useEffect(() => {
    d(minerHeaderStatsGet(coinTicker, address, counterTicker));
    d(minerDetailsGet(coinTicker, address));
    d(minerStatsGet(coinTicker, address));
  }, [coinTicker, address, d, counterTicker]);

  return (
    <Page>
      <Helmet>
        <title>Miner Dashboard</title>
      </Helmet>
      <Content>
        <HeaderGreetings coin={activeCoin} />
        <AccountHeader coin={activeCoin} address={address} />
        <MinerDetails coin={activeCoin} />
        <HeaderStats coin={activeCoin} />
      </Content>
      <TabLinkContainer>
        <TabLink to={`${match.url}/stats`}>
          <FaChartBar /> Stats
        </TabLink>
        <TabLink to={`${match.url}/payments`}>
          <FaWallet /> Payments
        </TabLink>
        <TabLink to={`${match.url}/rewards`}>
          <FaChartBar /> Rewards
        </TabLink>
        <TabLink to={`${match.url}/blocks`}>
          <FaWallet /> Blocks
        </TabLink>
      </TabLinkContainer>
      <TabContent>
        <Content>
          <Switch>
            <Route path={`${match.path}/stats`} component={MinerStatsPage} />
            <Route path={`${match.path}/blocks`} component={MinerBlocksPage} />
            <Route
              path={`${match.path}/rewards`}
              component={MinerRewardsPage}
            />
            <Route
              path={`${match.path}/payments`}
              component={MinerPaymentsPage}
            />
            <Redirect to={`${match.path}/stats`} />
          </Switch>
        </Content>
      </TabContent>
      <Spacer size="xl" />
    </Page>
  );
};
