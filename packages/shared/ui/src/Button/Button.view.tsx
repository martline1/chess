import type { FC, HTMLProps, ReactNode } from 'react';
import classNames                        from 'classnames';

import styles from './Button.module.scss';

type OverwritingFields = 'size' | 'type' | 'onClick';

type NativeButtonPropsRaw = HTMLProps<HTMLButtonElement>;

type NativeButtonPropsFiltered = Omit<NativeButtonPropsRaw, OverwritingFields>;

export type ButtonProps = {
  /** Different variations of the button */
  type?: 'primary' | 'white';

  /** Contents of the button */
  label?: string;

  /** How big will the button be */
  size?: 'small' | 'medium' | 'big';

  /** Action handler */
  onClick: Required<NativeButtonPropsRaw>['onClick'];

  /** Contents of the button, this replaces label */
  children?: ReactNode;
};

export const ButtonView: FC<NativeButtonPropsFiltered & ButtonProps> = ({
  type = 'primary',
  size = 'medium',
  onClick,
  children,
  label,
  ...props
}) => {
  return (
    <button
      type="button"
      className={classNames(
        styles.customButton,
        styles[`button-type-${type}`],
        styles[`button-size-${size}`]
      )}
      onClick={onClick}
      {...props}
    >
      {children ?? null}

      {label ? <span>{label}</span> : null}
    </button>
  );
};
