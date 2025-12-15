import React, { useState, useEffect, createContext, useContext } from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { cn } from "@/lib/utils";
import {
    LayoutDashboard, Package, FolderOpen, Users,
    FileText, Menu, X, ChevronRight, ChevronLeft, Rocket
} from 'lucide-react';
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from 'framer-motion';
import LanguageSwitcher from './components/LanguageSwitcher';
import { translations } from './components/translations';

// Language Context
export const LanguageContext = createContext({ lang: 'en', setLang: () => { }, t: (key) => key });

export const useLanguage = () => useContext(LanguageContext);

export default function Layout({ children, currentPageName }) {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [lang, setLang] = useState(() => localStorage.getItem('app_lang') || 'en');

    useEffect(() => {
        localStorage.setItem('app_lang', lang);
        document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
        document.documentElement.lang = lang;
    }, [lang]);

    const t = (key) => translations[lang]?.[key] || translations.en[key] || key;
    const isRTL = lang === 'ar';

    const NAV_ITEMS = [
        { name: t('dashboard'), icon: LayoutDashboard, page: 'Dashboard' },
        { name: t('releases'), icon: Package, page: 'Releases' },
        { name: t('releaseItems'), icon: FileText, page: 'ReleaseItems' },
        { name: t('projects'), icon: FolderOpen, page: 'Projects' },
        { name: t('teams'), icon: Users, page: 'Teams' }
    ];

    return (
        <LanguageContext.Provider value={{ lang, setLang, t, isRTL }}>
            <div className={cn("min-h-screen bg-slate-50", isRTL && "font-arabic")}>
                <style>{`
          @import url('https://fonts.googleapis.com/css2?family=Tajawal:wght@400;500;700&display=swap');
          .font-arabic { font-family: 'Tajawal', sans-serif; }
        `}</style>

                {/* Mobile Header */}
                <header className="lg:hidden fixed top-0 left-0 right-0 h-16 bg-white border-b border-slate-200 z-40 flex items-center px-4">
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setSidebarOpen(true)}
                    >
                        <Menu className="w-6 h-6" />
                    </Button>
                    <div className={cn("flex items-center gap-2", isRTL ? "mr-3" : "ml-3")}>
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center">
                            <Rocket className="w-5 h-5 text-white" />
                        </div>
                        <span className="font-bold text-slate-800">{t('releaseManager')}</span>
                    </div>
                    <div className={cn("flex-1 flex justify-end", isRTL && "flex-row-reverse")}>
                        <LanguageSwitcher currentLang={lang} onLanguageChange={setLang} />
                    </div>
                </header>

                {/* Mobile Sidebar Overlay */}
                <AnimatePresence>
                    {sidebarOpen && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="lg:hidden fixed inset-0 bg-black/50 z-40"
                            onClick={() => setSidebarOpen(false)}
                        />
                    )}
                </AnimatePresence>

                {/* Sidebar */}
                <aside className={cn(
                    "fixed top-0 h-full w-64 bg-white border-slate-200 z-50 transition-transform duration-300",
                    isRTL ? "right-0 border-l" : "left-0 border-r",
                    "lg:translate-x-0",
                    sidebarOpen ? "translate-x-0" : (isRTL ? "translate-x-full" : "-translate-x-full")
                )}>
                    <div className="p-6 border-b border-slate-100">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-200">
                                    <Rocket className="w-6 h-6 text-white" />
                                </div>
                                <div>
                                    <h1 className="font-bold text-slate-800">{t('releaseManager')}</h1>
                                    <p className="text-xs text-slate-400">v1.0.0</p>
                                </div>
                            </div>
                            <Button
                                variant="ghost"
                                size="icon"
                                className="lg:hidden"
                                onClick={() => setSidebarOpen(false)}
                            >
                                <X className="w-5 h-5" />
                            </Button>
                        </div>
                    </div>

                    <div className="p-4 border-b border-slate-100">
                        <LanguageSwitcher currentLang={lang} onLanguageChange={setLang} />
                    </div>

                    <nav className="p-4 space-y-1">
                        {NAV_ITEMS.map((item) => {
                            const isActive = currentPageName === item.page;
                            return (
                                <Link
                                    key={item.page}
                                    to={createPageUrl(item.page)}
                                    onClick={() => setSidebarOpen(false)}
                                    className={cn(
                                        "flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200",
                                        isActive
                                            ? "bg-indigo-50 text-indigo-600"
                                            : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                                    )}
                                >
                                    <item.icon className={cn(
                                        "w-5 h-5",
                                        isActive ? "text-indigo-600" : "text-slate-400"
                                    )} />
                                    <span className="font-medium">{item.name}</span>
                                    {isActive && (
                                        isRTL ?
                                            <ChevronLeft className="w-4 h-4 mr-auto text-indigo-400" /> :
                                            <ChevronRight className="w-4 h-4 ml-auto text-indigo-400" />
                                    )}
                                </Link>
                            );
                        })}
                    </nav>

                    <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-slate-100">
                        <div className="p-4 rounded-xl bg-gradient-to-br from-indigo-50 to-purple-50">
                            <p className="text-sm font-medium text-slate-700">{t('needHelp')}</p>
                            <p className="text-xs text-slate-500 mt-1">{t('checkDocs')}</p>
                        </div>
                    </div>
                </aside>

                {/* Main Content */}
                <main className={cn(
                    "min-h-screen transition-all duration-300",
                    isRTL ? "lg:mr-64" : "lg:ml-64",
                    "pt-16 lg:pt-0"
                )}>
                    {children}
                </main>
            </div>
        </LanguageContext.Provider>
    );
}