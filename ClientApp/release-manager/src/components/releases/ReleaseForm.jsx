import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { X, Save, Loader2 } from 'lucide-react';

const STATUS_OPTIONS = [
    { value: 'planning', label: 'Planning' },
    { value: 'in_progress', label: 'In Progress' },
    { value: 'testing', label: 'Testing' },
    { value: 'ready_for_deployment', label: 'Ready for Deployment' },
    { value: 'deployed', label: 'Deployed' },
    { value: 'cancelled', label: 'Cancelled' }
];

const PRIORITY_OPTIONS = [
    { value: 'low', label: 'Low' },
    { value: 'medium', label: 'Medium' },
    { value: 'high', label: 'High' },
    { value: 'critical', label: 'Critical' }
];

export default function ReleaseForm({ release, projects, teams, onSave, onCancel, isLoading, t = (k) => k }) {
    const [formData, setFormData] = useState({
        name: '',
        version: '',
        status: 'planning',
        priority: 'medium',
        description: '',
        project_id: '',
        team_id: '',
        scheduled_date: '',
        deployed_date: '',
        release_notes: ''
    });

    useEffect(() => {
        if (release) {
            setFormData({
                name: release.name || '',
                version: release.version || '',
                status: release.status || 'planning',
                priority: release.priority || 'medium',
                description: release.description || '',
                project_id: release.project_id || '',
                team_id: release.team_id || '',
                scheduled_date: release.scheduled_date || '',
                deployed_date: release.deployed_date || '',
                release_notes: release.release_notes || ''
            });
        }
    }, [release]);

    const handleChange = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSave(formData);
    };

    return (
        <Card className="w-full max-w-2xl mx-auto">
            <CardHeader className="border-b">
                <div className="flex items-center justify-between">
                    <CardTitle className="text-xl">
                        {release ? t('editRelease') : t('createNewRelease')}
                    </CardTitle>
                    <Button variant="ghost" size="icon" onClick={onCancel}>
                        <X className="w-5 h-5" />
                    </Button>
                </div>
            </CardHeader>
            <form onSubmit={handleSubmit}>
                <CardContent className="space-y-6 pt-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="name">{t('releaseName')} *</Label>
                            <Input
                                id="name"
                                value={formData.name}
                                onChange={(e) => handleChange('name', e.target.value)}
                                placeholder="e.g., Sprint 23 Release"
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="version">{t('version')} *</Label>
                            <Input
                                id="version"
                                value={formData.version}
                                onChange={(e) => handleChange('version', e.target.value)}
                                placeholder="e.g., 2.1.0"
                                required
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="description">{t('description')}</Label>
                        <Textarea
                            id="description"
                            value={formData.description}
                            onChange={(e) => handleChange('description', e.target.value)}
                            placeholder="Brief description of this release..."
                            rows={3}
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="status">{t('status')}</Label>
                            <Select value={formData.status} onValueChange={(v) => handleChange('status', v)}>
                                <SelectTrigger>
                                    <SelectValue placeholder={t('selectStatus')} />
                                </SelectTrigger>
                                <SelectContent>
                                    {STATUS_OPTIONS.map(opt => (
                                        <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="priority">{t('priority')}</Label>
                            <Select value={formData.priority} onValueChange={(v) => handleChange('priority', v)}>
                                <SelectTrigger>
                                    <SelectValue placeholder={t('selectPriority')} />
                                </SelectTrigger>
                                <SelectContent>
                                    {PRIORITY_OPTIONS.map(opt => (
                                        <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="project">{t('project')}</Label>
                            <Select value={formData.project_id} onValueChange={(v) => handleChange('project_id', v)}>
                                <SelectTrigger>
                                    <SelectValue placeholder={t('selectProject')} />
                                </SelectTrigger>
                                <SelectContent>
                                    {projects.map(proj => (
                                        <SelectItem key={proj.id} value={proj.id}>{proj.name}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="team">{t('team')}</Label>
                            <Select value={formData.team_id} onValueChange={(v) => handleChange('team_id', v)}>
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

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="scheduled_date">{t('scheduledDate')}</Label>
                            <Input
                                id="scheduled_date"
                                type="date"
                                value={formData.scheduled_date}
                                onChange={(e) => handleChange('scheduled_date', e.target.value)}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="deployed_date">{t('deployedDate')}</Label>
                            <Input
                                id="deployed_date"
                                type="date"
                                value={formData.deployed_date}
                                onChange={(e) => handleChange('deployed_date', e.target.value)}
                            />
                        </div>
                    </div>
                </CardContent>
                <CardFooter className="border-t pt-6 flex justify-end gap-3">
                    <Button type="button" variant="outline" onClick={onCancel}>
                        {t('cancel')}
                    </Button>
                    <Button type="submit" className="bg-indigo-600 hover:bg-indigo-700" disabled={isLoading}>
                        {isLoading ? (
                            <>
                                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                {t('saving')}
                            </>
                        ) : (
                            <>
                                <Save className="w-4 h-4 mr-2" />
                                {release ? t('updateRelease') : t('createRelease')}
                            </>
                        )}
                    </Button>
                </CardFooter>
            </form>
        </Card>
    );
}