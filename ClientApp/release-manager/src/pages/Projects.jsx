import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
    Plus, Search, FolderOpen, Edit, Trash2, Loader2,
    Users, Save, Code
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from "@/lib/utils";
import { useLanguage } from '../Layout';

export default function Projects() {
    const { t, isRTL } = useLanguage();

    const STATUS_CONFIG = {
        active: { label: t('active'), color: 'bg-emerald-100 text-emerald-700' },
        on_hold: { label: t('onHold'), color: 'bg-amber-100 text-amber-700' },
        completed: { label: t('completed'), color: 'bg-blue-100 text-blue-700' },
        archived: { label: t('archived'), color: 'bg-slate-100 text-slate-700' }
    };
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [showDialog, setShowDialog] = useState(false);
    const [editingProject, setEditingProject] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        code: '',
        status: 'active',
        team_id: ''
    });

    const queryClient = useQueryClient();

    const { data: projects = [], isLoading } = useQuery({
        queryKey: ['projects'],
        queryFn: () => base44.entities.Project.list('-created_date')
    });

    const { data: teams = [] } = useQuery({
        queryKey: ['teams'],
        queryFn: () => base44.entities.Team.list()
    });

    const { data: releases = [] } = useQuery({
        queryKey: ['releases'],
        queryFn: () => base44.entities.Release.list()
    });

    const createMutation = useMutation({
        mutationFn: (data) => base44.entities.Project.create(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['projects'] });
            handleCloseDialog();
        }
    });

    const updateMutation = useMutation({
        mutationFn: ({ id, data }) => base44.entities.Project.update(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['projects'] });
            handleCloseDialog();
        }
    });

    const deleteMutation = useMutation({
        mutationFn: (id) => base44.entities.Project.delete(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['projects'] });
        }
    });

    const handleOpenDialog = (project = null) => {
        if (project) {
            setEditingProject(project);
            setFormData({
                name: project.name || '',
                description: project.description || '',
                code: project.code || '',
                status: project.status || 'active',
                team_id: project.team_id || ''
            });
        } else {
            setEditingProject(null);
            setFormData({ name: '', description: '', code: '', status: 'active', team_id: '' });
        }
        setShowDialog(true);
    };

    const handleCloseDialog = () => {
        setShowDialog(false);
        setEditingProject(null);
        setFormData({ name: '', description: '', code: '', status: 'active', team_id: '' });
    };

    const handleSave = () => {
        if (editingProject) {
            updateMutation.mutate({ id: editingProject.id, data: formData });
        } else {
            createMutation.mutate(formData);
        }
    };

    const getTeamName = (teamId) => {
        const team = teams.find(t => t.id === teamId);
        return team?.name;
    };

    const getProjectReleases = (projectId) => {
        return releases.filter(r => r.project_id === projectId);
    };

    const filteredProjects = projects.filter(project => {
        const matchesSearch = !searchQuery ||
            project.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            (project.code && project.code.toLowerCase().includes(searchQuery.toLowerCase()));
        const matchesStatus = statusFilter === 'all' || project.status === statusFilter;
        return matchesSearch && matchesStatus;
    });

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50/30 p-6" dir={isRTL ? 'rtl' : 'ltr'}>
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-slate-800">{t('projects')}</h1>
                        <p className="text-slate-500 mt-1">{t('manageProjects')}</p>
                    </div>
                    <Button
                        onClick={() => handleOpenDialog()}
                        className="bg-indigo-600 hover:bg-indigo-700 gap-2"
                    >
                        <Plus className="w-4 h-4" />
                        {t('newProject')}
                    </Button>
                </div>

                {/* Filters */}
                <div className="flex flex-col md:flex-row gap-4 mb-6">
                    <div className="relative flex-1 max-w-md">
                        <Search className={`absolute ${isRTL ? 'right-3' : 'left-3'} top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400`} />
                        <Input
                            placeholder={t('searchProjects')}
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className={isRTL ? 'pr-10' : 'pl-10'}
                        />
                    </div>
                    <Select value={statusFilter} onValueChange={setStatusFilter}>
                        <SelectTrigger className="w-40">
                            <SelectValue placeholder={t('status')} />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">{t('allStatus')}</SelectItem>
                            {Object.entries(STATUS_CONFIG).map(([value, config]) => (
                                <SelectItem key={value} value={value}>{config.label}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                {/* Projects Grid */}
                {isLoading ? (
                    <div className="flex items-center justify-center h-64">
                        <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
                    </div>
                ) : filteredProjects.length === 0 ? (
                    <div className="text-center py-16">
                        <FolderOpen className="w-16 h-16 mx-auto text-slate-300 mb-4" />
                        <h3 className="text-lg font-medium text-slate-600">{t('noProjectsFound')}</h3>
                        <p className="text-slate-400 mt-1">{t('createFirstProject')}</p>
                        <Button
                            onClick={() => handleOpenDialog()}
                            className="mt-4 bg-indigo-600 hover:bg-indigo-700"
                        >
                            <Plus className={`w-4 h-4 ${isRTL ? 'ml-2' : 'mr-2'}`} />
                            {t('createProject')}
                        </Button>
                    </div>
                ) : (
                    <motion.div
                        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                    >
                        <AnimatePresence>
                            {filteredProjects.map((project, index) => {
                                const statusConfig = STATUS_CONFIG[project.status] || STATUS_CONFIG.active;
                                const teamName = getTeamName(project.team_id);
                                const projectReleases = getProjectReleases(project.id);

                                return (
                                    <motion.div
                                        key={project.id}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, scale: 0.95 }}
                                        transition={{ delay: index * 0.05 }}
                                    >
                                        <Card className="hover:shadow-lg transition-shadow">
                                            <CardHeader className="pb-3">
                                                <div className="flex items-start justify-between">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-10 h-10 rounded-lg bg-indigo-100 flex items-center justify-center">
                                                            <FolderOpen className="w-5 h-5 text-indigo-600" />
                                                        </div>
                                                        <div>
                                                            <CardTitle className="text-lg">{project.name}</CardTitle>
                                                            {project.code && (
                                                                <p className="text-sm text-slate-500 flex items-center gap-1 mt-0.5">
                                                                    <Code className="w-3 h-3" />
                                                                    {project.code}
                                                                </p>
                                                            )}
                                                        </div>
                                                    </div>
                                                    <div className="flex gap-1">
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            onClick={() => handleOpenDialog(project)}
                                                        >
                                                            <Edit className="w-4 h-4 text-slate-400" />
                                                        </Button>
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            onClick={() => deleteMutation.mutate(project.id)}
                                                        >
                                                            <Trash2 className="w-4 h-4 text-rose-400" />
                                                        </Button>
                                                    </div>
                                                </div>
                                            </CardHeader>
                                            <CardContent>
                                                {project.description && (
                                                    <p className="text-sm text-slate-500 mb-4 line-clamp-2">
                                                        {project.description}
                                                    </p>
                                                )}
                                                <div className="flex items-center justify-between">
                                                    <Badge className={cn("text-xs", statusConfig.color)}>
                                                        {statusConfig.label}
                                                    </Badge>
                                                    <div className="flex items-center gap-3 text-sm text-slate-500">
                                                        {teamName && (
                                                            <div className="flex items-center gap-1">
                                                                <Users className="w-4 h-4" />
                                                                <span>{teamName}</span>
                                                            </div>
                                                        )}
                                                        <span>{projectReleases.length} releases</span>
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
                                {editingProject ? t('editProject') : t('createNewProject')}
                            </DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4 py-4">
                            <div className="space-y-2">
                                <Label htmlFor="name">{t('projectName')} *</Label>
                                <Input
                                    id="name"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    placeholder="e.g., Customer Portal"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="code">{t('projectCode')}</Label>
                                <Input
                                    id="code"
                                    value={formData.code}
                                    onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                                    placeholder="e.g., CP"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="description">{t('description')}</Label>
                                <Textarea
                                    id="description"
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    placeholder="Project description..."
                                    rows={2}
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="status">{t('status')}</Label>
                                    <Select
                                        value={formData.status}
                                        onValueChange={(v) => setFormData({ ...formData, status: v })}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder={t('selectStatus')} />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {Object.entries(STATUS_CONFIG).map(([value, config]) => (
                                                <SelectItem key={value} value={value}>{config.label}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="team">{t('assignedTeam')}</Label>
                                    <Select
                                        value={formData.team_id}
                                        onValueChange={(v) => setFormData({ ...formData, team_id: v })}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder={t('selectTeam')} />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {teams.map(team => (
                                                <SelectItem key={team.id} value={team.id}>{team.name}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
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
                                        {editingProject ? t('update') : t('createProject')}
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