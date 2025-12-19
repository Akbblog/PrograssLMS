"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Loader2, Activity, Server, Database, ShieldCheck, AlertTriangle, RefreshCw, Cpu, HardDrive } from "lucide-react";
import { toast } from "sonner";
import Icon from "@/components/ui/icon";

export default function SystemHealthPage() {
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    useEffect(() => {
        setTimeout(() => setLoading(false), 800);
    }, []);

    const services = [
        { name: "API Gateway", status: "operational", latency: "45ms", uptime: "99.98%" },
        { name: "Authentication Service", status: "operational", latency: "12ms", uptime: "100%" },
        { name: "Media Processing", status: "degraded", latency: "850ms", uptime: "98.5%" },
        { name: "Notification Engine", status: "operational", latency: "120ms", uptime: "99.9%" },
    ];

    const handleRefresh = () => {
        setRefreshing(true);
        setTimeout(() => {
            setRefreshing(false);
            toast.success("System status updated");
        }, 1000);
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-[60vh]">
                <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
            </div>
        );
    }

    return (
        <div className="p-4 md:p-8 max-w-7xl mx-auto space-y-8 animate-in fade-in duration-500">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900 flex items-center gap-3">
                        <div className="p-2 rounded-xl bg-indigo-100">
                            <Activity className="h-6 w-6 text-indigo-600" />
                        </div>
                        System Health
                    </h1>
                    <p className="text-slate-500 mt-2">Real-time monitoring of infrastructure and microservices.</p>
                </div>
                <button
                    onClick={handleRefresh}
                    disabled={refreshing}
                    className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors text-sm font-bold text-slate-600"
                >
                    <RefreshCw className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
                    Refresh Status
                </button>
            </div>

            {/* Infrastructure Overview */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <Card className="border-none shadow-lg shadow-slate-200/50 bg-white">
                    <CardContent className="p-6">
                        <div className="flex justify-between items-start mb-4">
                            <div className="p-2 bg-blue-50 rounded-lg text-blue-600"><Cpu className="h-4 w-4" /></div>
                            <span className="text-xs font-bold text-green-600">Stable</span>
                        </div>
                        <p className="text-sm font-medium text-slate-500">CPU Usage</p>
                        <p className="text-2xl font-bold text-slate-900 mt-1">24%</p>
                        <div className="h-1 w-full bg-slate-100 mt-3 rounded-full overflow-hidden">
                            <div className="h-full bg-blue-500 w-1/4" />
                        </div>
                    </CardContent>
                </Card>
                <Card className="border-none shadow-lg shadow-slate-200/50 bg-white">
                    <CardContent className="p-6">
                        <div className="flex justify-between items-start mb-4">
                            <div className="p-2 bg-purple-50 rounded-lg text-purple-600"><Server className="h-4 w-4" /></div>
                            <span className="text-xs font-bold text-green-600">Optimal</span>
                        </div>
                        <p className="text-sm font-medium text-slate-500">Memory</p>
                        <p className="text-2xl font-bold text-slate-900 mt-1">4.2 GB</p>
                        <p className="text-[10px] text-slate-400 mt-1 font-medium">Of 16GB Dedicated</p>
                    </CardContent>
                </Card>
                <Card className="border-none shadow-lg shadow-slate-200/50 bg-white">
                    <CardContent className="p-6">
                        <div className="flex justify-between items-start mb-4">
                            <div className="p-2 bg-amber-50 rounded-lg text-amber-600"><Database className="h-4 w-4" /></div>
                            <span className="text-xs font-bold text-amber-600">92% Capacity</span>
                        </div>
                        <p className="text-sm font-medium text-slate-500">DB Connections</p>
                        <p className="text-2xl font-bold text-slate-900 mt-1">128</p>
                        <p className="text-[10px] text-slate-400 mt-1 font-medium">Active sessions</p>
                    </CardContent>
                </Card>
                <Card className="border-none shadow-lg shadow-slate-200/50 bg-white">
                    <CardContent className="p-6">
                        <div className="flex justify-between items-start mb-4">
                            <div className="p-2 bg-green-50 rounded-lg text-green-600"><ShieldCheck className="h-4 w-4" /></div>
                            <span className="text-xs font-bold text-green-600">Active</span>
                        </div>
                        <p className="text-sm font-medium text-slate-500">SSL Certificate</p>
                        <p className="text-2xl font-bold text-slate-900 mt-1">Valid</p>
                        <p className="text-[10px] text-slate-400 mt-1 font-medium">Expires in 284 days</p>
                    </CardContent>
                </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Services List */}
                <Card className="border-none shadow-xl shadow-slate-200/50 bg-white">
                    <CardHeader>
                        <CardTitle className="text-lg">Microservices Cluster</CardTitle>
                        <CardDescription>Status check for core backend services.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {services.map((s, i) => (
                            <div key={i} className="flex items-center justify-between p-4 rounded-2xl bg-slate-50/50 border border-slate-100">
                                <div className="flex items-center gap-4">
                                    <div className={`h-2.5 w-2.5 rounded-full ${s.status === 'operational' ? 'bg-green-500 animate-pulse' : 'bg-amber-500'}`} />
                                    <div>
                                        <p className="font-bold text-slate-900">{s.name}</p>
                                        <p className="text-[10px] text-slate-400 font-bold uppercase">{s.uptime} Uptime</p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <Badge className={s.status === 'operational' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}>
                                        {s.status.toUpperCase()}
                                    </Badge>
                                    <p className="text-[10px] text-slate-400 mt-1 font-mono">{s.latency}</p>
                                </div>
                            </div>
                        ))}
                    </CardContent>
                </Card>

                {/* Recent Incident Log */}
                <Card className="border-none shadow-xl shadow-slate-200/50 bg-white">
                    <CardHeader>
                        <CardTitle className="text-lg">Incident History</CardTitle>
                        <CardDescription>Log of system anomalies and maintenance.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        {[
                            { title: "Database Optimization", type: "maintenance", date: "Sep 28, 2024", duration: "15 min" },
                            { title: "S3 Connection Timeout", type: "incident", date: "Sep 25, 2024", duration: "2 min" },
                            { title: "Load Balancer Upgrade", type: "maintenance", date: "Sep 22, 2024", duration: "45 min" },
                        ].map((log, i) => (
                            <div key={i} className="flex gap-4">
                                <div className={`h-10 w-10 shrink-0 rounded-xl flex items-center justify-center ${log.type === 'incident' ? 'bg-red-50 text-red-600' : 'bg-indigo-50 text-indigo-600'}`}>
                                    {log.type === 'incident' ? <AlertTriangle className="h-5 w-5" /> : <RefreshCw className="h-5 w-5" />}
                                </div>
                                <div className="flex-1 border-b border-slate-50 pb-4">
                                    <div className="flex justify-between items-start">
                                        <h4 className="font-bold text-slate-900">{log.title}</h4>
                                        <span className="text-[10px] text-slate-400 font-bold">{log.date}</span>
                                    </div>
                                    <p className="text-xs text-slate-500 mt-1 uppercase tracking-tight font-bold">Duration: {log.duration}</p>
                                </div>
                            </div>
                        ))}
                    </CardContent>
                </Card>
            </div>

            <div className="flex justify-center pb-12">
                <Button variant="outline" className="rounded-xl px-8 border-slate-200 text-slate-600 font-bold">
                    <Icon name="lucide:file-text" className="h-4 w-4 mr-2" /> View Full Audit Logs
                </Button>
            </div>
        </div>
    );
}
