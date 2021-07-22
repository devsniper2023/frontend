import React from 'react';
import { useRouter } from 'next/router';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import styled from 'styled-components';
import { Helmet } from 'react-helmet-async';
import { FaLink } from 'react-icons/fa';
import { useOpenState } from '../src/hooks/useOpenState';
import { useAsyncState } from '../src/hooks/useAsyncState';

// Components
import { Content } from '../src/components/layout/Content';
import { Page } from '../src/components/layout/Page';
import { CopyButton } from '../src/components/CopyButton';
import { FaqDocs } from '../src/docs/docs.utils';

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
  // const location = useLocation();
  const router = useRouter();
  console.log(window.location.hash);

  const openState = useOpenState(window.location.hash.replace('#', '') === key);

  return (
    <SectionItem>
      <SectionItemHeader>
        <SectionTitle id={key} onClick={openState.handleToggle}>
          <span>{title}</span>
        </SectionTitle>
        {/* <CopyWrapper>
          <CopyButton
            icon={<FaLink />}
            description="Copy link"
            text={`${window.location.href.split('#')[0]}#${key}`}
          />
        </CopyWrapper> */}
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
  const { t } = useTranslation('common');
  return (
    <>
      <FSection>
        <h2>{t(name)}</h2>
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

function FAQPage() {
  const asyncState = useAsyncState<FaqDocs>();
  const { i18n } = useTranslation();

  React.useEffect(() => {
    asyncState.start(
      import(`../src/docs/@faq/${i18n.language}`)
        .then((r) => {
          return r.default;
        })
        .catch(() => import(`../src/docs/@faq/en-US`).then((r) => r.default))
    );
    // eslint-disable-next-line
  }, [i18n.language]);

  return (
    <Page>
      {/* <Helmet>
        <title>FAQ</title>
      </Helmet> */}
      <Content paddingLg>
        <FaqContent>
          {(asyncState.data || []).map((item) => (
            <FaqSection key={item.name} {...item} />
          ))}
        </FaqContent>
      </Content>
    </Page>
  );
}

export default FAQPage;

export async function getStaticProps({ locale }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ['common'])),
      // Will be passed to the page component as props
    },
  };
}
