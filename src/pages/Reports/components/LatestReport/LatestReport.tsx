import React from 'react';
import { useTranslation } from 'next-i18next';
import { Page } from 'react-pdf/dist/esm/entry.webpack';
import 'react-pdf/dist/esm/Page/AnnotationLayer.css';
import { ListPagination } from 'src/components/layout/List/ListPagination';
import { LoaderOverlayWithin } from 'src/components/Loader/LoaderOverlayWithin';
import { useRefBound } from 'src/hooks/useRefWidth';
import { useLocalizedDateFormatter } from 'src/utils/date.utils';
import {
  StyledDocument,
  LoadingContainer,
  PageContainer,
  PageContainerInner,
  Container,
} from './componnents';

export const LatestReport: React.FC<{ src: string; date: Date }> = ({
  src,
  date,
}) => {
  const [wrapperRef, bound] = useRefBound<HTMLDivElement>();
  const [totalPages, setTotalPages] = React.useState<number>(0);
  const [activePage, setActivePage] = React.useState<number>(0);
  const [isLoading, setIsLoading] = React.useState(true);
  const { t } = useTranslation('reports');
  const dateFormatter = useLocalizedDateFormatter();

  const onDocumentLoad = (pdf: any) => {
    setTotalPages(pdf.numPages);
    setIsLoading(false);
  };

  return (
    <>
      <h2>
        {t('latest')} ({dateFormatter.format(date, 'LLLL y')})
      </h2>
      <Container ref={wrapperRef}>
        {isLoading && <LoaderOverlayWithin />}
        <PageContainer>
          <PageContainerInner
            style={{
              transform: `translateX(${
                activePage * (bound?.width || 0) * -1
              }px)`,
            }}
          >
            <StyledDocument
              file={src}
              onLoadSuccess={onDocumentLoad}
              externalLinkTarget="_blank"
              loading={
                <LoadingContainer>
                  <br />
                </LoadingContainer>
              }
            >
              {Array.apply(null, Array(totalPages)).map((item, index) => (
                <Page
                  loading=""
                  key={index}
                  width={bound?.width}
                  pageIndex={index}
                />
              ))}
            </StyledDocument>
          </PageContainerInner>
        </PageContainer>
        <ListPagination
          totalPages={totalPages}
          currentPage={activePage}
          setCurrentPage={setActivePage}
        />
      </Container>
    </>
  );
};
