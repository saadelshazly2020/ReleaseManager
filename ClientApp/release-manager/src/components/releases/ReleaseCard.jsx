import React from 'react';
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { format } from 'date-fns';
import { Calendar, Users, FolderOpen, ChevronRight, Clock } from 'lucide-react';
import { cn } from "@/lib/utils";

const STATUS_CONFIG = {
    planning: { label: 'Planning', color: 'bg-slate-100 text-slate-700 border-slate-200' },
    in_progress: { label: 'In Progress', color: 'bg-blue-100 text-blue-700 border-blue-200' },
    testing: { label: 'Testing', color: 'bg-amber-100 text-amber-700 border-amber-200' },
    ready_for_deployment: { label: 'Ready for Deploy', color: 'bg-purple-100 text-purple-700 border-purple-200' },
    deployed: { label: 'Deployed', color: 'bg-emerald-100 text-emerald-700 border-emerald-200' },
    cancelled: { label: 'Cancelled', color: 'bg-rose-100 text-rose-700 border-rose-200' }
};

const PRIORITY_CONFIG = {
    low: { label: 'Low', color: 'bg-slate-50 text-slate-600' },
    medium: { label: 'Medium', color: 'bg-blue-50 text-blue-600' },
    high: { label: 'High', color: 'bg-amber-50 text-amber-600' },
    critical: { label: 'Critical', color: 'bg-rose-50 text-rose-600' }
};

export default function ReleaseCard({ release, project, team, onClick }) {
    const statusConfig = STATUS_CONFIG[release.status] || STATUS_CONFIG.planning;
    const priorityConfig = PRIORITY_CONFIG[release.priority] || PRIORITY_CONFIG.medium;

    return (
        <Card
            className="group p-5 hover:shadow-lg transition-all duration-300 cursor-pointer border-slate-200 hover:border-indigo-300"
            onClick={onClick}
        >
            <div className="flex items-start justify-between">
                <div className="flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="font-semibold text-slate-800 group-hover:text-indigo-600 transition-colors">
                            {release.name}
                        </h3>
                        <Badge variant="outline" className="text-xs font-mono">
                            v{release.version}
                        </Badge>
                        <Badge className={cn("text-xs border", priorityConfig.color)}>
                            {priorityConfig.label}
                        </Badge>
                    </div>

                    {release.description && (
                        <p className="text-sm text-slate-500 mt-2 line-clamp-2">
                            {release.description}
                        </p>
                    )}

                    <div className="flex flex-wrap items-center gap-4 mt-4 text-sm text-slate-500">
                        {project && (
                            <div className="flex items-center gap-1.5">
                                <FolderOpen className="w-4 h-4" />
                                <span>{project.name}</span>
                            </div>
                        )}
                        {team && (
                            <div className="flex items-center gap-1.5">
                                <Users className="w-4 h-4" />
                                <span>{team.name}</span>
                            </div>
                        )}
                        {release.scheduled_date && (
                            <div className="flex items-center gap-1.5">
                                <Calendar className="w-4 h-4" />
                                <span>{format(new Date(release.scheduled_date), 'MMM dd, yyyy')}</span>
                            </div>
                        )}
                    </div>
                </div>

                <div className="flex flex-col items-end gap-2">
                    <Badge className={cn("text-xs border", statusConfig.color)}>
                        {statusConfig.label}
                    </Badge>
                    <ChevronRight className="w-5 h-5 text-slate-300 group-hover:text-indigo-500 transition-colors mt-2" />
                </div>
            </div>
        </Card>
    );
}