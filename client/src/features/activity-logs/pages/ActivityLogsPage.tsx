import { useState } from 'react';
import { motion } from 'framer-motion';
import { Filter } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { formatDateTime, getInitials } from '@/utils';

const mockLogs = [
  { _id: '1', action: 'approved', entity: 'Nike Summer Campaign', user: 'Alex M.', time: '2024-01-15T16:30:00Z', ip: '192.168.1.1' },
  { _id: '2', action: 'rejected', entity: 'Unauthorized Content', user: 'Maria S.', time: '2024-01-15T15:45:00Z', ip: '192.168.1.2' },
  { _id: '3', action: 'changes_requested', entity: 'Portfolio Update', user: 'David K.', time: '2024-01-15T14:20:00Z', ip: '192.168.1.3' },
  { _id: '4', action: 'viewed', entity: 'TechGadget Review', user: 'Alex M.', time: '2024-01-15T13:10:00Z', ip: '192.168.1.1' },
  { _id: '5', action: 'assigned', entity: 'Creator Profile', user: 'System', time: '2024-01-15T12:00:00Z', ip: '-' },
  { _id: '6', action: 'login', entity: 'Login', user: 'Alex M.', time: '2024-01-15T09:00:00Z', ip: '192.168.1.1' },
  { _id: '7', action: 'approved', entity: 'Spring Collection', user: 'Maria S.', time: '2024-01-14T17:30:00Z', ip: '192.168.1.2' },
  { _id: '8', action: 'bulk_action', entity: '15 Submissions', user: 'David K.', time: '2024-01-14T16:00:00Z', ip: '192.168.1.3' },
];

const actionColors: Record<string, string> = {
  approved: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
  rejected: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400',
  changes_requested: 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400',
  viewed: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400',
  assigned: 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400',
  login: 'bg-slate-100 text-slate-800 dark:bg-slate-900/30 dark:text-slate-400',
  bulk_action: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-400',
  logout: 'bg-slate-100 text-slate-800 dark:bg-slate-900/30 dark:text-slate-400',
  created: 'bg-teal-100 text-teal-800 dark:bg-teal-900/30 dark:text-teal-400',
  profile_update: 'bg-cyan-100 text-cyan-800 dark:bg-cyan-900/30 dark:text-cyan-400',
};

const actionLabels: Record<string, string> = {
  approved: 'Approved',
  rejected: 'Rejected',
  changes_requested: 'Changes Requested',
  viewed: 'Viewed',
  assigned: 'Assigned',
  login: 'Login',
  bulk_action: 'Bulk Action',
  logout: 'Logout',
  created: 'Created',
  profile_update: 'Profile Update',
};

export default function ActivityLogsPage() {
  const [searchQuery, setSearchQuery] = useState('');

  const filtered = mockLogs.filter(
    (log) =>
      log.entity.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.user.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Activity Logs</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Complete audit trail of all actions
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Input
            placeholder="Search logs..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-64"
          />
          <Button variant="outline" size="sm">
            <Filter className="mr-2 h-4 w-4" />
            Filter
          </Button>
        </div>
      </div>

      <Card>
        <CardContent className="p-0">
          <div className="divide-y">
            {filtered.map((log, index) => (
              <motion.div
                key={log._id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.03 }}
                className="flex items-center gap-4 px-6 py-4 hover:bg-muted/50 transition-colors"
              >
                <Avatar className="h-8 w-8">
                  <AvatarFallback className="text-xs">
                    {getInitials(log.user)}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <Badge className={actionColors[log.action] || ''}>
                      {actionLabels[log.action] || log.action}
                    </Badge>
                    <span className="text-sm font-medium truncate">{log.entity}</span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    by {log.user} · IP: {log.ip}
                  </p>
                </div>
                <span className="text-xs text-muted-foreground whitespace-nowrap">
                  {formatDateTime(log.time)}
                </span>
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
