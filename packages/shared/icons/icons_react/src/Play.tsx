import type { FC, SVGProps } from "react";

export const Play: FC<SVGProps<SVGSVGElement>> = ({
    className = '',
    style = {},
    ...rest
}) => (
    <svg
        width="800px"
        height="800px"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{
            width: '1em',
            height: '1em',
            ...style,
        }}
        className={className}
        {...rest}
    >
        <path
            fill="currentColor"
            d="M21.4086 9.35258C23.5305 10.5065 23.5305 13.4935 21.4086 14.6474L8.59662 21.6145C6.53435 22.736 4 21.2763 4 18.9671L4 5.0329C4 2.72368 6.53435 1.26402 8.59661 2.38548L21.4086 9.35258Z"
        />
    </svg>
);
