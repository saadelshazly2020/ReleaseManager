import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';

const STATUS_CONFIG = {
    planning: { label: 'Planning', color: '#94a3b8' },
    in_progress: { label: 'In Progress', color: '#3b82f6' },
    testing: { label: 'Testing', color: '#f59e0b' },
    ready_for_deployment: { label: 'Ready', color: '#8b5cf6' },
    deployed: { label: 'Deployed', color: '#10b981' },
    cancelled: { label: 'Cancelled', color: '#ef4444' }
};

export default function StatusChart({ releases }) {
    const statusCounts = releases.reduce((acc, release) => {
        acc[release.status] = (acc[release.status] || 0) + 1;
        return acc;
    }, {});

    const data = Object.entries(statusCounts).map(([status, count]) => ({
        name: STATUS_CONFIG[status]?.label || status,
        value: count,
        color: STATUS_CONFIG[status]?.color || '#64748b'
    }));

    if (data.length === 0) {
        return (
            <Card className="h-full">
                <CardHeader>
                    <CardTitle className="text-lg font-semibold text-slate-800">Release Status Distribution</CardTitle>
                </CardHeader>
                <CardContent className="flex items-center justify-center h-64">
                    <p className="text-slate-400">No release data available</p>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card className="h-full">
            <CardHeader>
                <CardTitle className="text-lg font-semibold text-slate-800">Release Status Distribution</CardTitle>
            </CardHeader>
            <CardContent>
                <ResponsiveContainer width="100%" height={280}>
                    <PieChart>
                        <Pie
                            data={data}
                            cx="50%"
                            cy="50%"
                            innerRadius={60}
                            outerRadius={100}
                            paddingAngle={4}
                            dataKey="value"
                        >
                            {data.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                        </Pie>
                        <Tooltip
                            contentStyle={{
                                backgroundColor: 'white',
                                border: 'none',
                                borderRadius: '8px',
                                boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)'
                            }}
                        />
                        <Legend
                            verticalAlign="bottom"
                            height={36}
                            formatter={(value) => <span className="text-sm text-slate-600">{value}</span>}
                        />
                    </PieChart>
                </ResponsiveContainer>
            </CardContent>
        </Card>
    );
}