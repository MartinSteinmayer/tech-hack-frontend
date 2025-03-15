export const Spinner = ({
    size = 'md',
    color = 'blue',
    className = ''
}) => {
    const sizeClasses = {
        sm: 'h-4 w-4 border-2',
        md: 'h-8 w-8 border-2',
        lg: 'h-12 w-12 border-3',
    };

    const colorClasses = {
        blue: 'border-blue-500',
        gray: 'border-gray-500',
        green: 'border-green-500',
        red: 'border-red-500',
        white: 'border-white',
    };

    return (
        <div className={`animate-spin rounded-full border-t-transparent ${sizeClasses[size]} ${colorClasses[color]} ${className}`}></div>
    );
};
