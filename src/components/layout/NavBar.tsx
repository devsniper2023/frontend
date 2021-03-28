import { Link, NavLink, useLocation } from 'react-router-dom';
import Logo from 'src/assets/logo.svg';
import { Content } from 'src/components/layout/Content';
import { Button } from 'src/components/Button';
import { ScrollArea } from 'src/components/layout/ScrollArea';
import styled from 'styled-components/macro';

import { FaChartArea, FaCubes, FaSearch } from 'react-icons/fa';
import { useBoolState } from 'src/hooks/useBoolState';
import React from 'react';
import { useOpenState } from 'src/hooks/useOpenState';
import Modal from '../Modal/Modal';
import { SearchAddressCachedResult } from '../SearchAddressBar/SearchAddressCachedResult';
import { SearchAddressBar } from '../SearchAddressBar/SearchAddressBar';
import { Ws } from '../Typo/Typo';
import { OuterEvent } from '../DivOuterEvents';
import { Burger } from '../Burger/Burger';
import { clx } from 'src/utils/clx';

const NLink = styled(NavLink)`
  height: 100%;
  display: flex;
  align-items: center;
  color: var(--text-primary);
  text-decoration: none;
  padding: 0.75rem;
  font-weight: 600;
  border: none;
  outline: none;
  background: transparent;
  min-width: 70px;
  justify-content: center;
  svg {
    height: 50%;
    width: 50%;
  }
  &.active {
    color: var(--primary);
  }
`;

const NavSection = styled.div`
  display: flex;
  height: 100%;
  align-items: center;
  &:not(:first-child) {
    margin-left: 2rem;
  }
  &:not(:last-child) {
    margin-right: 2rem;
  }
`;

const MobileSlide = styled(OuterEvent)<{ isOpen?: boolean }>`
  overflow-y: auto; /* has to be scroll, not auto */
  -webkit-overflow-scrolling: touch;
  width: 100%;
  max-width: 400px;
  position: fixed;
  top: 70px;
  left: 100%;
  bottom: 0;
  background: var(--bg-primary);
  z-index: 800;
  padding: 1rem;

  display: flex;
  flex-direction: column;

  a {
    height: 50px;
    padding: 0 1rem;
  }

  transition: 0.2s all;

  ${(p) =>
    p.isOpen &&
    `
    transform: translateX(-100%);
  `}
  box-shadow: 0 0 30px 0 rgba(0,0,0,0.1);
  ${NLink} {
    justify-content: flex-start;
  }
`;

const NavContainerOuter = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 70px;
  z-index: 1000;
  background: var(--bg-primary);
  display: flex;
  @media screen and (max-width: 1100px) {
    display: none;
  }
  img {
    height: 30px;
  }
  border-bottom: 1px solid var(--border-color);
`;

const BurgerWrap = styled(Button)`
  border: none;
  margin-left: 1rem;
  &:active,
  &.active {
    background: transparent;
  }
`;

export type NavBarType = {};

const NavContainer = styled(Content)`
  display: flex;
  justify-content: space-between;
  width: 100%;
  height: 70px;
  align-items: center;
`;

const ContainerMobile = styled(NavContainerOuter)`
  display: none;
  @media screen and (max-width: 1100px) {
    display: flex;
  }

  img {
    height: 20px;
  }
`;

const FixedMargin = styled.div`
  height: 70px;
`;

const SearchContainer = styled.div`
  & > * {
    height: 46px;
  }
`;

export const NavBar: React.FC<NavBarType> = (props) => {
  const openState = useBoolState();
  const modalSearchOpenState = useOpenState();

  const location = useLocation();

  React.useEffect(() => {
    openState.handleFalse();
    modalSearchOpenState.handleClose();
  }, [location]);

  return (
    <>
      <Modal
        size="sm"
        mobileFull
        closeOnOuterClick
        {...modalSearchOpenState.modalProps}
      >
        <Modal.Header>
          <h2>Search miner</h2>
        </Modal.Header>
        <Modal.Body>
          <SearchAddressBar showResult={false} />
        </Modal.Body>
        <ScrollArea>
          <SearchAddressCachedResult isOpen={modalSearchOpenState.isOpen} />
        </ScrollArea>
      </Modal>
      <FixedMargin />
      <NavContainerOuter>
        <NavContainer>
          <NavLink to="/">
            <img src={Logo} alt="Flexpool Logo" />
          </NavLink>
          <NavSection>
            <NLink to="/statistics">Statistics</NLink>
            <NLink to="/blocks">Blocks</NLink>
            <NLink to="/miners">Miners</NLink>
          </NavSection>
          <NavSection>
            <SearchContainer>
              <SearchAddressBar />
            </SearchContainer>
          </NavSection>
          <NavSection>
            <NLink to="/faq">FAQ</NLink>
            <NLink to="/support">Support</NLink>
            <Button
              style={{ marginLeft: 10 }}
              variant="primary"
              as={Link}
              to="/get-started"
            >
              <Ws>Get Started</Ws>
            </Button>
          </NavSection>
        </NavContainer>
      </NavContainerOuter>

      <ContainerMobile>
        <NavContainer>
          <NavLink to="/">
            <img src={Logo} alt="Flexpool Logo" />
          </NavLink>
          <NavSection>
            <NLink to="/statistics">
              <FaChartArea />
            </NLink>
            <NLink to="/blocks">
              <FaCubes />
            </NLink>
            <NLink as="button" onClick={modalSearchOpenState.handleOpen}>
              <FaSearch />
            </NLink>
            <BurgerWrap
              className={clx({ active: openState.value })}
              onClick={openState.handleToggle}
            >
              <Burger isOpen={openState.value} />
            </BurgerWrap>
          </NavSection>
        </NavContainer>
        <MobileSlide isOpen={openState.value}>
          <Button variant="primary">
            <Ws>Get Started</Ws>
          </Button>
          <NLink to="/statistics">Statistics</NLink>
          <NLink to="/blocks">Blocks</NLink>
          <NLink to="/miners">Miners</NLink>
          <NLink to="/faq">FAQ</NLink>
          <NLink to="/support">Support</NLink>
        </MobileSlide>
      </ContainerMobile>
    </>
  );
};
