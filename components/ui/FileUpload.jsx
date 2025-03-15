import { useState } from 'react';
import { FiUpload, FiFileText, FiX } from 'react-icons/fi';

export const FileUpload = ({
    label,
    accept,
    maxSize = 10, // in MB
    onChange,
    error,
    value,
    multiple = false,
    required = false,
    className = '',
}) => {
    const [dragActive, setDragActive] = useState(false);

    const handleDrag = (e) => {
        e.preventDefault();
        e.stopPropagation();

        if (e.type === 'dragenter' || e.type === 'dragover') {
            setDragActive(true);
        } else if (e.type === 'dragleave') {
            setDragActive(false);
        }
    };

    const handleDrop = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);

        if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
            validateAndProcessFiles(e.dataTransfer.files);
        }
    };

    const handleChange = (e) => {
        if (e.target.files && e.target.files.length > 0) {
            validateAndProcessFiles(e.target.files);
        }
    };

    const validateAndProcessFiles = (files) => {
        const validFiles = Array.from(files).filter(file => {
            // Check file size
            if (file.size > maxSize * 1024 * 1024) {
                console.error(`File ${file.name} exceeds the ${maxSize}MB size limit`);
                return false;
            }

            // If accept parameter is provided, check MIME type
            if (accept && !accept.split(',').some(type => {
                // Handle wildcards like image/*
                if (type.includes('/*')) {
                    const mainType = type.split('/')[0];
                    return file.type.startsWith(`${mainType}/`);
                }
                return file.type === type.trim();
            })) {
                console.error(`File ${file.name} has an invalid type`);
                return false;
            }

            return true;
        });

        if (validFiles.length > 0) {
            onChange(multiple ? validFiles : validFiles[0]);
        }
    };

    const removeFile = () => {
        onChange(multiple ? [] : null);
    };

    return (
        <div className={className}>
            {label && (
                <label className="block text-sm font-medium text-gray-700 mb-1">
                    {label} {required && <span className="text-red-500">*</span>}
                </label>
            )}

            <div
                className={`border-2 border-dashed rounded-lg p-6 ${dragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300'
                    } ${error ? 'border-red-300' : ''}`}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
            >
                {!value || (Array.isArray(value) && value.length === 0) ? (
                    <div className="text-center">
                        <FiUpload className="mx-auto h-12 w-12 text-gray-400" />
                        <div className="mt-4 flex text-sm leading-6 text-gray-600 justify-center">
                            <label
                                htmlFor="file-upload"
                                className="relative cursor-pointer rounded-md font-semibold text-blue-600 focus-within:outline-none focus-within:ring-2 focus-within:ring-blue-600 focus-within:ring-offset-2 hover:text-blue-500"
                            >
                                <span>Upload {multiple ? 'files' : 'a file'}</span>
                                <input
                                    id="file-upload"
                                    name="file-upload"
                                    type="file"
                                    className="sr-only"
                                    onChange={handleChange}
                                    accept={accept}
                                    multiple={multiple}
                                    required={required}
                                />
                            </label>
                            <p className="pl-1">or drag and drop</p>
                        </div>
                        {accept && (
                            <p className="text-xs text-gray-500 mt-1">
                                Allowed file types: {accept.split(',').join(', ')}
                            </p>
                        )}
                        <p className="text-xs text-gray-500 mt-1">
                            Max size: {maxSize}MB
                        </p>
                    </div>
                ) : (
                    <div className="flex items-center justify-center">
                        {Array.isArray(value) ? (
                            <div className="space-y-2 w-full">
                                {value.map((file, index) => (
                                    <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
                                        <div className="flex items-center">
                                            <FiFileText className="h-5 w-5 text-blue-500 mr-2" />
                                            <div>
                                                <p className="text-sm font-medium text-gray-900">{file.name}</p>
                                                <p className="text-xs text-gray-500">
                                                    {(file.size / 1024).toFixed(2)} KB
                                                </p>
                                            </div>
                                        </div>
                                        <button
                                            type="button"
                                            onClick={() => {
                                                const newFiles = [...value];
                                                newFiles.splice(index, 1);
                                                onChange(newFiles);
                                            }}
                                            className="p-1 rounded-full text-gray-500 hover:bg-gray-200"
                                        >
                                            <FiX className="h-4 w-4" />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="flex items-center p-3 bg-gray-50 rounded-lg w-full">
                                <FiFileText className="h-10 w-10 text-blue-500 mr-3" />
                                <div className="flex-1">
                                    <p className="text-sm font-medium text-gray-900">{value.name}</p>
                                    <p className="text-xs text-gray-500">
                                        {(value.size / 1024).toFixed(2)} KB • {value.type || 'Unknown type'}
                                    </p>
                                </div>
                                <button
                                    type="button"
                                    onClick={removeFile}
                                    className="p-1 rounded-full text-gray-500 hover:bg-gray-200"
                                >
                                    <FiX className="h-5 w-5" />
                                </button>
                            </div>
                        )}
                    </div>
                )}
            </div>

            {error && (
                <p className="mt-1 text-sm text-red-600">{error}</p>
            )}
        </div>
    );
};
