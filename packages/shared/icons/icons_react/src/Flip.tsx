import type { FC, SVGProps } from "react";

export const Flip: FC<SVGProps<SVGSVGElement>> = ({
    className = '',
    style = {},
    ...rest
}) => (
    <svg
        width="800px"
        height="800px"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
        style={{
            width: '1em',
            height: '1em',
            ...style,
        }}
        className={className}
        {...rest}
    >
        <rect
            width="24"
            height="24"
            transform="rotate(180 12 12)"
            opacity="0"
        />

        <path
            fill="currentColor"
            d="M6.09 19h12l-1.3 1.29a1 1 0 0 0 1.42 1.42l3-3a1 1 0 0 0 0-1.42l-3-3a1 1 0 0 0-1.42 0 1 1 0 0 0 0 1.42l1.3 1.29h-12a1.56 1.56 0 0 1-1.59-1.53V13a1 1 0 0 0-2 0v2.47A3.56 3.56 0 0 0 6.09 19z"
        />

        <path
            fill="currentColor"
            d="M5.79 9.71a1 1 0 1 0 1.42-1.42L5.91 7h12a1.56 1.56 0 0 1 1.59 1.53V11a1 1 0 0 0 2 0V8.53A3.56 3.56 0 0 0 17.91 5h-12l1.3-1.29a1 1 0 0 0 0-1.42 1 1 0 0 0-1.42 0l-3 3a1 1 0 0 0 0 1.42z"
        />
    </svg>
);
