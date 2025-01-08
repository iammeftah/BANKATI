import React from 'react';
import {MenuSectionProps} from "../types/type";

export const MenuSection: React.FC<MenuSectionProps> = ({
                                                            title,
                                                            items,
                                                            currentPath,
                                                            onItemClick
                                                        }) => {
    return (
        <div className="mb-6">
            <h3 className="text-sm font-semibold mb-2 text-gray-400">{title}</h3>
            {items.map((item) => (
                <button
                    key={item.id}
                    onClick={() => onItemClick(item.path)}
                    className={`w-full flex items-center space-x-2 p-2 rounded-lg mb-1 ${
                        currentPath === item.path ? 'bg-blue-600' : 'hover:bg-gray-700'
                    }`}
                >
                    {item.icon}
                    <span>{item.label}</span>
                </button>
            ))}
        </div>
    );
};