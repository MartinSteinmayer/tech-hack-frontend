export const Tabs = ({
    tabs,
    activeTab,
    onChange,
    className = ''
}) => {
    return (
        <div className={`border-b border-gray-200 ${className}`}>
            <nav className="flex -mb-px space-x-8 overflow-x-auto">
                {tabs.map((tab) => (
                    <button
                        key={tab.id}
                        className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${activeTab === tab.id
                                ? 'border-blue-500 text-blue-600'
                                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                            }`}
                        onClick={() => onChange(tab.id)}
                    >
                        {tab.label}
                    </button>
                ))}
            </nav>
        </div>
    );
};
