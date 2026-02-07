'use client';

import { useState, useEffect } from 'react';
import { FolderOpen, Folder, Home, Plus, Download, X, ChevronLeft, ChevronRight } from 'lucide-react';
import { Category } from '@/lib/database';

interface SidebarProps {
    categories: Category[] | undefined;
    selectedCategory: string;
    onSelectCategory: (category: string) => void;
    onAddCategory: () => void;
    projectsCount: number;
    onInstallApp: () => void;
    isInstallable: boolean;
}

export default function Sidebar({
                                    categories,
                                    selectedCategory,
                                    onSelectCategory,
                                    onAddCategory,
                                    projectsCount,
                                    onInstallApp,
                                    isInstallable
                                }: SidebarProps) {
    const [collapsed, setCollapsed] = useState(false);

    return (
        <aside className={`
      fixed left-0 top-0 h-screen bg-white border-r border-gray-200 
      shadow-sm transition-all duration-300 z-40
      ${collapsed ? 'w-16' : 'w-64'}
    `}>
            {/* Toggle Button - Correctly Positioned */}
            <button
                onClick={() => setCollapsed(!collapsed)}
                className="absolute -right-3 top-6 bg-white border border-gray-300 rounded-full p-2 shadow-md hover:shadow-lg transition-shadow hover:bg-gray-50 z-50"
                aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
            >
                {collapsed ? (
                    <ChevronRight size={16} className="text-gray-600" />
                ) : (
                    <ChevronLeft size={16} className="text-gray-600" />
                )}
            </button>

            {/* Logo */}
            <div className="p-4 border-b border-gray-100">
                <div className="flex items-center gap-3">
                    <div className="bg-gradient-to-r from-indigo-500 to-purple-500 p-2 rounded-lg">
                        <FolderOpen className="text-white" size={22} />
                    </div>
                    {!collapsed && (
                        <div>
                            <h1 className="font-bold text-gray-900 text-lg">SmartKode</h1>
                            <p className="text-xs text-gray-500">Project Manager</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Navigation */}
            <nav className="p-3">
                <ul className="space-y-1">
                    {/* All Projects */}
                    <li>
                        <button
                            onClick={() => onSelectCategory('all')}
                            className={`
                w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all
                ${selectedCategory === 'all'
                                ? 'bg-gradient-to-r from-indigo-50 to-purple-50 text-indigo-700 border border-indigo-100'
                                : 'text-gray-700 hover:bg-gray-50'}
              `}
                        >
                            <Home size={18} />
                            {!collapsed && (
                                <>
                                    <span className="font-medium">All Projects</span>
                                    <span className="ml-auto bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded-full">
                    {projectsCount}
                  </span>
                                </>
                            )}
                        </button>
                    </li>

                    {/* Categories Header */}
                    {!collapsed && (
                        <li className="pt-4 pb-1">
                            <div className="flex items-center justify-between px-3">
                                <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                    Categories
                                </h2>
                                <button
                                    onClick={onAddCategory}
                                    className="p-1 hover:bg-gray-100 rounded-md text-gray-500 hover:text-gray-700"
                                    title="Add Category"
                                >
                                    <Plus size={14} />
                                </button>
                            </div>
                        </li>
                    )}

                    {/* Categories List */}
                    {categories?.map((category) => (
                        <li key={category.id}>
                            <button
                                onClick={() => onSelectCategory(category.name)}
                                className={`
                  w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all group
                  ${selectedCategory === category.name
                                    ? 'bg-gradient-to-r from-indigo-50 to-purple-50 text-indigo-700 border border-indigo-100'
                                    : 'text-gray-700 hover:bg-gray-50'}
                `}
                            >
                                <div className="relative">
                                    <Folder size={18} />
                                    {selectedCategory === category.name && (
                                        <div className="absolute -top-0.5 -right-0.5 w-1.5 h-1.5 bg-indigo-500 rounded-full"></div>
                                    )}
                                </div>
                                {!collapsed && (
                                    <>
                                        <span className="font-medium truncate text-sm">{category.name}</span>
                                        <span className="ml-auto text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full">
                      {/* Count will be passed from parent */}
                    </span>
                                    </>
                                )}
                            </button>
                        </li>
                    ))}

                    {/* Add Category Button (when collapsed) */}
                    {collapsed && (
                        <li className="pt-2">
                            <button
                                onClick={onAddCategory}
                                className="w-full flex justify-center p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-50 rounded-lg"
                                title="Add Category"
                            >
                                <Plus size={18} />
                            </button>
                        </li>
                    )}

                    {/* Install App Section */}
                    {isInstallable && (
                        <li className="pt-4 mt-4 border-t border-gray-100">
                            <button
                                onClick={onInstallApp}
                                className={`
                  w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all
                  bg-gradient-to-r from-emerald-50 to-teal-50 hover:from-emerald-100 hover:to-teal-100
                  border border-emerald-100 text-emerald-700
                `}
                            >
                                <Download size={18} />
                                {!collapsed && (
                                    <>
                                        <span className="font-medium text-sm">Install App</span>
                                        <span className="ml-auto text-xs bg-emerald-500 text-white px-2 py-0.5 rounded-full">
                      Free
                    </span>
                                    </>
                                )}
                            </button>
                        </li>
                    )}

                    {/* Force Install for PWA Issues */}
                    {!collapsed && (
                        <li className="pt-2">
                            <div className="px-3">
                                <p className="text-xs text-gray-500 text-center">
                                    Works offline • Auto-sync
                                </p>
                            </div>
                        </li>
                    )}
                </ul>
            </nav>
        </aside>
    );
}