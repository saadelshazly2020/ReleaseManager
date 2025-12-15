import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { format, parseISO, isAfter, isBefore, addDays } from 'date-fns';
import { Calendar, Clock, ChevronRight } from 'lucide-react';
import { cn } from "@/lib/utils";

const STATUS_CONFIG = {
    planning: { label: 'Planning', color: 'bg-slate-100 text-slate-700' },
    in_progress: { label: 'In Progress', color: 'bg-blue-100 text-blue-700' },
    testing: { label: 'Testing', color: 'bg-amber-100 text-amber-700' },
    ready_for_deployment: { label: 'Ready', color: 'bg-purple-100 text-purple-700' },
    deployed: { label: 'Deployed', color: 'bg-emerald-100 text-emerald-700' },
    cancelled: { label: 'Cancelled', color: 'bg-rose-100 text-rose-700' }
};

const PRIORITY_CONFIG = {
    low: 'border-l-slate-400',
    medium: 'border-l-blue-500',
    high: 'border-l-amber-500',
    critical: 'border-l-rose-500'
};

export default function TimelineView({ releases, projects, onSelectRelease }) {
    const sortedReleases = [...releases]
        .filter(r => r.scheduled_date)
        .sort((a, b) => new Date(a.scheduled_date) - new Date(b.scheduled_date));

    const today = new Date();
    const upcomingReleases = sortedReleases.filter(r =>
        r.status !== 'deployed' && r.status !== 'cancelled'
    ).slice(0, 6);

    const getProjectName = (projectId) => {
        const project = projects.find(p => p.id === projectId);
        return project?.name || 'Unassigned';
    };

    const isOverdue = (date) => {
        return isBefore(parseISO(date), today) && !['deployed', 'cancelled'].includes;
    };

    if (upcomingReleases.length === 0) {
        return (
            <Card className="h-full">
                <CardHeader>
                    <CardTitle className="text-lg font-semibold text-slate-800 flex items-center gap-2">
                        <Calendar className="w-5 h-5 text-indigo-600" />
                        Upcoming Releases
                    </CardTitle>
                </CardHeader>
                <CardContent className="flex items-center justify-center h-64">
                    <p className="text-slate-400">No upcoming releases scheduled</p>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card className="h-full">
            <CardHeader>
                <CardTitle className="text-lg font-semibold text-slate-800 flex items-center gap-2">
                    <Calendar className="w-5 h-5 text-indigo-600" />
                    Upcoming Releases
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
                {upcomingReleases.map((release, index) => {
                    const releaseDate = parseISO(release.scheduled_date);
                    const isLate = isBefore(releaseDate, today) && release.status !== 'deployed';

                    return (
                        <div
                            key={release.id}
                            onClick={() => onSelectRelease(release)}
                            className={cn(
                                "p-4 rounded-lg border-l-4 bg-slate-50 hover:bg-slate-100 cursor-pointer transition-all duration-200",
                                PRIORITY_CONFIG[release.priority] || 'border-l-slate-400'
                            )}
                        >
                            <div className="flex items-start justify-between">
                                <div className="flex-1">
                                    <div className="flex items-center gap-2">
                                        <h4 className="font-semibold text-slate-800">{release.name}</h4>
                                        <Badge variant="outline" className="text-xs">
                                            v{release.version}
                                        </Badge>
                                    </div>
                                    <p className="text-sm text-slate-500 mt-1">{getProjectName(release.project_id)}</p>
                                </div>
                                <ChevronRight className="w-4 h-4 text-slate-400" />
                            </div>
                            <div className="flex items-center justify-between mt-3">
                                <div className="flex items-center gap-2 text-sm">
                                    <Clock className={cn("w-4 h-4", isLate ? "text-rose-500" : "text-slate-400")} />
                                    <span className={cn(isLate ? "text-rose-600 font-medium" : "text-slate-600")}>
                                        {format(releaseDate, 'MMM dd, yyyy')}
                                    </span>
                                    {isLate && <Badge className="bg-rose-100 text-rose-700 text-xs">Overdue</Badge>}
                                </div>
                                <Badge className={cn("text-xs", STATUS_CONFIG[release.status]?.color)}>
                                    {STATUS_CONFIG[release.status]?.label}
                                </Badge>
                            </div>
                        </div>
                    );
                })}
            </CardContent>
        </Card>
    );
}