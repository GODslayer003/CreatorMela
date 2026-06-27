import { useMemo } from 'react';
import { motion } from 'framer-motion';
import {
  Clock,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  TrendingUp,
  Timer,
  Users,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { formatNumber } from '@/utils';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
} from 'recharts';

const weeklyData = [
  { date: 'Mon', approved: 45, rejected: 12, changesRequested: 8 },
  { date: 'Tue', approved: 52, rejected: 15, changesRequested: 6 },
  { date: 'Wed', approved: 38, rejected: 10, changesRequested: 12 },
  { date: 'Thu', approved: 61, rejected: 18, changesRequested: 9 },
  { date: 'Fri', approved: 48, rejected: 14, changesRequested: 7 },
  { date: 'Sat', approved: 28, rejected: 8, changesRequested: 4 },
  { date: 'Sun', approved: 15, rejected: 5, changesRequested: 3 },
];

const categoryData = [
  { category: 'Creator Profiles', count: 24 },
  { category: 'Campaigns', count: 18 },
  { category: 'Content', count: 31 },
  { category: 'Bio Updates', count: 12 },
  { category: 'Portfolio', count: 8 },
];

const recentActivities = [
  { id: 1, action: 'Approved', submission: 'Nike Campaign by @sarah_design', time: '2 min ago', moderator: 'Alex M.' },
  { id: 2, action: 'Rejected', submission: 'Unauthorized content by @john_doe', time: '5 min ago', moderator: 'Maria S.' },
  { id: 3, action: 'Changes Requested', submission: 'Portfolio update by @creative_studio', time: '12 min ago', moderator: 'Alex M.' },
  { id: 4, action: 'Approved', submission: 'Creator profile by @tech_influencer', time: '18 min ago', moderator: 'David K.' },
  { id: 5, action: 'Approved', submission: 'Campaign brief by @brand_partner', time: '25 min ago', moderator: 'Maria S.' },
];

const actionColors = {
  Approved: 'text-green-600',
  Rejected: 'text-red-600',
  'Changes Requested': 'text-amber-600',
};

export default function DashboardPage() {
  const stats = useMemo(
    () => [
      { title: 'Pending Approvals', value: 142, icon: Clock, change: '+12%', changeType: 'warning' },
      { title: 'Approved Today', value: 38, icon: CheckCircle2, change: '+8%', changeType: 'success' },
      { title: 'Rejected Today', value: 7, icon: XCircle, change: '-2%', changeType: 'success' },
      { title: 'Request Changes', value: 5, icon: AlertTriangle, change: '+3%', changeType: 'warning' },
      { title: 'Approval Rate', value: 84.2, icon: TrendingUp, change: '+2.1%', changeType: 'success', suffix: '%' },
      { title: 'Avg Review Time', value: 4.2, icon: Timer, change: '-0.3min', changeType: 'success', suffix: 'min' },
      { title: 'Active Moderators', value: 8, icon: Users, change: '0', changeType: 'neutral' },
    ],
    [],
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Dashboard</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Overview of your moderation workflow
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={stat.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
            >
              <Card className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <p className="text-sm text-muted-foreground">{stat.title}</p>
                      <p className="text-2xl font-semibold tracking-tight">
                        {typeof stat.value === 'number' && stat.value > 100
                          ? formatNumber(stat.value)
                          : stat.value}
                        {stat.suffix || ''}
                      </p>
                    </div>
                    <div className="rounded-lg bg-muted p-2.5">
                      <Icon className="h-5 w-5 text-muted-foreground" />
                    </div>
                  </div>
                  {stat.change && (
                    <div className="mt-3 flex items-center gap-1.5">
                      <Badge
                        variant={
                          stat.changeType === 'success'
                            ? 'success'
                            : stat.changeType === 'warning'
                              ? 'warning'
                              : 'secondary'
                        }
                        className="text-xs"
                      >
                        {stat.change}
                      </Badge>
                      <span className="text-xs text-muted-foreground">vs last week</span>
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-base font-medium">Weekly Reviews</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={weeklyData}>
                  <defs>
                    <linearGradient id="approved" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#22c55e" stopOpacity={0.1} />
                      <stop offset="95%" stopColor="#22c55e" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="rejected" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#ef4444" stopOpacity={0.1} />
                      <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis dataKey="date" className="text-xs" tick={{ fill: 'hsl(var(--muted-foreground))' }} />
                  <YAxis className="text-xs" tick={{ fill: 'hsl(var(--muted-foreground))' }} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'hsl(var(--card))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px',
                      fontSize: '12px',
                    }}
                  />
                  <Area type="monotone" dataKey="approved" stroke="#22c55e" fillOpacity={1} fill="url(#approved)" />
                  <Area type="monotone" dataKey="rejected" stroke="#ef4444" fillOpacity={1} fill="url(#rejected)" />
                  <Area type="monotone" dataKey="changesRequested" stroke="#f59e0b" fillOpacity={0.3} fill="transparent" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base font-medium">Pending by Category</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={categoryData} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" horizontal={false} />
                  <XAxis type="number" className="text-xs" tick={{ fill: 'hsl(var(--muted-foreground))' }} />
                  <YAxis
                    dataKey="category"
                    type="category"
                    className="text-xs"
                    tick={{ fill: 'hsl(var(--muted-foreground))' }}
                    width={100}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'hsl(var(--card))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px',
                      fontSize: '12px',
                    }}
                  />
                  <Bar dataKey="count" fill="hsl(var(--primary))" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base font-medium">Recent Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentActivities.map((activity) => (
              <div
                key={activity.id}
                className="flex items-center justify-between rounded-lg border p-4 hover:bg-muted/50 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div className={`font-medium text-sm ${actionColors[activity.action] || ''}`}>
                    {activity.action}
                  </div>
                  <div>
                    <p className="text-sm font-medium">{activity.submission}</p>
                    <p className="text-xs text-muted-foreground">
                      by {activity.moderator} · {activity.time}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
