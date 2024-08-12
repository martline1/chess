'use client';

import {
  type Dispatch,
  type FC,
  type SetStateAction,
  useMemo,
  useState,
} from 'react';

import { RadioButtonView } from './RadioButton.view';

export type RadioButtonLogicProps = {
  isOn?: boolean;
  setIsOn?:  Dispatch<SetStateAction<boolean>>;
  size?: number;
  activeColor?: string;
  inactiveColor?: string;
};

export const RadioButtonLogic: FC<RadioButtonLogicProps> = ({
  isOn: isOnGiven,
  setIsOn: setIsOnGiven,
  size: requestedSize,
  activeColor = "var(--primary-color)",
  inactiveColor = "grey",
}) => {
  const [isOnNative, setIsOnNative] = useState(false);

  const isOn = useMemo(() => isOnGiven ?? isOnNative, [isOnGiven, isOnNative]);
  const setIsOn = useMemo(() => setIsOnGiven ?? setIsOnNative, [setIsOnGiven, setIsOnNative]);

  const size = useMemo(() => requestedSize ?? 16, [requestedSize]);

  const color = useMemo(() => isOn ? activeColor : inactiveColor, [isOn]);

  return (
    <RadioButtonView
      delegations={{
        isOn,
        setIsOn,
        size,
        color,
      }}
    />
  );
};
