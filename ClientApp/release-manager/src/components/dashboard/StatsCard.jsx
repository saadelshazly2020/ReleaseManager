import React from 'react';
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export default function StatsCard({ title, value, icon: Icon, color, trend, onClick }) {
    return (
        <Card
            className={cn(
                "relative overflow-hidden cursor-pointer transition-all duration-300 hover:shadow-lg hover:-translate-y-1",
                onClick && "hover:ring-2 hover:ring-offset-2"
            )}
            style={{ '--ring-color': color }}
            onClick={onClick}
        >
            <div className="p-6">
                <div className="flex items-start justify-between">
                    <div>
                        <p className="text-sm font-medium text-slate-500">{title}</p>
                        <h3 className="text-3xl font-bold mt-2 text-slate-800">{value}</h3>
                        {trend && (
                            <p className={cn(
                                "text-xs mt-2 font-medium",
                                trend > 0 ? "text-emerald-600" : "text-rose-600"
                            )}>
                                {trend > 0 ? "+" : ""}{trend}% from last month
                            </p>
                        )}
                    </div>
                    <div
                        className="p-3 rounded-xl"
                        style={{ backgroundColor: `${color}15` }}
                    >
                        <Icon className="w-6 h-6" style={{ color }} />
                    </div>
                </div>
            </div>
            <div
                className="absolute bottom-0 left-0 right-0 h-1"
                style={{ backgroundColor: color }}
            />
        </Card>
    );
}