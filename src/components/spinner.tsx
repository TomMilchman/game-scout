interface SpinnerProps {
    small?: boolean;
}

export default function Spinner({ small = false }: SpinnerProps) {
    return (
        <div
            className={`${
                small ? "w-9 h-9" : "w-18 h-18"
            } border-4 border-blue-500 border-t-transparent rounded-full animate-spin`}
        ></div>
    );
}
