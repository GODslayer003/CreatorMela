import { useState } from 'react';
import { motion } from 'framer-motion';
import { Check, CheckCheck } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { formatRelativeTime } from '@/utils';

const mockNotifications = [
  { _id: '1', title: 'New submission', message: 'Nike Summer Campaign requires review', type: 'info', isRead: false, time: '2024-01-15T16:30:00Z' },
  { _id: '2', title: 'Submission approved', message: 'TechGadget Review has been approved', type: 'success', isRead: false, time: '2024-01-15T15:45:00Z' },
  { _id: '3', title: 'Changes requested', message: 'Portfolio Update needs revisions', type: 'warning', isRead: true, time: '2024-01-15T14:20:00Z' },
  { _id: '4', title: 'Assignment', message: 'You have been assigned Creator Profile', type: 'info', isRead: true, time: '2024-01-15T12:00:00Z' },
  { _id: '5', title: 'System update', message: 'Scheduled maintenance at 2 AM UTC', type: 'info', isRead: true, time: '2024-01-14T10:00:00Z' },
];

const typeColors: Record<string, string> = {
  success: 'bg-green-500',
  error: 'bg-red-500',
  warning: 'bg-amber-500',
  info: 'bg-blue-500',
};

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState(mockNotifications);

  const markAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n._id === id ? { ...n, isRead: true } : n)),
    );
  };

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Notifications</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Stay updated on moderation activities
          </p>
        </div>
        <Button variant="outline" size="sm" onClick={markAllAsRead}>
          <CheckCheck className="mr-2 h-4 w-4" />
          Mark all as read
        </Button>
      </div>

      <div className="space-y-2">
        {notifications.map((notification, index) => (
          <motion.div
            key={notification._id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
          >
            <Card
              className={`cursor-pointer transition-colors hover:shadow-md ${
                !notification.isRead ? 'border-l-4 border-l-primary' : ''
              }`}
              onClick={() => markAsRead(notification._id)}
            >
              <CardContent className="p-4">
                <div className="flex items-start gap-4">
                  <div className={`mt-1 h-2 w-2 rounded-full ${typeColors[notification.type]}`} />
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <p className="font-medium text-sm">{notification.title}</p>
                      {!notification.isRead && (
                        <Badge variant="info" className="text-xs">New</Badge>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground mt-0.5">
                      {notification.message}
                    </p>
                    <p className="text-xs text-muted-foreground mt-2">
                      {formatRelativeTime(notification.time)}
                    </p>
                  </div>
                  {!notification.isRead && (
                    <Button
                      variant="ghost"
                      size="icon-sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        markAsRead(notification._id);
                      }}
                    >
                      <Check className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
