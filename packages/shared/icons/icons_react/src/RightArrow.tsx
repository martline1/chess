import type { FC, SVGProps } from "react";

export const RightArrow: FC<SVGProps<SVGSVGElement>> = ({
    className = '',
    style = {},
    ...rest
}) => (
    <svg
        viewBox="0 0 1024 1024"
        version="1.1"
        xmlns="http://www.w3.org/2000/svg"
        strokeWidth="55"
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
            d="M256 120.768L306.432 64 768 512l-461.568 448L256 903.232 659.072 512z"
        />
    </svg>
);
