import { Formik } from 'formik';
import React, { useRef, useMemo } from 'react';
import { useTranslation } from 'next-i18next';
import { FaSearch } from 'react-icons/fa';
import { useOpenState } from 'src/hooks/useOpenState';
import useSearchAddress from '@/hooks/useSearchAddress';
import { useReduxState } from 'src/rdx/useReduxState';
import {
  SearchButton,
  Container,
  Wrapper,
  ResultWrapper,
  FieldWrapper,
  Input,
  F,
} from './components';
import { SearchAddressCachedResult } from './SearchAddressCachedResult';

export const SearchAddressBar: React.FC<{
  showResult?: boolean;
  callback?: () => void;
}> = ({ showResult = true, callback }) => {
  const inputRef = useRef<HTMLInputElement>(null);

  const searchData = useReduxState('addressSearch');
  const { t } = useTranslation(['common']);
  const openState = useOpenState();
  const search = useSearchAddress();

  const handleSearch = React.useCallback(
    (address: string, callback?: () => void) => {
      let searchAddress: string = address.replaceAll(' ', '');
      if (/^[a-fA-F0-9]{40}$/.test(address)) {
        searchAddress = '0x' + searchAddress;
      }

      if (!searchAddress && searchData.length > 0) {
        searchAddress = searchData[0].address; // Fetch latest address from cache.
      }

      inputRef.current?.blur();
      return search(searchAddress, undefined, callback);
    },
    [search, searchData]
  );

  const shouldShowSearchHistory = useMemo(
    () => openState.isOpen && showResult && searchData && searchData.length > 0,
    [openState.isOpen, showResult, searchData]
  );

  return (
    <Container
      onOuterEvent={(openState.isOpen && openState.handleClose) || undefined}
    >
      <Formik
        onSubmit={(data, form) => {
          handleSearch(data.addrsearch, () => {
            callback?.(); // handle component callback, such as closing modal
            form.setSubmitting(false);
            form.resetForm();
          });
        }}
        initialValues={{ addrsearch: '' }}
      >
        <F autoComplete="off">
          <Wrapper>
            <FieldWrapper isOpen={openState.isOpen}>
              <Input
                innerRef={inputRef}
                name="addrsearch"
                spellCheck="false"
                autoComplete="off"
                placeholder={t('searchbar.placeholder')}
                onFocus={openState.handleOpen}
                onBlur={openState.handleClose}
              />
              {shouldShowSearchHistory && (
                <ResultWrapper>
                  <SearchAddressCachedResult
                    callback={() => inputRef.current?.blur()}
                  />
                </ResultWrapper>
              )}
            </FieldWrapper>
            <SearchButton aria-label="Search address" type="submit">
              <FaSearch />
            </SearchButton>
          </Wrapper>
        </F>
      </Formik>
    </Container>
  );
};
