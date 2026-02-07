'use client';

import { useState, useEffect } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { db, Project, Category } from '@/lib/database';
import {
    Plus, X, Heart, Trash2, Edit2,
    ExternalLink, Maximize2, FolderOpen,
    Star, Download, MoreVertical, ChevronLeft,
    ChevronRight, Home, Settings, RefreshCw,
    Palette, Menu, Save
} from 'lucide-react';

// Default favorites structure
const DEFAULT_FAVORITES = {
    projects: [] as number[],
    categories: [] as string[]
};

// Default settings structure
const DEFAULT_SETTINGS = {
    appName: 'SmartKode',
    appSubtitle: 'Projects',
    themeColor: '#4f46e5',
    accentColor: '#9333ea'
};

export default function HomePage() {
    // State
    const [showModal, setShowModal] = useState(false);
    const [modalType, setModalType] = useState<'project' | 'category' | 'settings'>('project');
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [fullscreenProject, setFullscreenProject] = useState<Project | null>(null);
    const [form, setForm] = useState({ title: '', url: '', category: '', id: 0 });
    const [installPrompt, setInstallPrompt] = useState<any>(null);
    const [categoryMenuOpen, setCategoryMenuOpen] = useState<string | null>(null);
    const [isUpdating, setIsUpdating] = useState(false);

    // Initialize favorites and settings
    const [favorites, setFavorites] = useState(DEFAULT_FAVORITES);
    const [settings, setSettings] = useState(DEFAULT_SETTINGS);
    const [tempSettings, setTempSettings] = useState(DEFAULT_SETTINGS);

    // Data
    const categories = useLiveQuery(() => db.categories.toArray());
    const projects = useLiveQuery(() => db.projects.toArray());

    // Filter projects
    const filteredProjects = projects?.filter(p => {
        if (selectedCategory === 'all') return true;
        if (selectedCategory === 'favorites') return favorites?.projects?.includes(p.id!);
        if (selectedCategory === 'fav-categories') {
            return favorites?.categories?.includes(p.category);
        }
        return p.category === selectedCategory;
    });

    // Get category project count
    const getCategoryCount = (categoryName: string) => {
        return projects?.filter(p => p.category === categoryName).length || 0;
    };

    // PWA Install
    useEffect(() => {
        const handler = (e: Event) => {
            e.preventDefault();
            setInstallPrompt(e);
        };
        window.addEventListener('beforeinstallprompt', handler);
        return () => window.removeEventListener('beforeinstallprompt', handler);
    }, []);

    // Load favorites from localStorage
    useEffect(() => {
        try {
            const favs = localStorage.getItem('favorites');
            if (favs) {
                const parsed = JSON.parse(favs);
                setFavorites({
                    projects: Array.isArray(parsed.projects) ? parsed.projects : [],
                    categories: Array.isArray(parsed.categories) ? parsed.categories : []
                });
            } else {
                setFavorites(DEFAULT_FAVORITES);
            }
        } catch (error) {
            console.error('Error loading favorites:', error);
            setFavorites(DEFAULT_FAVORITES);
        }
    }, []);

    // Load settings from localStorage
    useEffect(() => {
        try {
            const storedSettings = localStorage.getItem('appSettings');
            if (storedSettings) {
                const parsed = JSON.parse(storedSettings);
                setSettings({ ...DEFAULT_SETTINGS, ...parsed });
                setTempSettings({ ...DEFAULT_SETTINGS, ...parsed });
            }
        } catch (error) {
            console.error('Error loading settings:', error);
        }
    }, []);

    // Save favorites to localStorage
    useEffect(() => {
        if (favorites) {
            localStorage.setItem('favorites', JSON.stringify(favorites));
        }
    }, [favorites]);

    // Update theme colors
    useEffect(() => {
        document.documentElement.style.setProperty('--theme-color', settings.themeColor);
        document.documentElement.style.setProperty('--accent-color', settings.accentColor);
    }, [settings]);

    // Close menu when clicking outside
    useEffect(() => {
        const handleClickOutside = () => {
            setCategoryMenuOpen(null);
            if (window.innerWidth >= 768) {
                setMobileMenuOpen(false);
            }
        };
        if (categoryMenuOpen || mobileMenuOpen) {
            window.addEventListener('click', handleClickOutside);
            return () => window.removeEventListener('click', handleClickOutside);
        }
    }, [categoryMenuOpen, mobileMenuOpen]);

    // Handle window resize
    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth < 768) {
                setSidebarCollapsed(true);
            }
        };
        handleResize();
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    // Actions
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            if (modalType === 'project') {
                if (form.id) {
                    await db.projects.update(form.id, form);
                } else {
                    await db.projects.add({ ...form, createdAt: new Date() });
                }
            } else if (modalType === 'category') {
                if (form.id) {
                    await db.categories.update(form.id, { name: form.title });
                } else {
                    await db.categories.add({ name: form.title, createdAt: new Date() });
                }
            } else if (modalType === 'settings') {
                localStorage.setItem('appSettings', JSON.stringify(tempSettings));
                setSettings(tempSettings);
            }
            setShowModal(false);
            resetForm();
        } catch (error) {
            console.error('Save failed:', error);
            alert('Save failed. Please try again.');
        }
    };

    const deleteItem = async (type: 'project' | 'category', id: number, name?: string) => {
        if (!confirm(`Delete ${type}?`)) return;
        try {
            if (type === 'project') {
                await db.projects.delete(id);
                setFavorites(f => ({
                    projects: f?.projects?.filter(p => p !== id) || [],
                    categories: f?.categories || []
                }));
            } else {
                if (projects?.some(p => p.category === name)) {
                    alert('Category has projects. Delete them first.');
                    return;
                }
                await db.categories.delete(id);
                setFavorites(f => ({
                    projects: f?.projects || [],
                    categories: f?.categories?.filter(c => c !== name) || []
                }));
                if (selectedCategory === name) setSelectedCategory('all');
            }
            setCategoryMenuOpen(null);
        } catch (error) {
            console.error('Delete failed:', error);
            alert('Delete failed.');
        }
    };

    const toggleFavorite = (type: 'project' | 'category', id: number | string) => {
        setFavorites(f => {
            const currentFavorites = f || DEFAULT_FAVORITES;

            if (type === 'project') {
                const projectId = id as number;
                const projects = currentFavorites.projects || [];
                return {
                    ...currentFavorites,
                    projects: projects.includes(projectId)
                        ? projects.filter(p => p !== projectId)
                        : [...projects, projectId]
                };
            } else {
                const categoryName = id as string;
                const categories = currentFavorites.categories || [];
                return {
                    ...currentFavorites,
                    categories: categories.includes(categoryName)
                        ? categories.filter(c => c !== categoryName)
                        : [...categories, categoryName]
                };
            }
        });
    };

    const resetForm = () => setForm({ title: '', url: '', category: '', id: 0 });

    const installPWA = () => {
        if (installPrompt) {
            installPrompt.prompt();
            installPrompt.userChoice.then(() => setInstallPrompt(null));
        }
    };

    const forceUpdate = async () => {
        setIsUpdating(true);
        try {
            const registration = await navigator.serviceWorker.getRegistration();
            if (registration) {
                await registration.update();
                setTimeout(() => {
                    window.location.reload();
                }, 1000);
            } else {
                window.location.reload();
            }
        } catch (error) {
            console.error('Update failed:', error);
            window.location.reload();
        }
    };

    const isFavorite = (type: 'project' | 'category', id: number | string) => {
        if (!favorites) return false;

        if (type === 'project') {
            return favorites.projects?.includes(id as number) || false;
        } else {
            return favorites.categories?.includes(id as string) || false;
        }
    };

    // Safe access to favorites length
    const favoriteProjectsCount = favorites?.projects?.length || 0;
    const favoriteCategoriesCount = favorites?.categories?.length || 0;

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Mobile Header */}
            <header className="md:hidden fixed top-0 left-0 right-0 bg-white border-b border-gray-200 z-50 px-4 py-3">
                <div className="flex items-center justify-between">
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            setMobileMenuOpen(!mobileMenuOpen);
                        }}
                        className="p-2 hover:bg-gray-100 rounded-lg"
                    >
                        <Menu size={24} />
                    </button>
                    <div className="flex items-center gap-2">
                        <div className="bg-gradient-to-r from-indigo-500 to-purple-500 p-1.5 rounded-lg">
                            <FolderOpen className="text-white" size={18} />
                        </div>
                        <div>
                            <h1 className="font-bold text-base">{settings.appName}</h1>
                        </div>
                    </div>
                    <button
                        onClick={() => {
                            setModalType('settings');
                            setTempSettings(settings);
                            setShowModal(true);
                        }}
                        className="p-2 hover:bg-gray-100 rounded-lg"
                    >
                        <Settings size={20} />
                    </button>
                </div>
            </header>

            {/* Sidebar */}
            <aside className={`fixed top-0 left-0 h-screen bg-white shadow-lg transition-all duration-300 z-40 
                ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
                ${sidebarCollapsed ? 'w-16' : 'w-64'}`}>
                {/* Toggle Button (Desktop Only) */}
                <button
                    onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
                    className="hidden md:block absolute -right-3 top-6 bg-white border border-gray-300 rounded-full p-1.5 shadow-md z-50"
                >
                    {sidebarCollapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
                </button>

                {/* Logo */}
                <div className="p-4 border-b">
                    <div className="flex items-center gap-3">
                        <div className="bg-gradient-to-r from-indigo-500 to-purple-500 p-2 rounded-lg">
                            <FolderOpen className="text-white" size={20} />
                        </div>
                        {!sidebarCollapsed && (
                            <div>
                                <h1 className="font-bold text-lg">{settings.appName}</h1>
                                <p className="text-xs text-gray-500">{settings.appSubtitle}</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Navigation */}
                <nav className="p-3 space-y-1 overflow-y-auto" style={{ height: 'calc(100vh - 200px)' }}>
                    {/* All Projects */}
                    <button
                        onClick={() => {
                            setSelectedCategory('all');
                            setMobileMenuOpen(false);
                        }}
                        className={`w-full flex items-center gap-3 p-2.5 rounded-lg ${selectedCategory === 'all' ? 'bg-indigo-50 text-indigo-700 border border-indigo-100' : 'hover:bg-gray-50'}`}
                    >
                        <Home size={18} />
                        {!sidebarCollapsed && (
                            <>
                                <span className="font-medium">All Projects</span>
                                <span className="ml-auto bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded-full">
                                    {projects?.length || 0}
                                </span>
                            </>
                        )}
                    </button>

                    {/* Favorites */}
                    <button
                        onClick={() => {
                            setSelectedCategory('favorites');
                            setMobileMenuOpen(false);
                        }}
                        className={`w-full flex items-center gap-3 p-2.5 rounded-lg ${selectedCategory === 'favorites' ? 'bg-indigo-50 text-indigo-700 border border-indigo-100' : 'hover:bg-gray-50'}`}
                    >
                        <Star size={18} fill={selectedCategory === 'favorites' ? '#4f46e5' : 'none'} />
                        {!sidebarCollapsed && (
                            <>
                                <span className="font-medium">Favorites</span>
                                <span className="ml-auto bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded-full">
                                    {favoriteProjectsCount}
                                </span>
                            </>
                        )}
                    </button>

                    {/* Favorite Categories */}
                    <button
                        onClick={() => {
                            setSelectedCategory('fav-categories');
                            setMobileMenuOpen(false);
                        }}
                        className={`w-full flex items-center gap-3 p-2.5 rounded-lg ${selectedCategory === 'fav-categories' ? 'bg-indigo-50 text-indigo-700 border border-indigo-100' : 'hover:bg-gray-50'}`}
                    >
                        <Heart size={18} />
                        {!sidebarCollapsed && (
                            <>
                                <span className="font-medium">Fav Categories</span>
                                <span className="ml-auto bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded-full">
                                    {favoriteCategoriesCount}
                                </span>
                            </>
                        )}
                    </button>

                    {/* Categories Header */}
                    {!sidebarCollapsed && (
                        <div className="pt-4 pb-2 flex items-center justify-between">
                            <span className="text-xs font-semibold text-gray-500 uppercase">Categories</span>
                            <button
                                onClick={() => {
                                    setModalType('category');
                                    resetForm();
                                    setShowModal(true);
                                    setMobileMenuOpen(false);
                                }}
                                className="p-1 hover:bg-gray-100 rounded"
                            >
                                <Plus size={14} />
                            </button>
                        </div>
                    )}

                    {/* Categories List */}
                    {categories?.map(cat => {
                        const isFavCat = isFavorite('category', cat.name);
                        const count = getCategoryCount(cat.name);

                        return (
                            <div
                                key={cat.id}
                                className={`relative group flex items-center p-2 rounded-lg ${selectedCategory === cat.name ? 'bg-indigo-50 text-indigo-700 border border-indigo-100' : 'hover:bg-gray-50'}`}
                            >
                                <button
                                    onClick={() => {
                                        setSelectedCategory(cat.name);
                                        setMobileMenuOpen(false);
                                    }}
                                    className="flex-1 flex items-center gap-3 text-left"
                                >
                                    <FolderOpen size={16} />
                                    {!sidebarCollapsed && (
                                        <>
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center gap-2">
                                                    <span className="truncate font-medium">{cat.name}</span>
                                                    {isFavCat && (
                                                        <Heart size={12} className="text-red-500 fill-current" />
                                                    )}
                                                </div>
                                                <div className="text-xs text-gray-500">{count} projects</div>
                                            </div>
                                        </>
                                    )}
                                </button>

                                {!sidebarCollapsed && (
                                    <div className="relative">
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                setCategoryMenuOpen(categoryMenuOpen === cat.name ? null : cat.name);
                                            }}
                                            className="p-1 hover:bg-gray-200 rounded opacity-0 group-hover:opacity-100 transition-opacity"
                                        >
                                            <MoreVertical size={14} />
                                        </button>

                                        {categoryMenuOpen === cat.name && (
                                            <div className="absolute right-0 top-full mt-1 w-40 bg-white shadow-lg rounded-lg border z-50">
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        toggleFavorite('category', cat.name);
                                                    }}
                                                    className="w-full flex items-center gap-2 p-2 hover:bg-gray-50 text-left"
                                                >
                                                    <Heart size={14} fill={isFavCat ? '#ef4444' : 'none'} />
                                                    <span>{isFavCat ? 'Unfavorite' : 'Favorite'}</span>
                                                </button>
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        setModalType('category');
                                                        setForm({
                                                            title: cat.name,
                                                            url: '',
                                                            category: '',
                                                            id: cat.id!
                                                        });
                                                        setShowModal(true);
                                                        setCategoryMenuOpen(null);
                                                    }}
                                                    className="w-full flex items-center gap-2 p-2 hover:bg-gray-50 text-left"
                                                >
                                                    <Edit2 size={14} />
                                                    <span>Edit</span>
                                                </button>
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        deleteItem('category', cat.id!, cat.name);
                                                    }}
                                                    className="w-full flex items-center gap-2 p-2 hover:bg-gray-50 text-left text-red-600"
                                                >
                                                    <Trash2 size={14} />
                                                    <span>Delete</span>
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                )}

                                {sidebarCollapsed && isFavCat && (
                                    <div className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full"></div>
                                )}
                            </div>
                        );
                    })}

                    {sidebarCollapsed && (
                        <button
                            onClick={() => {
                                setModalType('category');
                                resetForm();
                                setShowModal(true);
                            }}
                            className="w-full flex justify-center p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-50 rounded-lg mt-4"
                        >
                            <Plus size={18} />
                        </button>
                    )}

                    {/* Settings Button */}
                    {!sidebarCollapsed && (
                        <button
                            onClick={() => {
                                setModalType('settings');
                                setTempSettings(settings);
                                setShowModal(true);
                                setMobileMenuOpen(false);
                            }}
                            className="w-full flex items-center gap-3 p-2.5 rounded-lg hover:bg-gray-50 mt-4"
                        >
                            <Settings size={18} />
                            <span className="font-medium">Settings</span>
                        </button>
                    )}

                    {/* Install PWA Button */}
                    {installPrompt && (
                        <div className={`pt-4 mt-4 border-t ${sidebarCollapsed ? 'px-2' : 'px-3'}`}>
                            <button
                                onClick={installPWA}
                                className={`w-full flex items-center gap-3 p-2.5 rounded-lg bg-gradient-to-r from-emerald-500 to-teal-500 text-white hover:from-emerald-600 hover:to-teal-600 ${sidebarCollapsed ? 'justify-center' : ''}`}
                            >
                                <Download size={18} />
                                {!sidebarCollapsed && <span className="font-medium">Install App</span>}
                            </button>
                        </div>
                    )}
                </nav>
            </aside>

            {/* Mobile Menu Overlay */}
            {mobileMenuOpen && (
                <div
                    className="md:hidden fixed inset-0 bg-black bg-opacity-50 z-30"
                    onClick={() => setMobileMenuOpen(false)}
                />
            )}

            {/* Main Content */}
            <main className={`transition-all duration-300 min-h-screen pt-16 md:pt-0 ${sidebarCollapsed ? 'md:ml-16' : 'md:ml-64'}`}>
                <header className="hidden md:block bg-white shadow p-4 sticky top-0 z-30">
                    <div className="flex justify-between items-center">
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900">
                                {selectedCategory === 'all' ? 'All Projects' :
                                    selectedCategory === 'favorites' ? 'Favorite Projects' :
                                        selectedCategory === 'fav-categories' ? 'Favorite Categories' :
                                            selectedCategory}
                            </h1>
                            <p className="text-gray-600">
                                {filteredProjects?.length || 0} {filteredProjects?.length === 1 ? 'project' : 'projects'}
                            </p>
                        </div>
                        <div className="flex items-center gap-3">
                            <button
                                onClick={() => {
                                    setModalType('category');
                                    resetForm();
                                    setShowModal(true);
                                }}
                                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 font-medium"
                            >
                                + Category
                            </button>
                            <button
                                onClick={() => {
                                    setModalType('project');
                                    resetForm();
                                    setForm(f => ({
                                        ...f,
                                        category: selectedCategory !== 'all' &&
                                        selectedCategory !== 'favorites' &&
                                        selectedCategory !== 'fav-categories' ?
                                            selectedCategory : ''
                                    }));
                                    setShowModal(true);
                                }}
                                className="px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg hover:from-indigo-700 hover:to-purple-700 font-medium shadow-md"
                            >
                                + Project
                            </button>
                        </div>
                    </div>
                </header>

                {/* Mobile Action Buttons */}
                <div className="md:hidden fixed bottom-6 right-4 flex flex-col gap-3 z-40">
                    <button
                        onClick={() => {
                            setModalType('category');
                            resetForm();
                            setShowModal(true);
                        }}
                        className="p-4 bg-white border-2 border-gray-300 rounded-full shadow-lg active:scale-95 transition-transform"
                    >
                        <FolderOpen size={20} />
                    </button>
                    <button
                        onClick={() => {
                            setModalType('project');
                            resetForm();
                            setForm(f => ({
                                ...f,
                                category: selectedCategory !== 'all' &&
                                selectedCategory !== 'favorites' &&
                                selectedCategory !== 'fav-categories' ?
                                    selectedCategory : ''
                            }));
                            setShowModal(true);
                        }}
                        className="p-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-full shadow-lg active:scale-95 transition-transform"
                    >
                        <Plus size={24} />
                    </button>
                </div>

                {/* Projects Grid */}
                <div className="p-4 md:p-6 pb-24 md:pb-6">
                    {filteredProjects && filteredProjects.length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                            {filteredProjects.map(project => {
                                const isFavProj = isFavorite('project', project.id!);

                                return (
                                    <div key={project.id} className="bg-white rounded-xl shadow-lg border overflow-hidden hover:shadow-xl transition-shadow">
                                        <div className="h-40 md:h-48 bg-gradient-to-br from-gray-50 to-gray-100 relative overflow-hidden">
                                            <iframe
                                                src={project.url}
                                                className="w-full h-full border-0 pointer-events-none"
                                                title={project.title}
                                                sandbox="allow-scripts allow-same-origin"
                                            />

                                            <div className="absolute top-2 right-2 flex gap-2">
                                                <button
                                                    onClick={() => toggleFavorite('project', project.id!)}
                                                    className={`p-2 rounded-full ${isFavProj ? 'bg-red-500 text-white' : 'bg-black/20 text-white hover:bg-black/30'} backdrop-blur-sm active:scale-95 transition-transform`}
                                                >
                                                    <Heart size={14} fill={isFavProj ? 'white' : 'none'} />
                                                </button>
                                                <button
                                                    onClick={() => setFullscreenProject(project)}
                                                    className="p-2 bg-black/20 text-white rounded-full backdrop-blur-sm hover:bg-black/30 active:scale-95 transition-transform"
                                                >
                                                    <Maximize2 size={14} />
                                                </button>
                                            </div>
                                        </div>

                                        <div className="p-3 md:p-4">
                                            <div className="flex justify-between items-start mb-3">
                                                <span className="px-2 md:px-3 py-1 bg-gradient-to-r from-indigo-100 to-purple-100 text-indigo-700 text-xs font-medium rounded-full">
                                                    {project.category}
                                                </span>
                                                <div className="flex gap-1">
                                                    <button
                                                        onClick={() => {
                                                            setModalType('project');
                                                            setForm({
                                                                title: project.title,
                                                                url: project.url,
                                                                category: project.category,
                                                                id: project.id!
                                                            });
                                                            setShowModal(true);
                                                        }}
                                                        className="p-1.5 hover:bg-blue-50 rounded-lg text-gray-600 hover:text-blue-600 active:scale-95 transition-transform"
                                                    >
                                                        <Edit2 size={14} />
                                                    </button>
                                                    <button
                                                        onClick={() => deleteItem('project', project.id!)}
                                                        className="p-1.5 hover:bg-red-50 rounded-lg text-gray-600 hover:text-red-600 active:scale-95 transition-transform"
                                                    >
                                                        <Trash2 size={14} />
                                                    </button>
                                                </div>
                                            </div>

                                            <h3 className="font-bold text-base md:text-lg text-gray-900 mb-3">
                                                {project.title}
                                            </h3>

                                            <a
                                                href={project.url}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="block w-full text-center py-2.5 md:py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg hover:from-indigo-700 hover:to-purple-700 font-medium transition-all active:scale-95"
                                            >
                                                <ExternalLink className="inline mr-2" size={16} />
                                                Visit Website
                                            </a>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    ) : (
                        <div className="text-center py-12 md:py-20">
                            <FolderOpen className="mx-auto text-gray-300 mb-4" size={48} />
                            <h3 className="text-lg md:text-xl font-semibold text-gray-900 mb-2">
                                No Projects Found
                            </h3>
                            <p className="text-gray-600 mb-6 max-w-md mx-auto px-4">
                                {selectedCategory === 'all'
                                    ? "You haven't added any projects yet. Add your first project to get started!"
                                    : `No projects found in "${selectedCategory}"`}
                            </p>
                            <button
                                onClick={() => {
                                    setModalType('project');
                                    setShowModal(true);
                                }}
                                className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg hover:from-indigo-700 hover:to-purple-700 font-medium shadow-lg active:scale-95 transition-transform"
                            >
                                Add New Project
                            </button>
                        </div>
                    )}
                </div>
            </main>

            {/* Modals */}
            {showModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 backdrop-blur-sm">
                    <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-4 md:p-6 max-h-[90vh] overflow-y-auto">
                        <div className="flex justify-between items-center mb-4 md:mb-6">
                            <h2 className="text-xl md:text-2xl font-bold text-gray-900">
                                {modalType === 'settings' ? 'Settings' : `${form.id ? 'Edit' : 'Add'} ${modalType === 'project' ? 'Project' : 'Category'}`}
                            </h2>
                            <button
                                onClick={() => {
                                    setShowModal(false);
                                    resetForm();
                                }}
                                className="p-2 hover:bg-gray-100 rounded-lg active:scale-95 transition-transform"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        {modalType === 'settings' ? (
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        App Name
                                    </label>
                                    <input
                                        type="text"
                                        value={tempSettings.appName}
                                        onChange={e => setTempSettings({ ...tempSettings, appName: e.target.value })}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        App Subtitle
                                    </label>
                                    <input
                                        type="text"
                                        value={tempSettings.appSubtitle}
                                        onChange={e => setTempSettings({ ...tempSettings, appSubtitle: e.target.value })}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Theme Color
                                    </label>
                                    <div className="flex gap-2">
                                        <input
                                            type="color"
                                            value={tempSettings.themeColor}
                                            onChange={e => setTempSettings({ ...tempSettings, themeColor: e.target.value })}
                                            className="w-16 h-12 rounded-lg border border-gray-300 cursor-pointer"
                                        />
                                        <input
                                            type="text"
                                            value={tempSettings.themeColor}
                                            onChange={e => setTempSettings({ ...tempSettings, themeColor: e.target.value })}
                                            className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Accent Color
                                    </label>
                                    <div className="flex gap-2">
                                        <input
                                            type="color"
                                            value={tempSettings.accentColor}
                                            onChange={e => setTempSettings({ ...tempSettings, accentColor: e.target.value })}
                                            className="w-16 h-12 rounded-lg border border-gray-300 cursor-pointer"
                                        />
                                        <input
                                            type="text"
                                            value={tempSettings.accentColor}
                                            onChange={e => setTempSettings({ ...tempSettings, accentColor: e.target.value })}
                                            className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
                                        />
                                    </div>
                                </div>

                                <div className="pt-4 border-t">
                                    <button
                                        type="button"
                                        onClick={forceUpdate}
                                        disabled={isUpdating}
                                        className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-lg hover:from-emerald-600 hover:to-teal-600 transition-colors font-medium disabled:opacity-50 active:scale-95 transition-transform"
                                    >
                                        <RefreshCw size={18} className={isUpdating ? 'animate-spin' : ''} />
                                        {isUpdating ? 'Updating...' : 'Force Update App'}
                                    </button>
                                    <p className="text-xs text-gray-500 text-center mt-2">
                                        Click to refresh and get the latest version
                                    </p>
                                </div>

                                <div className="flex gap-3 pt-4">
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setShowModal(false);
                                            setTempSettings(settings);
                                        }}
                                        className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium active:scale-95 transition-transform"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        className="flex-1 px-4 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg hover:from-indigo-700 hover:to-purple-700 transition-colors font-medium active:scale-95 transition-transform"
                                    >
                                        <Save size={18} className="inline mr-2" />
                                        Save
                                    </button>
                                </div>
                            </form>
                        ) : (
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        {modalType === 'project' ? 'Project Title' : 'Category Name'}
                                    </label>
                                    <input
                                        type="text"
                                        value={form.title}
                                        onChange={e => setForm({ ...form, title: e.target.value })}
                                        placeholder={modalType === 'project' ? 'Enter project name...' : 'Enter category name...'}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
                                        required
                                        autoFocus
                                    />
                                </div>

                                {modalType === 'project' && (
                                    <>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Project URL
                                            </label>
                                            <input
                                                type="url"
                                                value={form.url}
                                                onChange={e => setForm({ ...form, url: e.target.value })}
                                                placeholder="https://example.com"
                                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
                                                required
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Category
                                            </label>
                                            <select
                                                value={form.category}
                                                onChange={e => setForm({ ...form, category: e.target.value })}
                                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
                                                required
                                            >
                                                <option value="">Select a category</option>
                                                {categories?.map(cat => (
                                                    <option key={cat.id} value={cat.name}>{cat.name}</option>
                                                ))}
                                            </select>
                                        </div>
                                    </>
                                )}

                                <div className="flex gap-3 pt-4">
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setShowModal(false);
                                            resetForm();
                                        }}
                                        className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium active:scale-95 transition-transform"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        className="flex-1 px-4 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg hover:from-indigo-700 hover:to-purple-700 transition-colors font-medium active:scale-95 transition-transform"
                                    >
                                        {form.id ? 'Update' : 'Add'}
                                    </button>
                                </div>
                            </form>
                        )}
                    </div>
                </div>
            )}

            {/* Fullscreen Preview Modal */}
            {fullscreenProject && (
                <div className="fixed inset-0 bg-black z-50">
                    <div className="h-screen flex flex-col">
                        <div className="bg-gray-900 text-white p-3 md:p-4 flex justify-between items-center">
                            <div className="flex items-center gap-2 md:gap-4">
                                <h3 className="font-bold text-sm md:text-lg truncate">{fullscreenProject.title}</h3>
                                <span className="hidden md:block px-3 py-1 bg-gray-700 text-sm rounded-full">
                                    {fullscreenProject.category}
                                </span>
                            </div>
                            <div className="flex items-center gap-2 md:gap-3">
                                <button
                                    onClick={() => toggleFavorite('project', fullscreenProject.id!)}
                                    className={`px-2 md:px-3 py-1.5 rounded-lg flex items-center gap-2 active:scale-95 transition-transform ${isFavorite('project', fullscreenProject.id!) ? 'bg-red-600' : 'bg-gray-700 hover:bg-gray-600'}`}
                                >
                                    <Heart size={16} fill={isFavorite('project', fullscreenProject.id!) ? 'white' : 'none'} />
                                    <span className="hidden md:inline">{isFavorite('project', fullscreenProject.id!) ? 'Unfavorite' : 'Favorite'}</span>
                                </button>
                                <a
                                    href={fullscreenProject.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="px-2 md:px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 rounded-lg flex items-center gap-2 active:scale-95 transition-transform"
                                >
                                    <ExternalLink size={16} />
                                    <span className="hidden md:inline">Open</span>
                                </a>
                                <button
                                    onClick={() => setFullscreenProject(null)}
                                    className="p-2 hover:bg-gray-800 rounded-lg active:scale-95 transition-transform"
                                >
                                    <X size={20} />
                                </button>
                            </div>
                        </div>
                        <iframe
                            src={fullscreenProject.url}
                            className="flex-1 w-full bg-white"
                            title="Fullscreen Preview"
                            sandbox="allow-scripts allow-same-origin"
                        />
                    </div>
                </div>
            )}

            {/* CSS for animations */}
            <style jsx global>{`
                @keyframes fadeIn {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }
                .animate-fadeIn {
                    animation: fadeIn 0.2s ease-out;
                }
                
                /* Smooth scrolling */
                html {
                    scroll-behavior: smooth;
                }
                
                /* iOS safe area */
                @supports (padding: max(0px)) {
                    body {
                        padding-bottom: max(0px, env(safe-area-inset-bottom));
                    }
                }
                
                /* Improve touch responsiveness */
                * {
                    -webkit-tap-highlight-color: transparent;
                }
                
                /* Better scrolling on mobile */
                @media (max-width: 768px) {
                    body {
                        -webkit-overflow-scrolling: touch;
                    }
                }
            `}</style>
        </div>
    );
}