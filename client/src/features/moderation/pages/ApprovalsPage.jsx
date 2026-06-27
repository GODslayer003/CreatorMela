import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CheckCircle2, Eye } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { formatDate, getInitials } from '@/utils';
import { STATUS_COLORS, PRIORITY_COLORS, STATUS_LABELS, PRIORITY_LABELS } from '@/constants';

const mockApprovals = [
  { _id: '1', title: 'Adidas Winter Campaign', creatorName: 'Tom Harris', status: 'approved', priority: 'high', createdAt: '2024-01-15T14:00:00Z', reviewedAt: '2024-01-15T16:30:00Z' },
  { _id: '2', title: 'TechGadget Review', creatorName: 'Nina Patel', status: 'approved', priority: 'medium', createdAt: '2024-01-14T10:00:00Z', reviewedAt: '2024-01-14T12:15:00Z' },
  { _id: '3', title: 'Creator Profile - Verified', creatorName: 'Jake Miller', status: 'approved', priority: 'low', createdAt: '2024-01-13T09:00:00Z', reviewedAt: '2024-01-13T09:45:00Z' },
  { _id: '4', title: 'Spring Collection Content', creatorName: 'Anna Lee', status: 'rejected', priority: 'medium', createdAt: '2024-01-12T11:00:00Z', reviewedAt: '2024-01-12T14:20:00Z' },
  { _id: '5', title: 'Bio Update - Professional', creatorName: 'Chris Wong', status: 'approved', priority: 'low', createdAt: '2024-01-11T15:00:00Z', reviewedAt: '2024-01-11T15:30:00Z' },
];

export default function ApprovalsPage() {
  const navigate = useNavigate();
  const [filter, setFilter] = useState('all');

  const filtered = mockApprovals.filter((a) => filter === 'all' || a.status === filter);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Approvals</h1>
          <p className="text-sm text-muted-foreground mt-1">Review history and decisions</p>
        </div>
        <div className="flex items-center gap-2">
          <Input placeholder="Search approvals..." className="w-64" />
        </div>
      </div>

      <div className="flex gap-2">
        {(['all', 'approved', 'rejected']).map((f) => (
          <Button
            key={f}
            variant={filter === f ? 'default' : 'outline'}
            size="sm"
            onClick={() => setFilter(f)}
          >
            {f === 'all' ? 'All' : f === 'approved' ? 'Approved' : 'Rejected'}
          </Button>
        ))}
      </div>

      <div className="space-y-3">
        {filtered.map((item) => (
          <Card key={item._id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <Avatar className="h-10 w-10">
                    <AvatarFallback>{getInitials(item.creatorName)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium">{item.title}</p>
                    <p className="text-sm text-muted-foreground">{item.creatorName}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Badge className={PRIORITY_COLORS[item.priority]}>
                    {PRIORITY_LABELS[item.priority]}
                  </Badge>
                  <Badge className={STATUS_COLORS[item.status]}>
                    {item.status === 'approved' ? (
                      <CheckCircle2 className="mr-1 h-3 w-3" />
                    ) : null}
                    {STATUS_LABELS[item.status]}
                  </Badge>
                  <span className="text-xs text-muted-foreground">
                    {formatDate(item.reviewedAt)}
                  </span>
                  <Button
                    variant="ghost"
                    size="icon-sm"
                    onClick={() => navigate(`/review/${item._id}`)}
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </motion.div>
  );
}
