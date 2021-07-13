import React from 'react';
import { Button } from 'src/components/Button';
import styled from 'styled-components';

const ButtonGroupWrapper = styled.div`
  display: flex;

  button {
    padding: 15px;
    color: var(--text-primary);
    font-weight: 600;
    position: relative;

    transition: background-color 0.1s;

    &.selected {
      background: var(--primary);
    }

    :first-child {
      border: 2px solid var(--border-color);
      border-radius: 5px 0px 0px 5px;
    }

    :last-child {
      border-radius: 0px 5px 5px 0px;
    }

    border: 2px solid var(--border-color);
    border-left: 0px;
    background: var(--bg-primary);
  }
`;

type ButtonGroupProps = {
  options: { [key: string]: string };
  selectedOption: string;
  setSelectedOption: (s: string) => void;
};

export const ButtonGroup = (props: ButtonGroupProps) => {
  var buttons = [];

  for (const key in props.options) {
    buttons.push(
      <Button
        onClick={() => props.setSelectedOption(key)}
        className={`${props.selectedOption === key ? 'selected' : ''}`}
      >
        {props.options[key] as string}
      </Button>
    );
  }

  return <ButtonGroupWrapper>{buttons}</ButtonGroupWrapper>;
};
