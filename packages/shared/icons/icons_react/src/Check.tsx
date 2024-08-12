import type { FC, SVGProps } from "react";

export const Check: FC<SVGProps<SVGSVGElement>> = ({
    className = '',
    style = {},
    ...rest
}) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        width="22.903"
        height="19.395"
        viewBox="0 0 22.903 19.395"
        style={{
            width: '1em',
            height: '1em',
            ...style,
        }}
        className={className}
        {...rest}
    >
        <polygon
            fill="currentColor"
            points="22.903 2.828 20.075 0 6.641 13.435 3.102 9.09 0 11.616 6.338 19.395 22.903 2.828"
        />
    </svg>
  
);
