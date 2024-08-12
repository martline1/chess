import {
    useId,
    type FC,
} from "react";

import { Flex } from "@ui/Flex";
import { getObligatoryElementById } from "@helpers/getObligatoryElementById";
import styles from "./ColorInput.module.scss";

export type ColorInputViewProps = {
    label: string;
    color: string;
    onChange: (newColor: string) => void;
    extraEspace?: boolean;
};

export const ColorInputView: FC<ColorInputViewProps> = ({
    label,
    color,
    onChange,
    extraEspace,
}) => {
    const inputColorId = useId();

    const handleClick = () => {
        const inputColor = getObligatoryElementById(inputColorId);

        inputColor?.click();
    };

    return (
        <Flex
            align="center"
            direction="row"
            className={styles.colorInput}
        >
            <Flex
                align="center"
                wrap="wrap"
                grow
            >
                <span>{label}</span>
            </Flex>

            <button
                type="button"
                onClick={handleClick}
                className={styles.square}
                style={{
                    backgroundColor : color,
                }}
            >
                <input
                    id={inputColorId}
                    type="color"
                    value={color}
                    onChange={evnt => onChange(evnt?.target?.value)}
                    style={{
                        visibility : "hidden"
                    }}
                />
            </button>
    
            { extraEspace && (
                <div className={styles.square}>&nbsp;</div>
            ) }
        </Flex>
    );
};