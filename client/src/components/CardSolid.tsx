export const CardSolid = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => {
    return (
        <div
            className={`bg-white rounded-xl shadow-sm  ${className}`}
        >
            {children}
        </div>
    );
};
