import { FC, SVGProps } from "react";

export const GMGIcon: FC<SVGProps<SVGSVGElement>> = ({
    className,
    ...props
}) => (
    <svg
        viewBox="0 0 135.6 135.7"
        className={className}
        fill="currentColor"
        xmlns="http://www.w3.org/2000/svg"
        {...props}
    >
        <path
            d="M108.4,93.8c-7.9,8.3-18.9,13.7-31,14.5V93.8Z
            M58.3,108.3C46.1,107.5,35.2,102.1,27.2,93.8H58.3Z
            M135.6,0H67.9C30.4,0,0,30.3,0,67.8c0,37.5,30.4,67.9,67.9,67.9
            35.9,0,65.2-27.8,67.7-63.1V0Z"
        />
    </svg>
);
