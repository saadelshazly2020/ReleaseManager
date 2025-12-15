import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
    Plus, Search, Filter, Package, Rocket, Clock,
    CheckCircle, XCircle, AlertTriangle, Loader2, List, Grid
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '../Layout';

import ReleaseCard from '../components/releases/ReleaseCard';
import ReleaseForm from '../components/releases/ReleaseForm';
import ReleaseDetails from '../components/releases/ReleaseDetails';

export default function Releases() {
    const { t, isRTL } = useLanguage();

    const STATUS_TABS = [
        { value: 'all', label: t('all'), icon: Package },
        { value: 'in_progress', label: t('inProgress'), icon: Clock },
        { value: 'ready_for_deployment', label: t('readyForDeploy'), icon: Rocket },
        { value: 'deployed', label: t('deployed'), icon: CheckCircle },
        { value: 'cancelled', label: t('cancelled'), icon: XCircle }
    ];
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [showForm, setShowForm] = useState(false);
    const [editingRelease, setEditingRelease] = useState(null);
    const [selectedRelease, setSelectedRelease] = useState(null);
    const [generatedNotes, setGeneratedNotes] = useState('');
    const [isGenerating, setIsGenerating] = useState(false);

    const queryClient = useQueryClient();

    // Check URL for edit param
    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        const editId = urlParams.get('edit');
        if (editId) {
            base44.entities.Release.filter({ id: editId }).then(releases => {
                if (releases.length > 0) {
                    setEditingRelease(releases[0]);
                    setShowForm(true);
                }
            });
        }
    }, []);

    const { data: releases = [], isLoading } = useQuery({
        queryKey: ['releases'],
        queryFn: () => base44.entities.Release.list('-created_date')
    });

    const { data: teams = [] } = useQuery({
        queryKey: ['teams'],
        queryFn: () => base44.entities.Team.list()
    });

    const { data: projects = [] } = useQuery({
        queryKey: ['projects'],
        queryFn: () => base44.entities.Project.list()
    });

    const { data: releaseItems = [] } = useQuery({
        queryKey: ['releaseItems', selectedRelease?.id],
        queryFn: () => selectedRelease
            ? base44.entities.ReleaseItem.filter({ release_id: selectedRelease.id })
            : [],
        enabled: !!selectedRelease
    });

    const createMutation = useMutation({
        mutationFn: (data) => base44.entities.Release.create(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['releases'] });
            setShowForm(false);
            setEditingRelease(null);
        }
    });

    const updateMutation = useMutation({
        mutationFn: ({ id, data }) => base44.entities.Release.update(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['releases'] });
            setShowForm(false);
            setEditingRelease(null);
        }
    });

    const handleSave = async (data) => {
        if (editingRelease) {
            updateMutation.mutate({ id: editingRelease.id, data });
        } else {
            createMutation.mutate(data);
        }
    };

    const handleGenerateNotes = async () => {
        if (!selectedRelease || releaseItems.length === 0) return;

        setIsGenerating(true);
        const itemsSummary = releaseItems.map(item =>
            `- [${item.type.toUpperCase()}] ${item.title}: ${item.description || 'No description'}`
        ).join('\n');

        const response = await base44.integrations.Core.InvokeLLM({
            prompt: `Generate professional release notes for version ${selectedRelease.version} of "${selectedRelease.name}".
      
Release Description: ${selectedRelease.description || 'N/A'}

Items included in this release:
${itemsSummary}

Please create well-formatted release notes that:
1. Start with a brief overview
2. Group changes by type (Features, Bug Fixes, Improvements, etc.)
3. Highlight key updates and new functionalities
4. Mention any breaking changes prominently
5. Use markdown formatting`,
        });

        setGeneratedNotes(response);
        setIsGenerating(false);
    };

    const handleSaveNotes = async (notes) => {
        if (!selectedRelease) return;
        await base44.entities.Release.update(selectedRelease.id, { release_notes: notes });
        queryClient.invalidateQueries({ queryKey: ['releases'] });
        setSelectedRelease(null);
        setGeneratedNotes('');
    };

    const getProject = (id) => projects.find(p => p.id === id);
    const getTeam = (id) => teams.find(t => t.id === id);

    // Filter releases
    const filteredReleases = releases.filter(release => {
        const matchesSearch = !searchQuery ||
            release.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            release.version.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesStatus = statusFilter === 'all' || release.status === statusFilter;
        return matchesSearch && matchesStatus;
    });

    if (showForm) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50/30 p-6" dir={isRTL ? 'rtl' : 'ltr'}>
                <div className="max-w-7xl mx-auto">
                    <ReleaseForm
                        release={editingRelease}
                        projects={projects}
                        teams={teams}
                        onSave={handleSave}
                        onCancel={() => {
                            setShowForm(false);
                            setEditingRelease(null);
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
                        <h1 className="text-3xl font-bold text-slate-800">{t('releases')}</h1>
                        <p className="text-slate-500 mt-1">{t('manageReleases')}</p>
                    </div>
                    <Button
                        onClick={() => setShowForm(true)}
                        className="bg-indigo-600 hover:bg-indigo-700 gap-2"
                    >
                        <Plus className="w-4 h-4" />
                        {t('newRelease')}
                    </Button>
                </div>

                {/* Filters */}
                <div className="flex flex-col md:flex-row gap-4 mb-6">
                    <div className="relative flex-1 max-w-md">
                        <Search className={`absolute ${isRTL ? 'right-3' : 'left-3'} top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400`} />
                        <Input
                            placeholder={t('searchReleases')}
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className={isRTL ? 'pr-10' : 'pl-10'}
                        />
                    </div>
                    <Tabs value={statusFilter} onValueChange={setStatusFilter}>
                        <TabsList>
                            {STATUS_TABS.map(tab => (
                                <TabsTrigger key={tab.value} value={tab.value} className="gap-2">
                                    <tab.icon className="w-4 h-4" />
                                    <span className="hidden sm:inline">{tab.label}</span>
                                </TabsTrigger>
                            ))}
                        </TabsList>
                    </Tabs>
                </div>

                {/* Release List */}
                {isLoading ? (
                    <div className="flex items-center justify-center h-64">
                        <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
                    </div>
                ) : filteredReleases.length === 0 ? (
                    <div className="text-center py-16">
                        <Package className="w-16 h-16 mx-auto text-slate-300 mb-4" />
                        <h3 className="text-lg font-medium text-slate-600">{t('noReleasesFound')}</h3>
                        <p className="text-slate-400 mt-1">
                            {searchQuery || statusFilter !== 'all'
                                ? t('tryAdjustingFilters')
                                : t('createFirstRelease')}
                        </p>
                        {!searchQuery && statusFilter === 'all' && (
                            <Button
                                onClick={() => setShowForm(true)}
                                className="mt-4 bg-indigo-600 hover:bg-indigo-700"
                            >
                                <Plus className={`w-4 h-4 ${isRTL ? 'ml-2' : 'mr-2'}`} />
                                {t('createRelease')}
                            </Button>
                        )}
                    </div>
                ) : (
                    <motion.div
                        className="grid gap-4"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                    >
                        <AnimatePresence>
                            {filteredReleases.map((release, index) => (
                                <motion.div
                                    key={release.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -20 }}
                                    transition={{ delay: index * 0.05 }}
                                >
                                    <ReleaseCard
                                        release={release}
                                        project={getProject(release.project_id)}
                                        team={getTeam(release.team_id)}
                                        onClick={() => setSelectedRelease(release)}
                                    />
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </motion.div>
                )}

                {/* Release Details Modal */}
                {selectedRelease && (
                    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="w-full max-w-3xl"
                        >
                            <ReleaseDetails
                                release={selectedRelease}
                                project={getProject(selectedRelease.project_id)}
                                team={getTeam(selectedRelease.team_id)}
                                releaseItems={releaseItems}
                                onClose={() => {
                                    setSelectedRelease(null);
                                    setGeneratedNotes('');
                                }}
                                onEdit={() => {
                                    setEditingRelease(selectedRelease);
                                    setSelectedRelease(null);
                                    setShowForm(true);
                                }}
                                onGenerateNotes={handleGenerateNotes}
                                isGenerating={isGenerating}
                                generatedNotes={generatedNotes}
                                onSaveNotes={handleSaveNotes}
                            />
                        </motion.div>
                    </div>
                )}
            </div>
        </div>
    );
}