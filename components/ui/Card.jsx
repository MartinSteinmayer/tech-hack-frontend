export const Card = ({
    children,
    title,
    subtitle,
    className = '',
    headerActions,
    footer,
    ...props
}) => {
    return (
        <div
            className={`bg-white rounded-lg shadow-md overflow-hidden ${className}`}
            {...props}
        >
            {(title || headerActions) && (
                <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
                    <div>
                        {title && <h3 className="text-lg font-medium text-gray-800">{title}</h3>}
                        {subtitle && <p className="text-sm text-gray-500 mt-1">{subtitle}</p>}
                    </div>
                    {headerActions && <div>{headerActions}</div>}
                </div>
            )}
            <div className="p-6">
                {children}
            </div>
            {footer && (
                <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
                    {footer}
                </div>
            )}
        </div>
    );
};
