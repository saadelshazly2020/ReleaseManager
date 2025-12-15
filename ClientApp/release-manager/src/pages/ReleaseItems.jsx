import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
    Plus, Search, Trash2, Edit, Bug, Zap, Sparkles,
    AlertTriangle, Shield, BookOpen, Loader2, Filter
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from "@/lib/utils";
import { useLanguage } from '../Layout';

import ReleaseItemForm from '../components/releases/ReleaseItemForm';

export default function ReleaseItems() {
    const { t, isRTL } = useLanguage();

    const ITEM_TYPE_CONFIG = {
        feature: { label: t('feature'), icon: Zap, color: 'text-blue-600 bg-blue-50 border-blue-200' },
        bug_fix: { label: t('bugFix'), icon: Bug, color: 'text-rose-600 bg-rose-50 border-rose-200' },
        improvement: { label: t('improvement'), icon: Sparkles, color: 'text-emerald-600 bg-emerald-50 border-emerald-200' },
        breaking_change: { label: t('breakingChange'), icon: AlertTriangle, color: 'text-amber-600 bg-amber-50 border-amber-200' },
        security: { label: t('security'), icon: Shield, color: 'text-purple-600 bg-purple-50 border-purple-200' },
        documentation: { label: t('documentation'), icon: BookOpen, color: 'text-slate-600 bg-slate-50 border-slate-200' }
    };

    const STATUS_CONFIG = {
        pending: { label: t('pending'), color: 'bg-slate-100 text-slate-600' },
        in_progress: { label: t('inProgress'), color: 'bg-blue-100 text-blue-600' },
        completed: { label: t('completed'), color: 'bg-emerald-100 text-emerald-600' },
        cancelled: { label: t('cancelled'), color: 'bg-rose-100 text-rose-600' }
    };
    const [searchQuery, setSearchQuery] = useState('');
    const [typeFilter, setTypeFilter] = useState('all');
    const [releaseFilter, setReleaseFilter] = useState('all');
    const [showForm, setShowForm] = useState(false);
    const [editingItem, setEditingItem] = useState(null);

    const queryClient = useQueryClient();

    const { data: items = [], isLoading } = useQuery({
        queryKey: ['releaseItems'],
        queryFn: () => base44.entities.ReleaseItem.list('-created_date')
    });

    const { data: releases = [] } = useQuery({
        queryKey: ['releases'],
        queryFn: () => base44.entities.Release.list()
    });

    const createMutation = useMutation({
        mutationFn: (data) => base44.entities.ReleaseItem.create(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['releaseItems'] });
            setShowForm(false);
            setEditingItem(null);
        }
    });

    const updateMutation = useMutation({
        mutationFn: ({ id, data }) => base44.entities.ReleaseItem.update(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['releaseItems'] });
            setShowForm(false);
            setEditingItem(null);
        }
    });

    const deleteMutation = useMutation({
        mutationFn: (id) => base44.entities.ReleaseItem.delete(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['releaseItems'] });
        }
    });

    const handleSave = async (data) => {
        if (editingItem) {
            updateMutation.mutate({ id: editingItem.id, data });
        } else {
            createMutation.mutate(data);
        }
    };

    const getReleaseName = (id) => {
        const release = releases.find(r => r.id === id);
        return release ? `${release.name} (v${release.version})` : 'Unassigned';
    };

    // Filter items
    const filteredItems = items.filter(item => {
        const matchesSearch = !searchQuery ||
            item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            (item.description && item.description.toLowerCase().includes(searchQuery.toLowerCase()));
        const matchesType = typeFilter === 'all' || item.type === typeFilter;
        const matchesRelease = releaseFilter === 'all' || item.release_id === releaseFilter;
        return matchesSearch && matchesType && matchesRelease;
    });

    if (showForm) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50/30 p-6" dir={isRTL ? 'rtl' : 'ltr'}>
                <div className="max-w-7xl mx-auto">
                    <ReleaseItemForm
                        item={editingItem}
                        releaseId={releaseFilter !== 'all' ? releaseFilter : ''}
                        onSave={handleSave}
                        onCancel={() => {
                            setShowForm(false);
                            setEditingItem(null);
                        }}
                        isLoading={createMutation.isPending || updateMutation.isPending}
                        t={t}
                    />
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50/30 p-6" dir={isRTL ? 'rtl' : 'ltr'}>
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-slate-800">{t('releaseItems')}</h1>
                        <p className="text-slate-500 mt-1">{t('featuresAndBugFixes')}</p>
                    </div>
                    <Button
                        onClick={() => setShowForm(true)}
                        className="bg-indigo-600 hover:bg-indigo-700 gap-2"
                    >
                        <Plus className="w-4 h-4" />
                        {t('addItem')}
                    </Button>
                </div>

                {/* Filters */}
                <div className="flex flex-col md:flex-row gap-4 mb-6">
                    <div className="relative flex-1 max-w-md">
                        <Search className={`absolute ${isRTL ? 'right-3' : 'left-3'} top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400`} />
                        <Input
                            placeholder={t('searchItems')}
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className={isRTL ? 'pr-10' : 'pl-10'}
                        />
                    </div>
                    <div className="flex gap-3">
                        <Select value={typeFilter} onValueChange={setTypeFilter}>
                            <SelectTrigger className="w-40">
                                <Filter className={`w-4 h-4 ${isRTL ? 'ml-2' : 'mr-2'}`} />
                                <SelectValue placeholder={t('type')} />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">{t('allTypes')}</SelectItem>
                                {Object.entries(ITEM_TYPE_CONFIG).map(([value, config]) => (
                                    <SelectItem key={value} value={value}>{config.label}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        <Select value={releaseFilter} onValueChange={setReleaseFilter}>
                            <SelectTrigger className="w-48">
                                <SelectValue placeholder={t('releases')} />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">{t('allReleases')}</SelectItem>
                                {releases.map(release => (
                                    <SelectItem key={release.id} value={release.id}>
                                        {release.name} (v{release.version})
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                </div>

                {/* Items List */}
                {isLoading ? (
                    <div className="flex items-center justify-center h-64">
                        <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
                    </div>
                ) : filteredItems.length === 0 ? (
                    <div className="text-center py-16">
                        <Zap className="w-16 h-16 mx-auto text-slate-300 mb-4" />
                        <h3 className="text-lg font-medium text-slate-600">{t('noItemsFound')}</h3>
                        <p className="text-slate-400 mt-1">
                            {searchQuery || typeFilter !== 'all' || releaseFilter !== 'all'
                                ? t('tryAdjustingFilters')
                                : t('addFirstItem')}
                        </p>
                        {!searchQuery && typeFilter === 'all' && releaseFilter === 'all' && (
                            <Button
                                onClick={() => setShowForm(true)}
                                className="mt-4 bg-indigo-600 hover:bg-indigo-700"
                            >
                                <Plus className={`w-4 h-4 ${isRTL ? 'ml-2' : 'mr-2'}`} />
                                {t('addItem')}
                            </Button>
                        )}
                    </div>
                ) : (
                    <motion.div
                        className="grid gap-3"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                    >
                        <AnimatePresence>
                            {filteredItems.map((item, index) => {
                                const typeConfig = ITEM_TYPE_CONFIG[item.type] || ITEM_TYPE_CONFIG.feature;
                                const statusConfig = STATUS_CONFIG[item.status] || STATUS_CONFIG.pending;
                                const Icon = typeConfig.icon;

                                return (
                                    <motion.div
                                        key={item.id}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -20 }}
                                        transition={{ delay: index * 0.03 }}
                                    >
                                        <Card className="p-4 hover:shadow-md transition-shadow">
                                            <div className="flex items-start gap-4">
                                                <div className={cn(
                                                    "p-2 rounded-lg shrink-0",
                                                    typeConfig.color.split(' ').slice(1).join(' ')
                                                )}>
                                                    <Icon className={cn("w-5 h-5", typeConfig.color.split(' ')[0])} />
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <div className="flex items-start justify-between gap-4">
                                                        <div>
                                                            <h3 className="font-semibold text-slate-800">{item.title}</h3>
                                                            {item.description && (
                                                                <p className="text-sm text-slate-500 mt-1 line-clamp-2">
                                                                    {item.description}
                                                                </p>
                                                            )}
                                                            <div className="flex flex-wrap items-center gap-2 mt-2">
                                                                <Badge className={cn("text-xs border", typeConfig.color)}>
                                                                    {typeConfig.label}
                                                                </Badge>
                                                                <Badge className={cn("text-xs", statusConfig.color)}>
                                                                    {statusConfig.label}
                                                                </Badge>
                                                                {item.ticket_number && (
                                                                    <Badge variant="outline" className="text-xs">
                                                                        {item.ticket_number}
                                                                    </Badge>
                                                                )}
                                                                {item.release_id && (
                                                                    <span className="text-xs text-slate-400">
                                                                        {getReleaseName(item.release_id)}
                                                                    </span>
                                                                )}
                                                            </div>
                                                        </div>
                                                        <div className="flex items-center gap-1 shrink-0">
                                                            <Button
                                                                variant="ghost"
                                                                size="icon"
                                                                onClick={() => {
                                                                    setEditingItem(item);
                                                                    setShowForm(true);
                                                                }}
                                                            >
                                                                <Edit className="w-4 h-4 text-slate-400" />
                                                            </Button>
                                                            <Button
                                                                variant="ghost"
                                                                size="icon"
                                                                onClick={() => deleteMutation.mutate(item.id)}
                                                            >
                                                                <Trash2 className="w-4 h-4 text-rose-400" />
                                                            </Button>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </Card>
                                    </motion.div>
                                );
                            })}
                        </AnimatePresence>
                    </motion.div>
                )}
            </div>
        </div>
    );
}