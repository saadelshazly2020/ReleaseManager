import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import {
    Plus, Search, Users, Edit, Trash2, Loader2,
    User, Palette, Save, X
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from "@/lib/utils";
import { useLanguage } from '../Layout';

const TEAM_COLORS = [
    '#6366f1', '#8b5cf6', '#a855f7', '#d946ef', '#ec4899',
    '#f43f5e', '#ef4444', '#f97316', '#f59e0b', '#eab308',
    '#84cc16', '#22c55e', '#10b981', '#14b8a6', '#06b6d4'
];

export default function Teams() {
    const { t, isRTL } = useLanguage();
    const [searchQuery, setSearchQuery] = useState('');
    const [showDialog, setShowDialog] = useState(false);
    const [editingTeam, setEditingTeam] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        lead: '',
        members_count: 1,
        color: TEAM_COLORS[0]
    });

    const queryClient = useQueryClient();

    const { data: teams = [], isLoading } = useQuery({
        queryKey: ['teams'],
        queryFn: () => base44.entities.Team.list('-created_date')
    });

    const { data: releases = [] } = useQuery({
        queryKey: ['releases'],
        queryFn: () => base44.entities.Release.list()
    });

    const createMutation = useMutation({
        mutationFn: (data) => base44.entities.Team.create(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['teams'] });
            handleCloseDialog();
        }
    });

    const updateMutation = useMutation({
        mutationFn: ({ id, data }) => base44.entities.Team.update(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['teams'] });
            handleCloseDialog();
        }
    });

    const deleteMutation = useMutation({
        mutationFn: (id) => base44.entities.Team.delete(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['teams'] });
        }
    });

    const handleOpenDialog = (team = null) => {
        if (team) {
            setEditingTeam(team);
            setFormData({
                name: team.name || '',
                description: team.description || '',
                lead: team.lead || '',
                members_count: team.members_count || 1,
                color: team.color || TEAM_COLORS[0]
            });
        } else {
            setEditingTeam(null);
            setFormData({
                name: '',
                description: '',
                lead: '',
                members_count: 1,
                color: TEAM_COLORS[Math.floor(Math.random() * TEAM_COLORS.length)]
            });
        }
        setShowDialog(true);
    };

    const handleCloseDialog = () => {
        setShowDialog(false);
        setEditingTeam(null);
        setFormData({ name: '', description: '', lead: '', members_count: 1, color: TEAM_COLORS[0] });
    };

    const handleSave = () => {
        if (editingTeam) {
            updateMutation.mutate({ id: editingTeam.id, data: formData });
        } else {
            createMutation.mutate(formData);
        }
    };

    const getTeamReleases = (teamId) => {
        return releases.filter(r => r.team_id === teamId);
    };

    const filteredTeams = teams.filter(team =>
        !searchQuery || team.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50/30 p-6" dir={isRTL ? 'rtl' : 'ltr'}>
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-slate-800">{t('teams')}</h1>
                        <p className="text-slate-500 mt-1">{t('manageTeams')}</p>
                    </div>
                    <Button
                        onClick={() => handleOpenDialog()}
                        className="bg-indigo-600 hover:bg-indigo-700 gap-2"
                    >
                        <Plus className="w-4 h-4" />
                        {t('newTeam')}
                    </Button>
                </div>

                {/* Search */}
                <div className="relative max-w-md mb-6">
                    <Search className={`absolute ${isRTL ? 'right-3' : 'left-3'} top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400`} />
                    <Input
                        placeholder={t('searchTeams')}
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className={isRTL ? 'pr-10' : 'pl-10'}
                    />
                </div>

                {/* Teams Grid */}
                {isLoading ? (
                    <div className="flex items-center justify-center h-64">
                        <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
                    </div>
                ) : filteredTeams.length === 0 ? (
                    <div className="text-center py-16">
                        <Users className="w-16 h-16 mx-auto text-slate-300 mb-4" />
                        <h3 className="text-lg font-medium text-slate-600">{t('noTeamsFound')}</h3>
                        <p className="text-slate-400 mt-1">{t('createFirstTeam')}</p>
                        <Button
                            onClick={() => handleOpenDialog()}
                            className="mt-4 bg-indigo-600 hover:bg-indigo-700"
                        >
                            <Plus className={`w-4 h-4 ${isRTL ? 'ml-2' : 'mr-2'}`} />
                            {t('createTeam')}
                        </Button>
                    </div>
                ) : (
                    <motion.div
                        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                    >
                        <AnimatePresence>
                            {filteredTeams.map((team, index) => {
                                const teamReleases = getTeamReleases(team.id);
                                const activeReleases = teamReleases.filter(r =>
                                    !['deployed', 'cancelled'].includes(r.status)
                                );

                                return (
                                    <motion.div
                                        key={team.id}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, scale: 0.95 }}
                                        transition={{ delay: index * 0.05 }}
                                    >
                                        <Card className="overflow-hidden hover:shadow-lg transition-shadow">
                                            <div
                                                className="h-2"
                                                style={{ backgroundColor: team.color || '#6366f1' }}
                                            />
                                            <CardHeader className="pb-3">
                                                <div className="flex items-start justify-between">
                                                    <div className="flex items-center gap-3">
                                                        <div
                                                            className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold"
                                                            style={{ backgroundColor: team.color || '#6366f1' }}
                                                        >
                                                            {team.name.charAt(0).toUpperCase()}
                                                        </div>
                                                        <div>
                                                            <CardTitle className="text-lg">{team.name}</CardTitle>
                                                            {team.lead && (
                                                                <p className="text-sm text-slate-500 flex items-center gap-1 mt-1">
                                                                    <User className="w-3 h-3" />
                                                                    {team.lead}
                                                                </p>
                                                            )}
                                                        </div>
                                                    </div>
                                                    <div className="flex gap-1">
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            onClick={() => handleOpenDialog(team)}
                                                        >
                                                            <Edit className="w-4 h-4 text-slate-400" />
                                                        </Button>
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            onClick={() => deleteMutation.mutate(team.id)}
                                                        >
                                                            <Trash2 className="w-4 h-4 text-rose-400" />
                                                        </Button>
                                                    </div>
                                                </div>
                                            </CardHeader>
                                            <CardContent>
                                                {team.description && (
                                                    <p className="text-sm text-slate-500 mb-4 line-clamp-2">
                                                        {team.description}
                                                    </p>
                                                )}
                                                <div className="flex items-center justify-between text-sm">
                                                    <div className="flex items-center gap-1 text-slate-500">
                                                        <Users className="w-4 h-4" />
                                                        <span>{team.members_count || 0} {t('members')}</span>
                                                    </div>
                                                    <div className="text-slate-500">
                                                        {activeReleases.length} {t('activeReleases')}
                                                    </div>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    </motion.div>
                                );
                            })}
                        </AnimatePresence>
                    </motion.div>
                )}

                {/* Dialog */}
                <Dialog open={showDialog} onOpenChange={setShowDialog}>
                    <DialogContent className="sm:max-w-md">
                        <DialogHeader>
                            <DialogTitle>
                                {editingTeam ? t('editTeam') : t('createNewTeam')}
                            </DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4 py-4">
                            <div className="space-y-2">
                                <Label htmlFor="name">{t('teamName')} *</Label>
                                <Input
                                    id="name"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    placeholder="e.g., Frontend Team"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="description">{t('description')}</Label>
                                <Textarea
                                    id="description"
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    placeholder="Team description..."
                                    rows={2}
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="lead">{t('teamLead')}</Label>
                                    <Input
                                        id="lead"
                                        value={formData.lead}
                                        onChange={(e) => setFormData({ ...formData, lead: e.target.value })}
                                        placeholder="e.g., John Doe"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="members">{t('membersCount')}</Label>
                                    <Input
                                        id="members"
                                        type="number"
                                        min="1"
                                        value={formData.members_count}
                                        onChange={(e) => setFormData({ ...formData, members_count: parseInt(e.target.value) || 1 })}
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label>{t('teamColor')}</Label>
                                <div className="flex flex-wrap gap-2">
                                    {TEAM_COLORS.map(color => (
                                        <button
                                            key={color}
                                            type="button"
                                            className={cn(
                                                "w-8 h-8 rounded-full transition-transform hover:scale-110",
                                                formData.color === color && "ring-2 ring-offset-2 ring-slate-400"
                                            )}
                                            style={{ backgroundColor: color }}
                                            onClick={() => setFormData({ ...formData, color })}
                                        />
                                    ))}
                                </div>
                            </div>
                        </div>
                        <div className="flex justify-end gap-3">
                            <Button variant="outline" onClick={handleCloseDialog}>
                                {t('cancel')}
                            </Button>
                            <Button
                                onClick={handleSave}
                                disabled={!formData.name || createMutation.isPending || updateMutation.isPending}
                                className="bg-indigo-600 hover:bg-indigo-700"
                            >
                                {(createMutation.isPending || updateMutation.isPending) ? (
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                ) : (
                                    <>
                                        <Save className={`w-4 h-4 ${isRTL ? 'ml-2' : 'mr-2'}`} />
                                        {editingTeam ? t('update') : t('createTeam')}
                                    </>
                                )}
                            </Button>
                        </div>
                    </DialogContent>
                </Dialog>
            </div>
        </div>
    );
}