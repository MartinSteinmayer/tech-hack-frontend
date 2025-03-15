export const Empty = ({
    icon,
    title = 'No data found',
    description = 'There are no items to display.',
    action,
    className = '',
}) => {
    return (
        <div className={`text-center py-8 ${className}`}>
            {icon && <div className="mx-auto">{icon}</div>}
            <h3 className="mt-2 text-sm font-medium text-gray-900">{title}</h3>
            <p className="mt-1 text-sm text-gray-500">{description}</p>
            {action && <div className="mt-6">{action}</div>}
        </div>
    );
};
