import type {
  FC,
  Dispatch,
  SetStateAction,
} from "react";
import classNames from "classnames";

import type { WithDelegations } from "@common_types/react";
import styles                   from "./RadioButton.module.scss";

export type RadioButtonViewProps = WithDelegations<{
  isOn: boolean;
  setIsOn:  Dispatch<SetStateAction<boolean>>;
  size: number;
  color: string;
}>;

export const RadioButtonView: FC<RadioButtonViewProps> = ({
  delegations: {
    isOn,
    setIsOn,
    size,
    color,
  },
}) => (
  <div
    style={{
      fontSize: `${size}px`,
      borderColor: color,
    }}
    className={styles.container}
  >
    <button
      type="button"
      style={{
        fontSize: `${size}px`,
      }}
      className={styles.btn}
      onClick={() => setIsOn(prev => !prev)}
    >
      <div
        className={classNames(styles.circle, {
          [styles.isOn]: isOn,
        })}
        style={{
          backgroundColor: color,
        }}
      >
        &nbsp;
      </div>
    </button>
  </div>
);