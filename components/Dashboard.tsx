import React from 'react';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
// Fix: Import LeadStatus to be used for strong typing.
import { Lead, LeadStatus } from '../types';
import { TargetIcon, CheckCircleIcon, DollarSignIcon } from './icons/Icon';

interface DashboardProps {
    leads: Lead[];
}

const StatCard: React.FC<{ title: string; value: string | number; description: string, icon: React.ReactNode }> = ({ title, value, description, icon }) => (
    <div className="bg-gray-800 p-6 rounded-lg border border-gray-700 shadow-lg flex items-center space-x-4 transition-transform hover:scale-105 duration-300">
        <div className="bg-brand-primary/20 text-brand-primary p-3 rounded-full">{icon}</div>
        <div>
            <p className="text-3xl font-semibold text-white">{value}</p>
            <h3 className="text-sm font-medium text-gray-300">{title}</h3>
            <p className="mt-1 text-xs text-gray-400">{description}</p>
        </div>
    </div>
);

const ChartContainer: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
    <div className="bg-gray-800 p-6 rounded-lg border border-gray-700 shadow-lg">
        <h3 className="text-lg font-semibold text-white mb-4">{title}</h3>
        <div style={{ width: '100%', height: 300 }}>
            {children}
        </div>
    </div>
);

export const Dashboard: React.FC<DashboardProps> = ({ leads }) => {
    const totalOpportunities = leads.length;
    const qualifiedLeads = leads.filter(l => l.status === 'Qualified').length;
    const totalPotentialROI = leads.reduce((sum, lead) => sum + lead.estimatedRoi, 0);

    // Fix: Using Record<string, ...> to ensure Object.values returns a correctly typed array, which resolves downstream type errors.
    const leadsByStatus = leads.reduce((acc, lead) => {
        const status = lead.status;
        if (!acc[status]) {
            acc[status] = { name: status, value: 0 };
        }
        acc[status].value += 1;
        return acc;
    }, {} as Record<string, {name: LeadStatus, value: number}>);
    const statusData = Object.values(leadsByStatus);

    const roiByIndustry = leads.reduce((acc, lead) => {
        const industry = lead.industry;
        if (!acc[industry]) {
            acc[industry] = { name: industry, roi: 0 };
        }
        acc[industry].roi += lead.estimatedRoi;
        return acc;
    }, {} as Record<string, {name: string, roi: number}>);
    const industryData = Object.values(roiByIndustry);
    
    // Fix: Explicitly type STATUS_COLORS to ensure type safety when accessing its properties.
    const STATUS_COLORS: Record<LeadStatus, string> = { 'Prospected': '#3B82F6', 'Contacted': '#F59E0B', 'Qualified': '#10B981', 'Closed': '#6B7280'};

    return (
        <div className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <StatCard 
                    title="Total Opportunities" 
                    value={totalOpportunities}
                    description="Number of companies analyzed."
                    icon={<TargetIcon className="w-6 h-6"/>}
                />
                <StatCard 
                    title="Qualified Leads" 
                    value={qualifiedLeads}
                    description="Leads ready for engagement."
                    icon={<CheckCircleIcon className="w-6 h-6"/>}
                />
                <StatCard 
                    title="Total Potential ROI" 
                    value={totalPotentialROI > 1000000 ? `$${(totalPotentialROI / 1000000).toFixed(2)}M` : `$${(totalPotentialROI/1000).toFixed(0)}K`}
                    description="Sum of estimated annual ROI."
                    icon={<DollarSignIcon className="w-6 h-6"/>}
                />
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
                <div className="lg:col-span-2">
                    <ChartContainer title="Leads by Status">
                        {leads.length > 0 ? (
                            <ResponsiveContainer>
                                <PieChart>
                                    <Pie data={statusData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label>
                                        {/* FIX: Explicitly type 'entry' to resolve type inference issue where it was being inferred as 'unknown'. */}
                                        {statusData.map((entry: { name: LeadStatus }, index) => <Cell key={`cell-${index}`} fill={STATUS_COLORS[entry.name]} />)}
                                    </Pie>
                                    <Tooltip contentStyle={{ backgroundColor: '#1F2937', border: '1px solid #374151' }} />
                                    <Legend />
                                </PieChart>
                            </ResponsiveContainer>
                        ) : <p className="text-gray-400 text-center pt-20">No lead data to display.</p>}
                    </ChartContainer>
                </div>
                <div className="lg:col-span-3">
                    <ChartContainer title="Potential ROI by Industry">
                        {leads.length > 0 ? (
                           <ResponsiveContainer>
                                <BarChart data={industryData} layout="vertical" margin={{ top: 5, right: 30, left: 60, bottom: 5 }}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#4B5563" />
                                    <XAxis type="number" stroke="#D1D5DB" tickFormatter={(value) => `$${value/1000}k`} />
                                    <YAxis type="category" dataKey="name" stroke="#D1D5DB" width={120} />
                                    <Tooltip
                                        contentStyle={{ backgroundColor: '#1F2937', border: '1px solid #374151' }}
                                        cursor={{ fill: 'rgba(0, 168, 168, 0.1)' }}
                                        formatter={(value) => `$${Number(value).toLocaleString()}`}
                                    />
                                    <Bar dataKey="roi" fill="#00A8A8" name="Potential ROI" />
                                </BarChart>
                            </ResponsiveContainer>
                        ) : <p className="text-gray-400 text-center pt-20">No ROI data to display.</p>}
                    </ChartContainer>
                </div>
            </div>
        </div>
    );
};