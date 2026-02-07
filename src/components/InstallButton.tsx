'use client';

import { useState, useEffect } from 'react';
import { Download, X, Smartphone, Info } from 'lucide-react';

export default function InstallButton() {
    const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
    const [isInstallable, setIsInstallable] = useState(false);
    const [showInstallGuide, setShowInstallGuide] = useState(false);
    const [isInstalled, setIsInstalled] = useState(false);

    useEffect(() => {
        // Check if app is already installed
        const isStandalone = window.matchMedia('(display-mode: standalone)').matches;
        setIsInstalled(isStandalone);

        const handleBeforeInstallPrompt = (e: Event) => {
            e.preventDefault();
            setDeferredPrompt(e);
            setIsInstallable(true);
        };

        // Handle app installed event
        const handleAppInstalled = () => {
            setIsInstallable(false);
            setDeferredPrompt(null);
            setIsInstalled(true);
        };

        window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
        window.addEventListener('appinstalled', handleAppInstalled);

        // Check on load
        const checkInstallable = () => {
            // Check if browser supports PWA
            const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
            const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);

            if (isIOS && isSafari) {
                setIsInstallable(true); // Show install guide for iOS
            }
        };

        checkInstallable();

        return () => {
            window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
            window.removeEventListener('appinstalled', handleAppInstalled);
        };
    }, []);

    const handleInstallClick = async () => {
        if (deferredPrompt) {
            // Standard PWA installation
            deferredPrompt.prompt();
            const { outcome } = await deferredPrompt.userChoice;

            if (outcome === 'accepted') {
                setDeferredPrompt(null);
                setIsInstallable(false);
                setIsInstalled(true);
            }
        } else {
            // Show manual installation guide
            setShowInstallGuide(true);
        }
    };

    // Don't show if already installed
    if (isInstalled) return null;

    // Show floating button only on desktop when sidebar is collapsed
    return (
        <>
            {/* Floating Install Button (for desktop when sidebar is collapsed) */}
            {isInstallable && (
                <button
                    onClick={handleInstallClick}
                    className="fixed bottom-6 right-6 flex items-center gap-2 px-4 py-3 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-full shadow-lg hover:shadow-xl transition-all hover:scale-105 z-50 group"
                >
                    <Download size={20} />
                    <span className="font-medium">Install App</span>
                    <div className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full text-xs flex items-center justify-center animate-pulse">
                        !
                    </div>
                </button>
            )}

            {/* Installation Guide Modal */}
            {showInstallGuide && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-[60]">
                    <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-xl font-bold text-gray-900">Install SmartKode</h2>
                            <button
                                onClick={() => setShowInstallGuide(false)}
                                className="p-1 hover:bg-gray-100 rounded-lg"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        <div className="space-y-4">
                            <div className="bg-blue-50 p-4 rounded-lg">
                                <div className="flex items-center gap-3 mb-2">
                                    <Smartphone className="text-blue-600" size={24} />
                                    <h3 className="font-semibold text-blue-800">Install as App</h3>
                                </div>
                                <p className="text-sm text-blue-700">
                                    Get native app experience with offline access and faster loading.
                                </p>
                            </div>

                            <div className="space-y-3">
                                <h4 className="font-medium text-gray-800">For Chrome/Edge/Android:</h4>
                                <ol className="space-y-2 text-sm text-gray-600">
                                    <li className="flex items-start gap-2">
                                        <span className="bg-gray-100 px-2 py-0.5 rounded">1</span>
                                        Click <span className="font-medium">⋮</span> (Menu) in top-right
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <span className="bg-gray-100 px-2 py-0.5 rounded">2</span>
                                        Select <span className="font-medium">"Install SmartKode"</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <span className="bg-gray-100 px-2 py-0.5 rounded">3</span>
                                        Click <span className="font-medium">"Install"</span>
                                    </li>
                                </ol>

                                <h4 className="font-medium text-gray-800 mt-4">For Safari (iPhone/iPad):</h4>
                                <ol className="space-y-2 text-sm text-gray-600">
                                    <li className="flex items-start gap-2">
                                        <span className="bg-gray-100 px-2 py-0.5 rounded">1</span>
                                        Tap <span className="font-medium">Share</span> button <span className="text-lg">⎙</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <span className="bg-gray-100 px-2 py-0.5 rounded">2</span>
                                        Scroll down and tap <span className="font-medium">"Add to Home Screen"</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <span className="bg-gray-100 px-2 py-0.5 rounded">3</span>
                                        Tap <span className="font-medium">"Add"</span>
                                    </li>
                                </ol>
                            </div>

                            <div className="bg-gray-50 p-3 rounded-lg mt-4">
                                <div className="flex items-center gap-2">
                                    <Info size={16} className="text-gray-500" />
                                    <p className="text-xs text-gray-600">
                                        Once installed, the app works offline and loads instantly.
                                    </p>
                                </div>
                            </div>

                            <div className="flex gap-3 pt-4">
                                <button
                                    onClick={() => setShowInstallGuide(false)}
                                    className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                                >
                                    Maybe Later
                                </button>
                                <button
                                    onClick={() => {
                                        // Try to trigger installation again
                                        if (deferredPrompt) {
                                            deferredPrompt.prompt();
                                        }
                                        setShowInstallGuide(false);
                                    }}
                                    className="flex-1 px-4 py-2 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-lg hover:from-emerald-600 hover:to-teal-600 transition-colors font-medium"
                                >
                                    Try Again
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}