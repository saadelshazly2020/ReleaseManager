import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { Users } from 'lucide-react';

const COLORS = ['#6366f1', '#8b5cf6', '#a855f7', '#d946ef', '#ec4899', '#f43f5e'];

export default function TeamWorkload({ releases, teams }) {
    const teamWorkload = teams.map((team, index) => {
        const teamReleases = releases.filter(r => r.team_id === team.id);
        const activeReleases = teamReleases.filter(r =>
            !['deployed', 'cancelled'].includes(r.status)
        );

        return {
            name: team.name.length > 12 ? team.name.substring(0, 12) + '...' : team.name,
            fullName: team.name,
            total: teamReleases.length,
            active: activeReleases.length,
            color: team.color || COLORS[index % COLORS.length]
        };
    });

    if (teamWorkload.length === 0) {
        return (
            <Card className="h-full">
                <CardHeader>
                    <CardTitle className="text-lg font-semibold text-slate-800 flex items-center gap-2">
                        <Users className="w-5 h-5 text-indigo-600" />
                        Team Workload
                    </CardTitle>
                </CardHeader>
                <CardContent className="flex items-center justify-center h-64">
                    <p className="text-slate-400">No team data available</p>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card className="h-full">
            <CardHeader>
                <CardTitle className="text-lg font-semibold text-slate-800 flex items-center gap-2">
                    <Users className="w-5 h-5 text-indigo-600" />
                    Team Workload
                </CardTitle>
            </CardHeader>
            <CardContent>
                <ResponsiveContainer width="100%" height={280}>
                    <BarChart data={teamWorkload} layout="vertical" margin={{ left: 10, right: 20 }}>
                        <XAxis type="number" axisLine={false} tickLine={false} />
                        <YAxis
                            type="category"
                            dataKey="name"
                            axisLine={false}
                            tickLine={false}
                            width={100}
                            tick={{ fontSize: 12, fill: '#64748b' }}
                        />
                        <Tooltip
                            contentStyle={{
                                backgroundColor: 'white',
                                border: 'none',
                                borderRadius: '8px',
                                boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)'
                            }}
                            formatter={(value, name) => [value, name === 'active' ? 'Active Releases' : 'Total Releases']}
                            labelFormatter={(label, payload) => payload[0]?.payload?.fullName || label}
                        />
                        <Bar dataKey="active" radius={[0, 4, 4, 0]} barSize={20}>
                            {teamWorkload.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                        </Bar>
                    </BarChart>
                </ResponsiveContainer>
                <div className="flex items-center justify-center gap-4 mt-4 text-sm text-slate-500">
                    <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded bg-indigo-500" />
                        <span>Active Releases</span>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}