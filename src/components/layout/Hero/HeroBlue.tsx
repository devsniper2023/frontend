import React from 'react';
import styled from 'styled-components/macro';
import MapSvg from './bg.svg';

const Hero = styled.div`
  padding-top: 3rem;
  padding-bottom: 3rem;
  background: var(--primary);
  display: flex;
  flex-direction: column;
  justify-content: center;

  --text-primary: white;

  h1 {
    font-size: 3rem;
  }

  position: relative;
`;

const WorldMap = styled.img`
  object-fit: cover;
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
  width: 100%;
  z-index: 1;
  opacity: 1;
`;

export const HeroBlue: React.FC<{
  children: React.ReactNode;
  className?: string;
}> = ({ children, className }) => {
  return (
    <Hero className={className}>
      <WorldMap src={MapSvg} alt="map" />
      {children}
    </Hero>
  );
};
