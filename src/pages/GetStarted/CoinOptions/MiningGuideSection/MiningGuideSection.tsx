import React, { useState } from 'react';
import styled from 'styled-components';
import Image from 'next/image';
import { getCoinIconUrl } from 'src/utils/staticImage.utils';
import { useTranslation } from 'next-i18next';
import { Spacer } from '@/components/layout/Spacer';
import { RadioGroup, GuideTypeRadio } from '../GuideTypeRadio';
import { ViewGuideButton } from '../ViewGuideButton';
import { PoolDetails } from '../PoolDetails';
import { MineableCoinHardware } from '@/pages/GetStarted/mineableCoinList';
import { BiSupport } from 'react-icons/bi';
import { RiTeamLine } from 'react-icons/ri';
import { GiReceiveMoney, GiSparkles } from 'react-icons/gi';
import { MineableCoin } from '@/pages/GetStarted/mineableCoinList';

const SectionWrapper = styled.div`
  padding: 20px 0px 68px;
`;

const MainCol = styled.div`
  flex-basis: 69%;
  border-right: 1px solid var(--border-color);
  flex-grow: 1;
`;

const SubCol = styled.div`
  flex-basis: 30%;
  min-width: 280px;
  padding: 34px 32px;
  flex-grow: 1;
  display: flex;
  flex-direction: column;

  border-top: 1px solid var(--border-color);
  background-color: var(--bg-secondary);

  @media (max-width: 768px) {
    padding: 26px 24px;
  }
`;

const Heading = styled.h2`
  margin: 0;
  display: inline-block;
  margin: 10px;
  font-size: 24px;
  letter-spacing: -0.015em;
  color: var(--text-primary);
`;

const FlexEnd = styled.div`
  margin-top: auto;
`;

const SmallSprint = styled.p`
  font-size: 12px;
  font-weight: 500;
  color: var(--text-secondary);
  opacity: 0.5;
`;

type HardwareOption = {
  key: string;
  title: string;
  tag?: string;
};

const Tag = styled.div`
  display: inline-flex;
  justify-content: center;
  align-items: center;
  border: 1px solid var(--success);
  background-color: #15cd7221;
  border-radius: 50px;
  padding: 5px 10px;
  font-size: 12px;
  margin: 0 6px;
  color: var(--success);
`;

const PoolGuideOptions = ({
  options,
  coin,
}: {
  coin: string;
  options: HardwareOption[];
}) => {
  const [selected, setSelected] = useState(0);
  const { t } = useTranslation('get-started');

  let guideLink = `/get-started/${coin}/${options[selected].key}`;

  if (options[selected].key === 'flexfarmer') {
    guideLink = 'https://farmer.flexpool.io';
  }

  return (
    <>
      <h2>{t('list.start_today')}</h2>
      <SmallSprint>{t('list.begin_experience')}</SmallSprint>
      <Spacer size="md" />
      <RadioGroup value={String(selected)}>
        {options.map((option, index) => {
          return (
            <GuideTypeRadio
              key={option.key}
              value={String(index)}
              selected={String(selected) === String(index)}
              onClick={() => {
                setSelected(index);
              }}
            >
              {option.title}
              {option.tag && <Tag>{option.tag}</Tag>}
            </GuideTypeRadio>
          );
        })}
      </RadioGroup>
      <Spacer size="lg" />
      <FlexEnd>
        <ViewGuideButton href={guideLink}>
          {t('list.view_button', {
            name: options[selected].title,
          })}
        </ViewGuideButton>
      </FlexEnd>
      <SmallSprint>{t('list.zil_boost')}</SmallSprint>
    </>
  );
};

const Layout = styled.div`
  border: 1px solid var(--border-color);
  border-radius: 10px;
  overflow: hidden;
`;

const LayoutHeader = styled.div`
  padding: 18px 40px;
  display: flex;
  align-items: center;

  @media (max-width: 768px) {
    padding: 15px 26px;
  }
`;

const LayoutBody = styled.div`
  display: flex;
  flex-wrap: wrap;
`;

type Props = {
  ticker: string;
  name: string;
  coin: MineableCoin;
};

const PerksWrapper = styled.div`
  padding: 26px 48px;
  border-top: 1px solid var(--border-color);
  display: flex;
  flex-wrap: wrap;

  @media (max-width: 768px) {
    padding: 24px 26px 30px;
  }
`;

const PerkContainer = styled.div`
  flex-basis: 50%;
  display: flex;
  align-items: flex-start;
  font-size: 15px;
  font-weight: 500;
  padding: 16px 12px 16px 0; ;
`;

const Perk = ({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) => {
  return (
    <PerkContainer>
      <div
        style={{
          color: 'var(--success)',
          margin: '0 8px 0 0',
        }}
      >
        {icon}
      </div>
      <div>
        {title}
        <SmallSprint>{description}</SmallSprint>
      </div>
    </PerkContainer>
  );
};

const PoolPerks = () => {
  const { t } = useTranslation('get-started');

  return (
    <PerksWrapper>
      <Perk
        icon={<RiTeamLine size={20} />}
        title={t('list.perks.0.title')}
        description={t('list.perks.0.description')}
      />
      <Perk
        icon={<BiSupport size={20} />}
        title={t('list.perks.1.title')}
        description={t('list.perks.1.description')}
      />
      <Perk
        icon={<GiReceiveMoney size={20} />}
        title={t('list.perks.2.title')}
        description={t('list.perks.2.description')}
      />
      <Perk
        icon={<GiSparkles size={20} />}
        title={t('list.perks.3.title')}
        description={t('list.perks.3.description')}
      />
    </PerksWrapper>
  );
};

export const MiningGuideSection = ({ ticker, name, coin }: Props) => {
  const { t } = useTranslation('get-started');

  const poolDetails = t(`detail_${ticker.toLowerCase()}.pool_details`, {
    returnObjects: true,
  }) as { key: string; value: string }[];

  const poolHw = t(`detail_${ticker.toLowerCase()}.hardware`, {
    returnObjects: true,
  }) as MineableCoinHardware[];

  if (typeof poolHw === 'string') {
    return <></>;
  }

  const hardwareOptions = poolHw.map((hw) => {
    let tag;
    if (hw.key === 'flexfarmer') tag = 'New';

    return {
      ...hw,
      tag,
    };
  });

  if (coin.nicehashAvailable) {
    hardwareOptions.push({
      key: 'nicehash',
      title: 'NiceHash Rental',
      miners: [],
      tag: null,
    });
  }

  return (
    <SectionWrapper>
      <Layout>
        <LayoutHeader>
          <Image
            src={getCoinIconUrl(ticker)}
            width={30}
            height={30}
            alt={'image'}
          />
          <Heading>{name}</Heading>
        </LayoutHeader>

        <LayoutBody>
          <MainCol>
            <PoolDetails items={poolDetails} />
            <PoolPerks />
          </MainCol>
          <SubCol>
            <PoolGuideOptions coin={ticker} options={hardwareOptions} />
          </SubCol>
        </LayoutBody>
      </Layout>
    </SectionWrapper>
  );
};

export default MiningGuideSection;
