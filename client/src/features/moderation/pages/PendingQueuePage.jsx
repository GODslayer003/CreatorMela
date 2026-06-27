import { useState, useMemo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ChevronDown,
  ChevronUp,
  ChevronsUpDown,
  MoreHorizontal,
  Eye,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Download,
  Filter,
  X,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Checkbox } from '@/components/ui/checkbox';
import {
  SUBMISSION_STATUSES,
  PRIORITIES,
  STATUS_LABELS,
  STATUS_COLORS,
  PRIORITY_LABELS,
  PRIORITY_COLORS,
  SUBMISSION_TYPE_LABELS,
  PAGE_SIZES,
} from '@/constants';
import { formatDate, getInitials, cn } from '@/utils';
import { exportToExcel } from '@/utils/exportExcel';
import { useDebouncedCallback } from '@/hooks/useDebounce';

const mockSubmissions = [
  { _id: '1', title: 'Nike Summer Campaign', type: 'campaign', creatorName: 'Sarah Johnson', creatorAvatar: '', campaignTitle: 'Nike Summer 2024', priority: 'high', status: 'pending', createdAt: '2024-01-15T10:30:00Z', assignedTo: 'Alex M.', tags: ['brand', 'urgent'] },
  { _id: '2', title: 'Creator Profile Update', type: 'creator_profile', creatorName: 'Mike Chen', creatorAvatar: '', priority: 'medium', status: 'pending', createdAt: '2024-01-15T09:15:00Z', tags: ['profile'] },
  { _id: '3', title: 'Product Review Content', type: 'content', creatorName: 'Emma Wilson', creatorAvatar: '', campaignTitle: 'TechGadget Pro', priority: 'low', status: 'under_review', createdAt: '2024-01-14T16:45:00Z', assignedTo: 'Maria S.', tags: ['review', 'tech'] },
  { _id: '4', title: 'Bio Update Request', type: 'bio_update', creatorName: 'James Lee', creatorAvatar: '', priority: 'low', status: 'pending', createdAt: '2024-01-14T14:20:00Z', tags: ['bio'] },
  { _id: '5', title: 'Portfolio Submission', type: 'portfolio', creatorName: 'Sofia Rodriguez', creatorAvatar: '', priority: 'urgent', status: 'changes_requested', createdAt: '2024-01-14T11:00:00Z', assignedTo: 'David K.', tags: ['portfolio', 'creative'] },
  { _id: '6', title: 'Ad Campaign Approval', type: 'campaign', creatorName: 'Alex Thompson', creatorAvatar: '', campaignTitle: 'Holiday Special', priority: 'high', status: 'pending', createdAt: '2024-01-13T15:30:00Z', tags: ['holiday', 'brand'] },
  { _id: '7', title: 'Creator Verification', type: 'creator_profile', creatorName: 'Lisa Park', creatorAvatar: '', priority: 'medium', status: 'pending', createdAt: '2024-01-13T12:10:00Z', tags: ['verification'] },
  { _id: '8', title: 'Social Media Content', type: 'content', creatorName: 'David Kim', creatorAvatar: '', campaignTitle: 'FitnessBrand', priority: 'medium', status: 'under_review', createdAt: '2024-01-12T09:45:00Z', assignedTo: 'Alex M.', tags: ['social', 'fitness'] },
];

