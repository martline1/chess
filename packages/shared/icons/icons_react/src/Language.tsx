import type { FC, SVGProps } from "react";

export const Language: FC<SVGProps<SVGSVGElement>> = ({
    className = '',
    style = {},
    ...rest
}) => (
    <svg
        width="40"
        height="40"
        viewBox="0 0 40 40"
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
            d="M3.33335 13.3333H36.6667M20 38.3333C30.125 38.3333 38.3334 30.125 38.3334 20C38.3334 9.87499 30.125 1.66666 20 1.66666C9.87502 1.66666 1.66669 9.87499 1.66669 20C1.66669 30.125 9.87502 38.3333 20 38.3333ZM20 38.3333C25 38.3333 26.6667 30 26.6667 20C26.6667 9.99999 25 1.66666 20 1.66666C15 1.66666 13.3334 9.99999 13.3334 20C13.3334 30 15 38.3333 20 38.3333ZM3.33335 26.6667H36.6667H3.33335Z"
            stroke="currentColor"
            strokeWidth="2"
        />
    </svg>

);
