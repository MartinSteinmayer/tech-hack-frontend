export const Select = ({
    label,
    name,
    options,
    value,
    onChange,
    placeholder = "Select an option",
    error,
    required = false,
    className = '',
    ...props
}) => {
    const baseSelectClass = "block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50";
    const errorSelectClass = "border-red-300 focus:border-red-500 focus:ring-red-200";

    const selectClass = `${baseSelectClass} ${error ? errorSelectClass : ''} ${className}`;

    return (
        <div>
            {label && (
                <label htmlFor={name} className="block text-sm font-medium text-gray-700 mb-1">
                    {label} {required && <span className="text-red-500">*</span>}
                </label>
            )}
            <select
                id={name}
                name={name}
                value={value}
                onChange={onChange}
                className={selectClass}
                required={required}
                {...props}
            >
                {placeholder && (
                    <option value="">{placeholder}</option>
                )}
                {options.map((option) => (
                    <option key={option.value} value={option.value}>
                        {option.label}
                    </option>
                ))}
            </select>
            {error && (
                <p className="mt-1 text-sm text-red-600">{error}</p>
            )}
        </div>
    );
};
