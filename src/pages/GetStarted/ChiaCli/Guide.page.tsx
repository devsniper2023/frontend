import React from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { Page } from 'src/components/layout/Page';
import { Spacer } from 'src/components/layout/Spacer';
import { LinkOut } from 'src/components/LinkOut';
import { Highlight } from 'src/components/Typo/Typo';
import styled from 'styled-components';
import { mineableCoins } from '../mineableCoinList';
import { Redirect, useLocation, useRouteMatch } from 'react-router';
import qs from 'query-string';
import { Mono } from 'src/components/Typo/Typo';
import { PingTestSection } from './PingTest.section';
import { CopyButton } from 'src/components/CopyButton';

const TerminalContainer = styled.code`
  display: flex;
  justify-content: space-between;
  padding: 1.25rem;
  background: var(--bg-secondary);
  white-space: pre-line;
`;

const Commands = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
`;

const Command = styled.code`
  ::before {
    content: '$ ';
    color: var(--text-tertiary);
  }
`;

const CommandSecondary = styled.code`
  color: var(--text-tertiary);
`;

const CommandResultContainer = styled(TerminalContainer)`
  display: block;
  color: var(--text-secondary);
  background: var(--bg-primary);
  border: 5px solid var(--bg-secondary);
`;

type TerminalCommandProps = {
  cmd: React.ReactNode;
  desc?: React.ReactNode;
};

const TerminalCommand = (props: TerminalCommandProps) => {
  const { cmd, desc } = props;
  return (
    <>
      <TerminalContainer>
        <Commands>
          {(cmd as string).split('\n').map((item) => {
            var commandItems: Array<React.ReactNode> = [];
            item.split(' ').forEach((itemCommand) => {
              console.log(
                itemCommand,
                itemCommand.substr(0, 1),
                itemCommand.substr(itemCommand.length - 1, itemCommand.length)
              );
              if (
                itemCommand.length > 0 &&
                itemCommand.substr(0, 1) === '<' &&
                itemCommand.substr(
                  itemCommand.length - 1,
                  itemCommand.length
                ) === '>'
              ) {
                commandItems.push(
                  <CommandSecondary>{itemCommand} </CommandSecondary>
                );
              } else {
                commandItems.push(itemCommand + ' ');
              }
            });
            return <Command>{commandItems}</Command>;
          })}
        </Commands>
        <CopyButton text={cmd as string} />
      </TerminalContainer>
      {desc !== undefined ? (
        <CommandResultContainer>{desc}</CommandResultContainer>
      ) : null}
    </>
  );
};

export const ChiaCliGuidePage: React.FC = () => {
  const {
    params: { ticker },
  } = useRouteMatch<{
    ticker?: string;
  }>();

  const { t } = useTranslation('get-started');
  const { search } = useLocation();

  const mineableCoin = React.useMemo(() => {
    return mineableCoins.find((item) => item.ticker === ticker);
  }, [ticker]);

  if (!mineableCoin) {
    return <Redirect to="/get-started" />;
  }

  const { primaryServer = 'POOL_URL' } = qs.parse(search);

  return (
    <Page>
      <h1>{t('detail_xch.title_cli')}</h1>
      <PingTestSection data={mineableCoin.regions} />
      <Spacer size="xl" />
      <h2>
        <Highlight>#2</Highlight> {t('detail_xch.plotnft_create.title')}
      </h2>
      <p>{t('detail_xch.plotnft_create.desc_one')}</p>
      <Spacer />
      <p>{t('detail_xch.plotnft_create.desc_two')}</p>
      <Spacer />
      <p>{t('detail_xch.plotnft_create.create_command')}</p>
      <TerminalCommand
        cmd={`chia plotnft create -s pool https://${primaryServer}`}
        desc={
          <>
            {`Choose wallet key:
          1) 3118587270
          2) 2183884896
          3) 1324486352
          Enter a number to pick or q to quit: `}{' '}
            <b>1</b>
            {`
          
          Will create a plot NFT and join pool: https://${primaryServer}.
          Confirm [n]/y:`}{' '}
            <b>y</b>
          </>
        }
      />
      <Spacer />
      <p>
        <b>{t('detail.note') + ' '}</b>
        <Trans
          ns="get-started"
          i18nKey="detail_xch.plotnft_create.mojo_note"
          components={{
            chiafaucet: <LinkOut href="https://faucet.chia.net" />,
          }}
        />
      </p>
      <Spacer size="xl" />
      <h2>
        <Highlight>#3</Highlight> {t('detail_xch.plotnft_show.title')}
      </h2>
      <p>{t('detail_xch.plotnft_show.desc')}</p>
      <Spacer />
      <p>{t('detail_xch.plotnft_show.show_command')}</p>
      <TerminalCommand
        cmd={`chia plotnft show`}
        desc={
          <>
            {`Choose wallet key:
          1) 3118587270
          2) 2183884896
          3) 1324486352
          Enter a number to pick or q to quit: `}{' '}
            <b>1</b>
            {`
          
          Wallet height: ...
          Sync status: Synced

          Wallet id 2: 
          Current state: FARMING_TO_POOL
          Current state from block height: ...
          Launcher ID: 4973f2b459881b08295dff931c26dc0e511ce6fd46948e142ee151b1f97d7f23
          Target address (not for plotting): xch1d00purr0n5ae8hz706rcwge90m09w00wa4v78d9fpawgdhs6p0fsjt6rd8
          Owner public key: 1b434567c4a027e0e737245f3168e6fff86972a40803fd9243e912db192785d8f06f789f18c226c2e2f6331604c79967
          P2 singleton address (pool contract address for plotting): xch1f9el9dze3qdss22al7f3cfkupeg3eehag62gu9pwu9gmr7ta0u3s225yls
          Current pool URL: ${primaryServer}
          Current difficulty: 1
          Points balance: 9999
          Relative lock height: 100 blocks
          Payout instructions (pool will pay to this address): xch1egymuhquwg94e8wdkn2gzulghs7sngnmdr4k003j8xqu76dgwhjs9n84mu`}
          </>
        }
      />

      <h4>{t('detail_xch.plotnft_show.grab_addresses')}</h4>
      <Spacer />
      <p>
        <ul>
          <li>
            <Mono>P2 Singleton Address</Mono> -{' '}
            {t('detail_xch.plotnft_show.plotting_address')}
          </li>
          <li>
            <Mono>Payout instructions</Mono> -{' '}
            {t('detail_xch.plotnft_show.payout_address')}
          </li>
        </ul>
      </p>
      <Spacer size="xl" />
      <h2>
        <Highlight>#4</Highlight> {t('detail_xch.create_plots.title')}
      </h2>
      <p>
        <Trans
          ns="get-started"
          i18nKey="detail_xch.create_plots.desc_one"
          components={{
            plotter: (
              <LinkOut href="https://github.com/madMAx43v3r/chia-plotter" />
            ),
            madmax: <LinkOut href="https://github.com/madMAx43v3r" />,
          }}
        />
      </p>
      <Spacer />
      <p>{t('detail_xch.create_plots.install_dependencies_command')}</p>
      <TerminalCommand cmd={`sudo apt install libsodium-dev`} />
      <p>{t('detail_xch.create_plots.build_and_install_command')}</p>
      <TerminalCommand
        cmd={`git clone https://github.com/madMAx43v3r/chia-plotter\ncd chia-plotter\ngit submodule update --init\nbash make_release.sh\nsudo mv build/chia_plot /usr/bin`}
      />
      <Spacer />
      <p>
        <b>{t('detail.note') + ' '}</b>
        {t('detail_xch.create_plots.cmake_version_notice')}
      </p>
      <Spacer />
      <p>{t('detail_xch.create_plots.create_plots_command')}</p>
      <TerminalCommand
        cmd={`chia_plot -n <plot-count> -r <thread-count> -t <tmpdir-1> -r <tmpdir-2> -d <final-dir> -c <p2-singleton-address> -f <farmer-public-key>`}
      />
      <Spacer size="xl" />
      <h2>
        <Highlight>#5</Highlight> {t('detail_xch.monitor_farm.title')}
      </h2>
      <Spacer />
      <p>{t('detail_xch.monitor_farm.desc')}</p>
      <Spacer size="xl" />
    </Page>
  );
};