export default function PendingQueuePage() {
  const navigate = useNavigate();
  const [submissions] = useState(mockSubmissions);
  const [selectedIds, setSelectedIds] = useState([]);
  const [sortField, setSortField] = useState('createdAt');
  const [sortOrder, setSortOrder] = useState('desc');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [statusFilter, setStatusFilter] = useState([]);
  const [priorityFilter, setPriorityFilter] = useState([]);
  const [bulkDialogOpen, setBulkDialogOpen] = useState(false);
  const [bulkAction, setBulkAction] = useState('');

  const debouncedSearch = useDebouncedCallback((value) => {
    setSearchQuery(value);
    setCurrentPage(1);
  }, 300);

  const filteredSubmissions = useMemo(() => {
    let result = [...submissions];

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (s) =>
          s.title.toLowerCase().includes(query) ||
          s.creatorName.toLowerCase().includes(query) ||
          s.tags.some((t) => t.toLowerCase().includes(query)),
      );
    }

    if (statusFilter.length > 0) {
      result = result.filter((s) => statusFilter.includes(s.status));
    }

    if (priorityFilter.length > 0) {
      result = result.filter((s) => priorityFilter.includes(s.priority));
    }

    result.sort((a, b) => {
      const aVal = a[sortField];
      const bVal = b[sortField];
      const comparison = String(aVal).localeCompare(String(bVal));
      return sortOrder === 'asc' ? comparison : -comparison;
    });

    return result;
  }, [submissions, searchQuery, statusFilter, priorityFilter, sortField, sortOrder]);

  const paginatedSubmissions = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredSubmissions.slice(start, start + pageSize);
  }, [filteredSubmissions, currentPage, pageSize]);

  const totalPages = Math.ceil(filteredSubmissions.length / pageSize);

  const handleSort = useCallback(
    (field) => {
      if (sortField === field) {
        setSortOrder((prev) => (prev === 'asc' ? 'desc' : 'asc'));
      } else {
        setSortField(field);
        setSortOrder('asc');
      }
    },
    [sortField],
  );

  const handleSelectAll = useCallback(
    (checked) => {
      if (checked) {
        setSelectedIds(paginatedSubmissions.map((s) => s._id));
      } else {
        setSelectedIds([]);
      }
    },
    [paginatedSubmissions],
  );

  const handleSelectRow = useCallback((id, checked) => {
    if (checked) {
      setSelectedIds((prev) => [...prev, id]);
    } else {
      setSelectedIds((prev) => prev.filter((i) => i !== id));
    }
  }, []);

  const handleBulkAction = useCallback((action) => {
    setBulkAction(action);
    setBulkDialogOpen(true);
  }, []);

  const handleExport = useCallback(() => {
    exportToExcel(filteredSubmissions, 'moderation-queue');
  }, [filteredSubmissions]);

  const SortIcon = ({ field }) => {
    if (sortField !== field) return <ChevronsUpDown className="h-3.5 w-3.5" />;
    return sortOrder === 'asc' ? (
      <ChevronUp className="h-3.5 w-3.5" />
    ) : (
      <ChevronDown className="h-3.5 w-3.5" />
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Pending Queue</h1>
          <p className="text-sm text-muted-foreground mt-1">
            {filteredSubmissions.length} submissions awaiting review
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" size="sm" onClick={handleExport}>
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
        </div>
      </div>

      <Card>
        <CardContent className="p-0">
          <div className="border-b p-4">
            <div className="flex items-center gap-3">
              <div className="flex-1">
                <Input
                  placeholder="Search submissions..."
                  onChange={(e) => debouncedSearch(e.target.value)}
                  className="max-w-sm"
                />
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowFilters(!showFilters)}
                className={cn(showFilters && 'bg-accent')}
              >
                <Filter className="mr-2 h-4 w-4" />
                Filters
                {(statusFilter.length > 0 || priorityFilter.length > 0) && (
                  <Badge variant="secondary" className="ml-2 h-5 min-w-5 px-1">
                    {statusFilter.length + priorityFilter.length}
                  </Badge>
                )}
              </Button>
            </div>

            {showFilters && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="mt-4 flex flex-wrap gap-4"
              >
                <div className="space-y-2">
                  <label className="text-xs font-medium text-muted-foreground">Status</label>
                  <div className="flex flex-wrap gap-1">
                    {Object.values(SUBMISSION_STATUSES).map((status) => (
                      <Badge
                        key={status}
                        variant={statusFilter.includes(status) ? 'default' : 'outline'}
                        className="cursor-pointer"
                        onClick={() => {
                          setStatusFilter((prev) =>
                            prev.includes(status)
                              ? prev.filter((s) => s !== status)
                              : [...prev, status],
                          );
                          setCurrentPage(1);
                        }}
                      >
                        {STATUS_LABELS[status]}
                      </Badge>
                    ))}
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-medium text-muted-foreground">Priority</label>
                  <div className="flex flex-wrap gap-1">
                    {Object.values(PRIORITIES).map((priority) => (
                      <Badge
                        key={priority}
                        variant={priorityFilter.includes(priority) ? 'default' : 'outline'}
                        className="cursor-pointer"
                        onClick={() => {
                          setPriorityFilter((prev) =>
                            prev.includes(priority)
                              ? prev.filter((p) => p !== priority)
                              : [...prev, priority],
                          );
                          setCurrentPage(1);
                        }}
                      >
                        {PRIORITY_LABELS[priority]}
                      </Badge>
                    ))}
                  </div>
                </div>
                {(statusFilter.length > 0 || priorityFilter.length > 0) && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setStatusFilter([]);
                      setPriorityFilter([]);
                      setCurrentPage(1);
                    }}
                  >
                    <X className="mr-1 h-3 w-3" />
                    Clear
                  </Button>
                )}
              </motion.div>
            )}
          </div>

          {selectedIds.length > 0 && (
            <div className="flex items-center gap-3 border-b bg-muted/50 px-4 py-2.5">
              <span className="text-sm text-muted-foreground">
                {selectedIds.length} selected
              </span>
              <div className="flex items-center gap-2">
                <Button size="sm" variant="success" onClick={() => handleBulkAction('approve')}>
                  <CheckCircle2 className="mr-1 h-3 w-3" />
                  Approve
                </Button>
                <Button size="sm" variant="destructive" onClick={() => handleBulkAction('reject')}>
                  <XCircle className="mr-1 h-3 w-3" />
                  Reject
                </Button>
                <Button size="sm" variant="warning" onClick={() => handleBulkAction('changes')}>
                  <AlertTriangle className="mr-1 h-3 w-3" />
                  Request Changes
                </Button>
              </div>
            </div>
          )}

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b bg-muted/30">
                  <th className="w-12 px-4 py-3">
                    <Checkbox
                      checked={
                        paginatedSubmissions.length > 0 &&
                        selectedIds.length === paginatedSubmissions.length
                      }
                      onCheckedChange={(checked) => handleSelectAll(checked === true)}
                    />
                  </th>
                  {[
                    { field: 'title', label: 'Submission' },
                    { field: 'type', label: 'Type' },
                    { field: 'priority', label: 'Priority' },
                    { field: 'status', label: 'Status' },
                    { field: 'createdAt', label: 'Submitted' },
                    { field: 'assignedTo', label: 'Reviewer' },
                  ].map((col) => (
                    <th
                      key={col.field}
                      className="px-4 py-3 text-left text-xs font-medium text-muted-foreground cursor-pointer hover:text-foreground transition-colors"
                      onClick={() => handleSort(col.field)}
                    >
                      <div className="flex items-center gap-1.5">
                        {col.label}
                        <SortIcon field={col.field} />
                      </div>
                    </th>
                  ))}
                  <th className="w-12 px-4 py-3" />
                </tr>
              </thead>
              <tbody>
                {paginatedSubmissions.map((submission) => (
                  <tr
                    key={submission._id}
                    className={cn(
                      'border-b transition-colors hover:bg-muted/50',
                      selectedIds.includes(submission._id) && 'bg-muted/30',
                    )}
                  >
                    <td className="px-4 py-3">
                      <Checkbox
                        checked={selectedIds.includes(submission._id)}
                        onCheckedChange={(checked) =>
                          handleSelectRow(submission._id, checked === true)
                        }
                      />
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={submission.creatorAvatar} />
                          <AvatarFallback className="text-xs">
                            {getInitials(submission.creatorName)}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="text-sm font-medium">{submission.title}</p>
                          <p className="text-xs text-muted-foreground">{submission.creatorName}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-sm text-muted-foreground">
                        {SUBMISSION_TYPE_LABELS[submission.type]}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <Badge className={PRIORITY_COLORS[submission.priority]}>
                        {PRIORITY_LABELS[submission.priority]}
                      </Badge>
                    </td>
                    <td className="px-4 py-3">
                      <Badge className={STATUS_COLORS[submission.status]}>
                        {STATUS_LABELS[submission.status]}
                      </Badge>
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-sm text-muted-foreground">
                        {formatDate(submission.createdAt)}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-sm text-muted-foreground">
                        {submission.assignedTo || '—'}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon-sm">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem
                            onClick={() => navigate(`/review/${submission._id}`)}
                          >
                            <Eye className="mr-2 h-4 w-4" />
                            Review
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <CheckCircle2 className="mr-2 h-4 w-4" />
                            Approve
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem className="text-red-600">
                            <XCircle className="mr-2 h-4 w-4" />
                            Reject
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="flex items-center justify-between border-t px-4 py-3">
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">Rows per page</span>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm" className="h-8 min-w-[3rem] px-2 text-xs font-normal">
                    {pageSize}
                    <ChevronDown className="ml-1 h-3 w-3 opacity-50" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start" className="min-w-[4rem]">
                  {PAGE_SIZES.map((size) => (
                    <DropdownMenuItem
                      key={size}
                      onSelect={(e) => {
                        e.preventDefault();
                        setPageSize(size);
                        setCurrentPage(1);
                      }}
                      className={cn('text-xs', pageSize === size && 'bg-muted font-medium')}
                    >
                      {size}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-sm text-muted-foreground">
                {(currentPage - 1) * pageSize + 1}-
                {Math.min(currentPage * pageSize, filteredSubmissions.length)} of{' '}
                {filteredSubmissions.length}
              </span>
              <div className="flex items-center gap-1">
                <Button
                  variant="outline"
                  size="icon-sm"
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="icon-sm"
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Dialog open={bulkDialogOpen} onOpenChange={setBulkDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Bulk Action</DialogTitle>
            <DialogDescription>
              You are about to {bulkAction} {selectedIds.length} submission(s). This action can be
              undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setBulkDialogOpen(false)}>
              Cancel
            </Button>
            <Button
              variant={bulkAction === 'reject' ? 'destructive' : 'default'}
              onClick={() => setBulkDialogOpen(false)}
            >
              Confirm {bulkAction}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </motion.div>
  );
}
