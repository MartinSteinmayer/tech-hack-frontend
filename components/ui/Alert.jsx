export const Alert = ({
    title,
    children,
    variant = 'info',
    icon,
    onClose,
    className = '',
}) => {
    const variantStyles = {
        info: 'bg-blue-50 border-blue-200 text-blue-800',
        success: 'bg-green-50 border-green-200 text-green-800',
        warning: 'bg-yellow-50 border-yellow-200 text-yellow-800',
        error: 'bg-red-50 border-red-200 text-red-800',
    };

    return (
        <div className={`p-4 border rounded-md ${variantStyles[variant]} ${className}`}>
            <div className="flex">
                {icon && <div className="flex-shrink-0 mr-3">{icon}</div>}
                <div className="flex-1">
                    {title && <h3 className="text-sm font-medium mb-1">{title}</h3>}
                    <div className="text-sm">{children}</div>
                </div>
                {onClose && (
                    <button
                        type="button"
                        className="ml-auto -mx-1.5 -my-1.5 rounded-md p-1.5 inline-flex text-gray-500 hover:bg-gray-100 focus:outline-none"
                        onClick={onClose}
                    >
                        <span className="sr-only">Dismiss</span>
                        <FiX className="h-5 w-5" />
                    </button>
                )}
            </div>
        </div>
    );
};
