import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';
import { Button } from "@/components/ui/button";
import {
    Package, Rocket, Clock, CheckCircle, AlertTriangle,
    Plus, RefreshCw, TrendingUp
} from 'lucide-react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { useLanguage } from '../Layout';

import StatsCard from '../components/dashboard/StatsCard';
import StatusChart from '../components/dashboard/StatusChart';
import TimelineView from '../components/dashboard/TimelineView';
import TeamWorkload from '../components/dashboard/TeamWorkload';
import ReleaseDetails from '../components/releases/ReleaseDetails';

export default function Dashboard() {
    const { t, isRTL } = useLanguage();
    const [selectedRelease, setSelectedRelease] = useState(null);
    const [generatedNotes, setGeneratedNotes] = useState('');
    const [isGenerating, setIsGenerating] = useState(false);

    const { data: releases = [], isLoading: releasesLoading, refetch: refetchReleases } = useQuery({
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

    // Calculate metrics
    const inProgressCount = releases.filter(r => r.status === 'in_progress').length;
    const readyCount = releases.filter(r => r.status === 'ready_for_deployment').length;
    const deployedCount = releases.filter(r => r.status === 'deployed').length;
    const planningCount = releases.filter(r => r.status === 'planning').length;

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
        refetchReleases();
        setSelectedRelease(null);
        setGeneratedNotes('');
    };

    const getProject = (id) => projects.find(p => p.id === id);
    const getTeam = (id) => teams.find(t => t.id === id);

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50/30 p-6" dir={isRTL ? 'rtl' : 'ltr'}>
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-slate-800">{t('releaseDashboard')}</h1>
                        <p className="text-slate-500 mt-1">{t('monitorReleases')}</p>
                    </div>
                    <div className="flex items-center gap-3">
                        <Button
                            variant="outline"
                            onClick={() => refetchReleases()}
                            className="gap-2"
                        >
                            <RefreshCw className="w-4 h-4" />
                            {t('refresh')}
                        </Button>
                        <Link to={createPageUrl('Releases')}>
                            <Button className="bg-indigo-600 hover:bg-indigo-700 gap-2">
                                <Plus className="w-4 h-4" />
                                {t('newRelease')}
                            </Button>
                        </Link>
                    </div>
                </div>

                {/* Stats Cards */}
                <motion.div
                    className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                >
                    <StatsCard
                        title={t('inProgress')}
                        value={inProgressCount}
                        icon={Clock}
                        color="#3b82f6"
                        trend={12}
                    />
                    <StatsCard
                        title={t('readyForDeploy')}
                        value={readyCount}
                        icon={Rocket}
                        color="#8b5cf6"
                    />
                    <StatsCard
                        title={t('deployed')}
                        value={deployedCount}
                        icon={CheckCircle}
                        color="#10b981"
                        trend={8}
                    />
                    <StatsCard
                        title={t('planning')}
                        value={planningCount}
                        icon={Package}
                        color="#f59e0b"
                    />
                </motion.div>

                {/* Charts Row */}
                <motion.div
                    className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: 0.1 }}
                >
                    <StatusChart releases={releases} />
                    <TeamWorkload releases={releases} teams={teams} />
                </motion.div>

                {/* Timeline */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: 0.2 }}
                >
                    <TimelineView
                        releases={releases}
                        projects={projects}
                        onSelectRelease={setSelectedRelease}
                    />
                </motion.div>

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
                                    window.location.href = createPageUrl(`Releases?edit=${selectedRelease.id}`);
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