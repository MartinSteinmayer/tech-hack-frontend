export const Table = ({
    columns,
    data,
    onRowClick,
    isLoading = false,
    emptyState,
    className = ''
}) => {
    return (
        <div className={`overflow-x-auto shadow-md rounded-lg ${className}`}>
            <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                    <tr>
                        {columns.map((column, index) => (
                            <th
                                key={index}
                                scope="col"
                                className={`px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider ${column.className || ''
                                    }`}
                            >
                                {column.header}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                    {isLoading ? (
                        <tr>
                            <td colSpan={columns.length} className="px-6 py-4 text-center">
                                <div className="flex justify-center">
                                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500"></div>
                                </div>
                                <p className="mt-2 text-sm text-gray-500">Loading data...</p>
                            </td>
                        </tr>
                    ) : data.length === 0 ? (
                        <tr>
                            <td colSpan={columns.length} className="px-6 py-8 text-center">
                                {emptyState || (
                                    <div>
                                        <p className="text-sm font-medium text-gray-900">No items found</p>
                                        <p className="text-sm text-gray-500 mt-1">Try adjusting your search or filter criteria</p>
                                    </div>
                                )}
                            </td>
                        </tr>
                    ) : (
                        data.map((row, rowIndex) => (
                            <tr
                                key={rowIndex}
                                className={`${onRowClick ? 'cursor-pointer hover:bg-gray-50' : ''} ${rowIndex % 2 === 0 ? 'bg-white' : 'bg-gray-50'
                                    }`}
                                onClick={onRowClick ? () => onRowClick(row) : undefined}
                            >
                                {columns.map((column, colIndex) => (
                                    <td
                                        key={colIndex}
                                        className={`px-6 py-4 whitespace-nowrap text-sm ${column.cellClassName || ''
                                            }`}
                                    >
                                        {column.render ? column.render(row) : row[column.accessor]}
                                    </td>
                                ))}
                            </tr>
                        ))
                    )}
                </tbody>
            </table>
        </div>
    );
};
