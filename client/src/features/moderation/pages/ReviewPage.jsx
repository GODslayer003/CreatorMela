import { useState, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useKeyboardShortcuts } from '@/hooks/useKeyboardShortcuts';
import {
  ArrowLeft,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  UserPlus,
  Download,
  ExternalLink,
  Copy,
  Share2,
  Clock,
  Tag,
  MessageSquare,
  FileText,
  Send,
  Loader2,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import {
  STATUS_LABELS,
  STATUS_COLORS,
  PRIORITY_LABELS,
  PRIORITY_COLORS,
  SUBMISSION_TYPE_LABELS,
} from '@/constants';
import { formatDate, formatDateTime, getInitials, cn, copyToClipboard } from '@/utils';
import { toast } from 'sonner';

const mockReviewData = {
  _id: '1',
  title: 'Nike Summer Campaign',
  description:
    'This is a comprehensive summer campaign partnership with Nike featuring athletic wear and lifestyle products. The campaign includes social media posts, YouTube videos, and Instagram stories.',
  type: 'campaign',
  status: 'pending',
  priority: 'high',
  riskScore: 35,
  creator: {
    name: 'Sarah Johnson',
    email: 'sarah@example.com',
    avatar: '',
    bio: 'Fitness enthusiast and lifestyle content creator with 5 years of experience in brand partnerships.',
    category: 'Fitness & Lifestyle',
    followers: 245000,
    platforms: ['Instagram', 'YouTube', 'TikTok'],
    isVerified: true,
  },
  campaign: {
    title: 'Nike Summer 2024',
    brand: 'Nike',
    budget: 25000,
    startDate: '2024-06-01',
    endDate: '2024-08-31',
  },
  content: {
    text: 'Excited to announce my partnership with Nike for their Summer 2024 collection! Stay tuned for amazing content featuring the latest athletic wear.',
    mediaUrls: [],
    links: ['https://nike.com/summer-2024', 'https://instagram.com/p/example'],
  },
  tags: ['brand', 'urgent', 'fitness', 'lifestyle'],
  createdAt: '2024-01-15T10:30:00Z',
  updatedAt: '2024-01-15T10:30:00Z',
};

export default function ReviewPage() {
  const { id: _id } = useParams();
  const navigate = useNavigate();
  const [review] = useState(mockReviewData);
  const [actionDialogOpen, setActionDialogOpen] = useState(false);
  const [actionType, setActionType] = useState('approve');
  const [actionNote, setActionNote] = useState('');
  const [actionReason, setActionReason] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [comment, setComment] = useState('');
  const [activeTab, setActiveTab] = useState('details');

  const handleAction = useCallback(
    (type) => {
      setActionType(type);
      setActionNote('');
      setActionReason('');
      setActionDialogOpen(true);
    },
    [],
  );

  useKeyboardShortcuts({
    a: () => handleAction('approve'),
    r: () => handleAction('reject'),
    c: () => handleAction('changes'),
  });

  const confirmAction = useCallback(async () => {
    setIsSubmitting(true);
    await new Promise((r) => setTimeout(r, 1000));
    setIsSubmitting(false);
    setActionDialogOpen(false);
    toast.success(`Submission ${actionType === 'approve' ? 'approved' : actionType === 'reject' ? 'rejected' : 'changes requested'} successfully`);
    navigate('/queue');
  }, [actionType, navigate]);

  const handleCopyLink = useCallback(() => {
    copyToClipboard(window.location.href);
    toast.success('Link copied to clipboard');
  }, []);

  const getRiskScoreColor = (score) => {
    if (score < 30) return 'text-green-600 bg-green-50 dark:bg-green-900/20';
    if (score < 70) return 'text-amber-600 bg-amber-50 dark:bg-amber-900/20';
    return 'text-red-600 bg-red-50 dark:bg-red-900/20';
  };

  const tabs = [
    { id: 'details', label: 'Details', icon: FileText },
    { id: 'history', label: 'History', icon: Clock },
    { id: 'comments', label: 'Comments', icon: MessageSquare },
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.2 }}
      className="flex h-[calc(100vh-4rem)] flex-col"
    >
      <div className="flex items-center gap-4 border-b px-6 py-3">
        <Button variant="ghost" size="icon-sm" onClick={() => navigate('/queue')}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div className="flex-1">
          <h1 className="text-lg font-semibold">{review.title}</h1>
          <p className="text-sm text-muted-foreground">
            Submitted {formatDateTime(review.createdAt)}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge className={PRIORITY_COLORS[review.priority]}>
            {PRIORITY_LABELS[review.priority]}
          </Badge>
          <Badge className={STATUS_COLORS[review.status]}>
            {STATUS_LABELS[review.status]}
          </Badge>
          <div
            className={cn(
              'flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium',
              getRiskScoreColor(review.riskScore),
            )}
          >
            Risk: {review.riskScore}%
          </div>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        <div className="flex-1 overflow-y-auto scrollbar-thin">
          <div className="p-6">
            <div className="flex gap-1 border-b mb-6">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={cn(
                      'flex items-center gap-2 px-4 py-2.5 text-sm font-medium border-b-2 transition-colors -mb-px',
                      activeTab === tab.id
                        ? 'border-primary text-foreground'
                        : 'border-transparent text-muted-foreground hover:text-foreground',
                    )}
                  >
                    <Icon className="h-4 w-4" />
                    {tab.label}
                  </button>
                );
              })}
            </div>

            <AnimatePresence mode="wait">
              {activeTab === 'details' && (
                <motion.div
                  key="details"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="space-y-6"
                >
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base">Creator Information</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-start gap-4">
                        <Avatar className="h-12 w-12">
                          <AvatarImage src={review.creator.avatar} />
                          <AvatarFallback>
                            {getInitials(review.creator.name)}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 space-y-2">
                          <div className="flex items-center gap-2">
                            <h3 className="font-medium">{review.creator.name}</h3>
                            {review.creator.isVerified && (
                              <Badge variant="info" className="text-xs">Verified</Badge>
                            )}
                          </div>
                          <p className="text-sm text-muted-foreground">{review.creator.email}</p>
                          <p className="text-sm">{review.creator.bio}</p>
                          <div className="flex flex-wrap gap-2 pt-2">
                            <Badge variant="outline">{review.creator.category}</Badge>
                            <Badge variant="outline">
                              {review.creator.followers.toLocaleString()} followers
                            </Badge>
                            {review.creator.platforms.map((p) => (
                              <Badge key={p} variant="secondary">{p}</Badge>
                            ))}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {review.campaign && (
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-base">Campaign Details</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <Label className="text-xs text-muted-foreground">Campaign</Label>
                            <p className="font-medium">{review.campaign.title}</p>
                          </div>
                          <div>
                            <Label className="text-xs text-muted-foreground">Brand</Label>
                            <p className="font-medium">{review.campaign.brand}</p>
                          </div>
                          <div>
                            <Label className="text-xs text-muted-foreground">Budget</Label>
                            <p className="font-medium">
                              ${review.campaign.budget.toLocaleString()}
                            </p>
                          </div>
                          <div>
                            <Label className="text-xs text-muted-foreground">Duration</Label>
                            <p className="font-medium">
                              {formatDate(review.campaign.startDate)} -{' '}
                              {formatDate(review.campaign.endDate)}
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  )}

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base">Submission Content</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {review.content.text && (
                        <p className="text-sm leading-relaxed">{review.content.text}</p>
                      )}
                      {review.content.links.length > 0 && (
                        <div className="space-y-2">
                          <Label className="text-xs text-muted-foreground">Links</Label>
                          {review.content.links.map((link, i) => (
                            <div key={i} className="flex items-center gap-2">
                              <ExternalLink className="h-3 w-3 text-muted-foreground" />
                              <a
                                href={link}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-sm text-blue-600 hover:underline"
                              >
                                {link}
                              </a>
                            </div>
                          ))}
                        </div>
                      )}
                      <div className="flex flex-wrap gap-1.5 pt-2">
                        {review.tags.map((tag) => (
                          <Badge key={tag} variant="outline" className="text-xs">
                            <Tag className="mr-1 h-3 w-3" />
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              )}

              {activeTab === 'history' && (
                <motion.div
                  key="history"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                >
                  <Card>
                    <CardContent className="p-6">
                      <div className="space-y-6">
                        {[
                          { time: review.createdAt, action: 'Submitted', user: 'System', icon: Clock },
                          { time: review.createdAt, action: 'Assigned to Alex M.', user: 'System', icon: UserPlus },
                          { time: review.createdAt, action: 'Viewed by Alex M.', user: 'Alex M.', icon: FileText },
                        ].map((event, i) => (
                          <div key={i} className="flex gap-4">
                            <div className="flex flex-col items-center">
                              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-muted">
                                <event.icon className="h-4 w-4 text-muted-foreground" />
                              </div>
                              {i < 2 && <div className="w-px flex-1 bg-border mt-2" />}
                            </div>
                            <div className="flex-1 pb-6">
                              <p className="text-sm font-medium">{event.action}</p>
                              <p className="text-xs text-muted-foreground">
                                {event.user} · {formatDateTime(event.time)}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              )}

              {activeTab === 'comments' && (
                <motion.div
                  key="comments"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                >
                  <Card>
                    <CardContent className="p-6">
                      <div className="space-y-4">
                        <div className="flex gap-3">
                          <Avatar className="h-8 w-8">
                            <AvatarFallback>AM</AvatarFallback>
                          </Avatar>
                          <div className="flex-1 rounded-lg border p-3">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="text-sm font-medium">Alex M.</span>
                              <span className="text-xs text-muted-foreground">2 hours ago</span>
                            </div>
                            <p className="text-sm">
                              Creator has a strong portfolio. Campaign looks legitimate. Recommend
                              approval.
                            </p>
                          </div>
                        </div>
                      </div>
                      <Separator className="my-4" />
                      <div className="flex gap-3">
                        <Avatar className="h-8 w-8">
                          <AvatarFallback>You</AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <Textarea
                            placeholder="Add a comment..."
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                            className="min-h-[80px]"
                          />
                          <div className="flex justify-end mt-2">
                            <Button size="sm" disabled={!comment.trim()}>
                              <Send className="mr-2 h-3 w-3" />
                              Send
                            </Button>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        <div className="w-80 border-l bg-muted/30 p-4 flex flex-col">
          <div className="space-y-4 flex-1">
            <h3 className="font-medium text-sm">Actions</h3>

            <Button
              className="w-full justify-start"
              variant="success"
              onClick={() => handleAction('approve')}
            >
              <CheckCircle2 className="mr-2 h-4 w-4" />
              Approve
            </Button>
            <Button
              className="w-full justify-start"
              variant="destructive"
              onClick={() => handleAction('reject')}
            >
              <XCircle className="mr-2 h-4 w-4" />
              Reject
            </Button>
            <Button
              className="w-full justify-start"
              variant="warning"
              onClick={() => handleAction('changes')}
            >
              <AlertTriangle className="mr-2 h-4 w-4" />
              Request Changes
            </Button>

            <Separator />

            <Button className="w-full justify-start" variant="ghost" size="sm">
              <UserPlus className="mr-2 h-4 w-4" />
              Assign Reviewer
            </Button>
            <Button className="w-full justify-start" variant="ghost" size="sm">
              <Download className="mr-2 h-4 w-4" />
              Download
            </Button>
            <Button className="w-full justify-start" variant="ghost" size="sm" onClick={handleCopyLink}>
              <Copy className="mr-2 h-4 w-4" />
              Copy Link
            </Button>
            <Button className="w-full justify-start" variant="ghost" size="sm">
              <Share2 className="mr-2 h-4 w-4" />
              Share
            </Button>

            <Separator />

            <div className="space-y-2">
              <h4 className="text-xs font-medium text-muted-foreground">Internal Notes</h4>
              <Textarea placeholder="Add private notes..." className="min-h-[100px] text-sm" />
              <Button variant="outline" size="sm" className="w-full">
                Save Note
              </Button>
            </div>

            <Separator />

            <div className="space-y-2">
              <h4 className="text-xs font-medium text-muted-foreground">Reviewer Workload</h4>
              <div className="space-y-2">
                {[
                  { name: 'Alex M.', count: 12, max: 20 },
                  { name: 'Maria S.', count: 8, max: 20 },
                  { name: 'David K.', count: 15, max: 20 },
                ].map((reviewer) => (
                  <div key={reviewer.name} className="space-y-1">
                    <div className="flex justify-between text-xs">
                      <span>{reviewer.name}</span>
                      <span className="text-muted-foreground">
                        {reviewer.count}/{reviewer.max}
                      </span>
                    </div>
                    <div className="h-1.5 rounded-full bg-muted overflow-hidden">
                      <div
                        className="h-full rounded-full bg-primary"
                        style={{ width: `${(reviewer.count / reviewer.max) * 100}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="border-t pt-4 mt-4">
            <div className="text-xs text-muted-foreground space-y-1">
              <div className="flex justify-between">
                <span>Created</span>
                <span>{formatDateTime(review.createdAt)}</span>
              </div>
              <div className="flex justify-between">
                <span>Updated</span>
                <span>{formatDateTime(review.updatedAt)}</span>
              </div>
              <div className="flex justify-between">
                <span>Type</span>
                <span>{SUBMISSION_TYPE_LABELS[review.type]}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Dialog open={actionDialogOpen} onOpenChange={setActionDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {actionType === 'approve'
                ? 'Approve Submission'
                : actionType === 'reject'
                  ? 'Reject Submission'
                  : 'Request Changes'}
            </DialogTitle>
            <DialogDescription>
              {actionType === 'approve'
                ? 'This submission will be marked as approved.'
                : actionType === 'reject'
                  ? 'Please provide a reason for rejection.'
                  : 'Please describe what changes are needed.'}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            {actionType !== 'approve' && (
              <div className="space-y-2">
                <Label>
                  Reason <span className="text-destructive">*</span>
                </Label>
                <Textarea
                  placeholder="Enter reason..."
                  value={actionReason}
                  onChange={(e) => setActionReason(e.target.value)}
                />
              </div>
            )}
            <div className="space-y-2">
              <Label>Note (optional)</Label>
              <Textarea
                placeholder="Add a note..."
                value={actionNote}
                onChange={(e) => setActionNote(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setActionDialogOpen(false)}>
              Cancel
            </Button>
            <Button
              variant={actionType === 'reject' ? 'destructive' : 'default'}
              onClick={confirmAction}
              disabled={
                isSubmitting ||
                (actionType !== 'approve' && !actionReason.trim())
              }
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Processing...
                </>
              ) : (
                `Confirm ${
                  actionType === 'approve'
                    ? 'Approval'
                    : actionType === 'reject'
                      ? 'Rejection'
                      : 'Changes'
                }`
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </motion.div>
  );
}
