import React from 'react';
import { useLocation } from 'react-router-dom';
import { Content } from 'src/components/layout/Content';
import styled from 'styled-components/macro';
import FAQIndex from '../../docs/faq/index.json';
import { Page } from 'src/components/layout/Page';
import { useOpenState } from 'src/hooks/useOpenState';
import { Helmet } from 'react-helmet-async';
import { CopyButton } from 'src/components/CopyButton';
import { FaLink } from 'react-icons/fa';

type FaqDataSection = {
  name: string;
  contents: {
    name: string;
    key: string;
    md: {
      attributes: {
        title: string;
      };
      react: React.FC;
    };
  }[];
};

/**
 *
 *
 *  Content
 *
 *
 */

const SectionItem = styled.div`
  margin-top: -1px;
  border: 1px solid var(--border-color);
`;
const SectionItemHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;
const SectionTitle = styled.h3`
  font-size: 1.125rem;
  cursor: pointer;
  padding: 1rem 1.25rem;
  flex-grow: 1;
  &:hover {
    color: var(--primary);
  }
`;
const CopyWrapper = styled.div`
  padding-right: 0.75rem;
  padding-left: 1rem;
  margin-top: 0;
`;
const SectionContent = styled.div`
  padding: 1.25rem;
  padding-top: 0;
`;

const FSection = styled.div`
  margin-bottom: 5rem;
  margin-top: 1rem;
`;

const FaqQuestion: React.FC<{ data: FaqDataSection['contents'][0] }> = ({
  data: {
    key,
    md: {
      react: Comp,
      attributes: { title },
    },
  },
}) => {
  const location = useLocation();

  const openState = useOpenState(location.hash.replace('#', '') === key);

  return (
    <SectionItem>
      <SectionItemHeader>
        <SectionTitle id={key} onClick={openState.handleToggle}>
          <span>{title}</span>
        </SectionTitle>
        <CopyWrapper>
          <CopyButton
            icon={<FaLink />}
            description="Copy link"
            text={`${window.location.href.split('#')[0]}#${key}`}
          />
        </CopyWrapper>
      </SectionItemHeader>
      {openState.isOpen && (
        <SectionContent>
          <Comp />
        </SectionContent>
      )}
    </SectionItem>
  );
};

const FaqSection: React.FC<FaqDataSection> = ({ name, contents }) => {
  return (
    <>
      <FSection>
        <h2>{name}</h2>
        {contents.map((item) => (
          <FaqQuestion key={item.key} data={item} />
        ))}
      </FSection>
    </>
  );
};

const FaqContent = styled.div`
  p + table {
    margin-top: 1rem;
  }

  table + p {
    margin-top: 1rem;
  }

  table td {
    line-height: 1.4;
    font-weight: 400;
  }

  p {
    max-width: 100%;
  }

  h2 {
    margin-bottom: 1rem;
  }
  h3 {
    font-size: 1.125rem;
  }
  h4 {
    font-size: 1.25rem;
  }
`;

export const FaqPage = () => {
  const faqSections = FAQIndex.map((section) => ({
    name: section.sectionName,
    contents: section.contents.map((item) => ({
      name: item,
      /**
       * "questions-about-flexpool/how-to-join.md"
       * => "how-to-join"
       */
      key: item.split('/')[1].replace('.md', ''),
      md: require(`src/docs/faq/${item}`) as {
        attributes: { title: string };
        react: React.FC;
      },
    })),
  }));
  return (
    <Page>
      <Helmet>
        <title>FAQ</title>
      </Helmet>
      <Content paddingLg>
        <FaqContent>
          {faqSections.map((item) => (
            <FaqSection key={item.name} {...item} />
          ))}
        </FaqContent>
      </Content>
    </Page>
  );
};
