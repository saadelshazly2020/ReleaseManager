import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { format } from 'date-fns';
import {
    X, Edit, Calendar, Users, FolderOpen, Clock,
    FileText, Sparkles, Loader2, Bug, Zap, AlertTriangle,
    Shield, BookOpen, CheckCircle
} from 'lucide-react';
import { cn } from "@/lib/utils";

const STATUS_CONFIG = {
    planning: { label: 'Planning', color: 'bg-slate-100 text-slate-700' },
    in_progress: { label: 'In Progress', color: 'bg-blue-100 text-blue-700' },
    testing: { label: 'Testing', color: 'bg-amber-100 text-amber-700' },
    ready_for_deployment: { label: 'Ready for Deploy', color: 'bg-purple-100 text-purple-700' },
    deployed: { label: 'Deployed', color: 'bg-emerald-100 text-emerald-700' },
    cancelled: { label: 'Cancelled', color: 'bg-rose-100 text-rose-700' }
};

const ITEM_TYPE_CONFIG = {
    feature: { label: 'Feature', icon: Zap, color: 'text-blue-600 bg-blue-50' },
    bug_fix: { label: 'Bug Fix', icon: Bug, color: 'text-rose-600 bg-rose-50' },
    improvement: { label: 'Improvement', icon: Sparkles, color: 'text-emerald-600 bg-emerald-50' },
    breaking_change: { label: 'Breaking', icon: AlertTriangle, color: 'text-amber-600 bg-amber-50' },
    security: { label: 'Security', icon: Shield, color: 'text-purple-600 bg-purple-50' },
    documentation: { label: 'Docs', icon: BookOpen, color: 'text-slate-600 bg-slate-50' }
};

