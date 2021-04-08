import styled, { UIVariant } from 'styled-components/macro';

const btnHeights = {
  xs: 32,
  sm: 42,
  default: 50,
  lg: 60,
};

export const getBtnPxHeight = (height: keyof typeof btnHeights = 'default') => {
  return btnHeights[height];
};

export type ButtonProps = {
  size?: keyof typeof btnHeights | undefined;
  variant?: UIVariant;
  shape?: 'square' | 'circle' | 'block';
};

export const Button = styled.button<ButtonProps>`
  transition: 0.1s all;
  display: flex;
  padding-left: 1rem;
  padding-right: 1rem;
  border-radius: 5px;
  align-items: center;
  border: 1px solid var(--border-color);
  outline: none;
  font-size: 1rem;
  background-color: var(--bg-primary);
  cursor: pointer;
  &:hover,
  &:active,
  &:focus {
    background: var(--bg-secondary);
    text-decoration: none;
  }
  color: var(--text-primary);
  font-weight: 400;

  &:disabled {
    pointer-events: none;
    opacity: 0.3;
  }
  & > * {
    pointer-events: none;
  }

  ${(p) => `
    height: ${getBtnPxHeight(p.size)}px;
  `};

  ${(p) =>
    p.shape === 'square' &&
    `
      padding: 0;
  justify-content: center;
      width: ${getBtnPxHeight(p.size)}px;
  `};
  ${(p) =>
    p.shape === 'circle' &&
    `
      padding: 0;
  justify-content: center;
      border-radius: 50%;
      width: ${getBtnPxHeight(p.size)}px;
  `};

  font-weight: 700;
  border-color: var(--bg-secondary);
  display: inline-flex;

  /** variant */
  ${(p) => {
    if (p.variant) {
      return `
      background-color: var(--${p.variant});
      color: ${p.theme.color.onBg};
      border-color: rgba(0,0,0,0.05);
        box-shadow: 0 2px 10px 0 var(--${p.variant}-shadow);
      &:hover, &:active, &:focus {
        border-color: rgba(0,0,0,0.05);
      background-color: var(--${p.variant});
        box-shadow: 0 5px 15px 0 var(--${p.variant}-shadow);
      }
      `;
    }
  }}

  &:active {
    box-shadow: inset 0 0 40px 0 rgba(0, 0, 0, 0.1);
  }

  ${(p) =>
    p.shape === 'block' &&
    `
    width: 100%;
    justify-content: center;
  `}
`;

Button.defaultProps = {
  size: 'default',
};
