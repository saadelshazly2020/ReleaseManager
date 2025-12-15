import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { X, Save, Loader2 } from 'lucide-react';

const TYPE_OPTIONS = [
    { value: 'feature', label: 'Feature' },
    { value: 'bug_fix', label: 'Bug Fix' },
    { value: 'improvement', label: 'Improvement' },
    { value: 'breaking_change', label: 'Breaking Change' },
    { value: 'security', label: 'Security' },
    { value: 'documentation', label: 'Documentation' }
];

const STATUS_OPTIONS = [
    { value: 'pending', label: 'Pending' },
    { value: 'in_progress', label: 'In Progress' },
    { value: 'completed', label: 'Completed' },
    { value: 'cancelled', label: 'Cancelled' }
];

export default function ReleaseItemForm({ item, releaseId, onSave, onCancel, isLoading, t = (k) => k }) {
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        type: 'feature',
        status: 'pending',
        ticket_number: '',
        assigned_to: '',
        release_id: releaseId
    });

    useEffect(() => {
        if (item) {
            setFormData({
                title: item.title || '',
                description: item.description || '',
                type: item.type || 'feature',
                status: item.status || 'pending',
                ticket_number: item.ticket_number || '',
                assigned_to: item.assigned_to || '',
                release_id: item.release_id || releaseId
            });
        }
    }, [item, releaseId]);

    const handleChange = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSave(formData);
    };

    return (
        <Card className="w-full max-w-lg mx-auto">
            <CardHeader className="border-b">
                <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">
                        {item ? t('editItem') : t('addReleaseItem')}
                    </CardTitle>
                    <Button variant="ghost" size="icon" onClick={onCancel}>
                        <X className="w-5 h-5" />
                    </Button>
                </div>
            </CardHeader>
            <form onSubmit={handleSubmit}>
                <CardContent className="space-y-4 pt-6">
                    <div className="space-y-2">
                        <Label htmlFor="title">{t('title')} *</Label>
                        <Input
                            id="title"
                            value={formData.title}
                            onChange={(e) => handleChange('title', e.target.value)}
                            placeholder="e.g., Add user authentication"
                            required
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="description">{t('description')}</Label>
                        <Textarea
                            id="description"
                            value={formData.description}
                            onChange={(e) => handleChange('description', e.target.value)}
                            placeholder="Detailed description..."
                            rows={3}
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="type">{t('type')}</Label>
                            <Select value={formData.type} onValueChange={(v) => handleChange('type', v)}>
                                <SelectTrigger>
                                    <SelectValue placeholder={t('selectType')} />
                                </SelectTrigger>
                                <SelectContent>
                                    {TYPE_OPTIONS.map(opt => (
                                        <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
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
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="ticket_number">{t('ticketNumber')}</Label>
                            <Input
                                id="ticket_number"
                                value={formData.ticket_number}
                                onChange={(e) => handleChange('ticket_number', e.target.value)}
                                placeholder="e.g., JIRA-123"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="assigned_to">{t('assignedTo')}</Label>
                            <Input
                                id="assigned_to"
                                value={formData.assigned_to}
                                onChange={(e) => handleChange('assigned_to', e.target.value)}
                                placeholder="e.g., John Doe"
                            />
                        </div>
                    </div>
                </CardContent>
                <CardFooter className="border-t pt-4 flex justify-end gap-3">
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
                                {item ? t('update') : t('addItem')}
                            </>
                        )}
                    </Button>
                </CardFooter>
            </form>
        </Card>
    );
}