export default function ReleaseDetails({
    release,
    project,
    team,
    releaseItems,
    onClose,
    onEdit,
    onGenerateNotes,
    isGenerating,
    generatedNotes,
    onSaveNotes
}) {
    const [activeTab, setActiveTab] = useState('overview');
    const [editedNotes, setEditedNotes] = useState('');

    const statusConfig = STATUS_CONFIG[release.status] || STATUS_CONFIG.planning;

    const itemsByType = releaseItems.reduce((acc, item) => {
        if (!acc[item.type]) acc[item.type] = [];
        acc[item.type].push(item);
        return acc;
    }, {});

    return (
        <Card className="w-full max-w-3xl mx-auto max-h-[90vh] overflow-hidden flex flex-col">
            <CardHeader className="border-b shrink-0">
                <div className="flex items-start justify-between">
                    <div>
                        <div className="flex items-center gap-3">
                            <CardTitle className="text-xl">{release.name}</CardTitle>
                            <Badge variant="outline" className="font-mono">v{release.version}</Badge>
                            <Badge className={cn("text-xs", statusConfig.color)}>{statusConfig.label}</Badge>
                        </div>
                        <p className="text-sm text-slate-500 mt-1">{release.description}</p>
                    </div>
                    <div className="flex items-center gap-2">
                        <Button variant="outline" size="sm" onClick={onEdit}>
                            <Edit className="w-4 h-4 mr-1" /> Edit
                        </Button>
                        <Button variant="ghost" size="icon" onClick={onClose}>
                            <X className="w-5 h-5" />
                        </Button>
                    </div>
                </div>
            </CardHeader>

            <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 overflow-hidden flex flex-col">
                <TabsList className="mx-6 mt-4 shrink-0">
                    <TabsTrigger value="overview">Overview</TabsTrigger>
                    <TabsTrigger value="items">Items ({releaseItems.length})</TabsTrigger>
                    <TabsTrigger value="notes">Release Notes</TabsTrigger>
                </TabsList>

                <div className="flex-1 overflow-auto">
                    <TabsContent value="overview" className="p-6 m-0">
                        <div className="grid grid-cols-2 gap-6">
                            <div className="space-y-4">
                                <div>
                                    <label className="text-xs font-medium text-slate-500 uppercase tracking-wide">Project</label>
                                    <div className="flex items-center gap-2 mt-1">
                                        <FolderOpen className="w-4 h-4 text-slate-400" />
                                        <span className="font-medium">{project?.name || 'Unassigned'}</span>
                                    </div>
                                </div>
                                <div>
                                    <label className="text-xs font-medium text-slate-500 uppercase tracking-wide">Team</label>
                                    <div className="flex items-center gap-2 mt-1">
                                        <Users className="w-4 h-4 text-slate-400" />
                                        <span className="font-medium">{team?.name || 'Unassigned'}</span>
                                    </div>
                                </div>
                            </div>
                            <div className="space-y-4">
                                <div>
                                    <label className="text-xs font-medium text-slate-500 uppercase tracking-wide">Scheduled Date</label>
                                    <div className="flex items-center gap-2 mt-1">
                                        <Calendar className="w-4 h-4 text-slate-400" />
                                        <span className="font-medium">
                                            {release.scheduled_date ? format(new Date(release.scheduled_date), 'MMM dd, yyyy') : 'Not set'}
                                        </span>
                                    </div>
                                </div>
                                <div>
                                    <label className="text-xs font-medium text-slate-500 uppercase tracking-wide">Deployed Date</label>
                                    <div className="flex items-center gap-2 mt-1">
                                        <Clock className="w-4 h-4 text-slate-400" />
                                        <span className="font-medium">
                                            {release.deployed_date ? format(new Date(release.deployed_date), 'MMM dd, yyyy') : 'Not deployed'}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="mt-6 pt-6 border-t">
                            <label className="text-xs font-medium text-slate-500 uppercase tracking-wide">Audit Information</label>
                            <div className="grid grid-cols-2 gap-4 mt-3 text-sm">
                                <div>
                                    <span className="text-slate-500">Created:</span>{' '}
                                    <span className="font-medium">{format(new Date(release.created_date), 'MMM dd, yyyy HH:mm')}</span>
                                </div>
                                <div>
                                    <span className="text-slate-500">Created By:</span>{' '}
                                    <span className="font-medium">{release.created_by}</span>
                                </div>
                                <div>
                                    <span className="text-slate-500">Updated:</span>{' '}
                                    <span className="font-medium">{format(new Date(release.updated_date), 'MMM dd, yyyy HH:mm')}</span>
                                </div>
                            </div>
                        </div>
                    </TabsContent>

                    <TabsContent value="items" className="p-6 m-0">
                        {releaseItems.length === 0 ? (
                            <div className="text-center py-12 text-slate-400">
                                <FileText className="w-12 h-12 mx-auto mb-3 opacity-50" />
                                <p>No items added to this release yet</p>
                            </div>
                        ) : (
                            <div className="space-y-6">
                                {Object.entries(itemsByType).map(([type, items]) => {
                                    const config = ITEM_TYPE_CONFIG[type] || ITEM_TYPE_CONFIG.feature;
                                    const Icon = config.icon;
                                    return (
                                        <div key={type}>
                                            <div className="flex items-center gap-2 mb-3">
                                                <Icon className={cn("w-4 h-4", config.color.split(' ')[0])} />
                                                <h4 className="font-semibold text-slate-700">{config.label}s ({items.length})</h4>
                                            </div>
                                            <div className="space-y-2">
                                                {items.map(item => (
                                                    <div key={item.id} className="p-3 rounded-lg bg-slate-50 border border-slate-100">
                                                        <div className="flex items-start justify-between">
                                                            <div>
                                                                <p className="font-medium text-slate-800">{item.title}</p>
                                                                {item.description && (
                                                                    <p className="text-sm text-slate-500 mt-1">{item.description}</p>
                                                                )}
                                                            </div>
                                                            {item.ticket_number && (
                                                                <Badge variant="outline" className="text-xs shrink-0">
                                                                    {item.ticket_number}
                                                                </Badge>
                                                            )}
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </TabsContent>

                    <TabsContent value="notes" className="p-6 m-0">
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <h4 className="font-semibold text-slate-700">AI-Generated Release Notes</h4>
                                <Button
                                    onClick={onGenerateNotes}
                                    disabled={isGenerating || releaseItems.length === 0}
                                    className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700"
                                >
                                    {isGenerating ? (
                                        <>
                                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                            Generating...
                                        </>
                                    ) : (
                                        <>
                                            <Sparkles className="w-4 h-4 mr-2" />
                                            Generate Notes
                                        </>
                                    )}
                                </Button>
                            </div>

                            {releaseItems.length === 0 && (
                                <p className="text-sm text-slate-500">
                                    Add release items (features, bug fixes, etc.) to generate release notes.
                                </p>
                            )}

                            {(generatedNotes || release.release_notes) && (
                                <div className="space-y-3">
                                    <textarea
                                        className="w-full h-64 p-4 rounded-lg border border-slate-200 focus:border-indigo-300 focus:ring focus:ring-indigo-100 resize-none"
                                        value={editedNotes || generatedNotes || release.release_notes || ''}
                                        onChange={(e) => setEditedNotes(e.target.value)}
                                        placeholder="Release notes will appear here..."
                                    />
                                    <div className="flex justify-end">
                                        <Button onClick={() => onSaveNotes(editedNotes || generatedNotes)}>
                                            <CheckCircle className="w-4 h-4 mr-2" />
                                            Save Notes
                                        </Button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </TabsContent>
                </div>
            </Tabs>
        </Card>
    );
}