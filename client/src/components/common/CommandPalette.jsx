import { useState, useCallback, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search,
  LayoutDashboard,
  Clock,
  CheckCircle2,
  Activity,
  Settings,
  User,
  Bell,
  ArrowRight,
} from 'lucide-react';
import { useAppDispatch, useAppSelector } from '@/hooks/useRedux';
import { setCommandPaletteOpen } from '@/store/slices/uiSlice';
import { cn } from '@/utils';
import { Input } from '@/components/ui/input';

const commandItems = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, href: '/dashboard', keywords: ['home', 'overview'] },
  { id: 'queue', label: 'Pending Queue', icon: Clock, href: '/queue', keywords: ['pending', 'review', 'moderate'] },
  { id: 'approvals', label: 'Approvals', icon: CheckCircle2, href: '/approvals', keywords: ['approved', 'completed'] },
  { id: 'activity', label: 'Activity Logs', icon: Activity, href: '/activity-logs', keywords: ['history', 'audit'] },
  { id: 'notifications', label: 'Notifications', icon: Bell, href: '/notifications', keywords: ['alerts', 'messages'] },
  { id: 'profile', label: 'Profile', icon: User, href: '/profile', keywords: ['account', 'user'] },
  { id: 'settings', label: 'Settings', icon: Settings, href: '/settings', keywords: ['preferences', 'config'] },
];

export function CommandPalette() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { commandPaletteOpen } = useAppSelector((state) => state.ui);
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef(null);

  const filteredItems = commandItems.filter((item) => {
    const searchStr = `${item.label} ${item.description || ''} ${item.keywords.join(' ')}`.toLowerCase();
    return searchStr.includes(query.toLowerCase());
  });

  const handleSelect = useCallback(
    (href) => {
      navigate(href);
      dispatch(setCommandPaletteOpen(false));
      setQuery('');
      setSelectedIndex(0);
    },
    [navigate, dispatch],
  );

  const handleKeyDown = useCallback(
    (e) => {
      switch (e.key) {
        case 'ArrowDown':
          e.preventDefault();
          setSelectedIndex((prev) => (prev + 1) % filteredItems.length);
          break;
        case 'ArrowUp':
          e.preventDefault();
          setSelectedIndex((prev) => (prev - 1 + filteredItems.length) % filteredItems.length);
          break;
        case 'Enter':
          e.preventDefault();
          if (filteredItems[selectedIndex]) {
            handleSelect(filteredItems[selectedIndex].href);
          }
          break;
        case 'Escape':
          dispatch(setCommandPaletteOpen(false));
          setQuery('');
          setSelectedIndex(0);
          break;
      }
    },
    [filteredItems, selectedIndex, handleSelect, dispatch],
  );

  useEffect(() => {
    if (commandPaletteOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [commandPaletteOpen]);

  useEffect(() => {
    setSelectedIndex(0);
  }, [query]);

  return (
    <AnimatePresence>
      {commandPaletteOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm"
            onClick={() => {
              dispatch(setCommandPaletteOpen(false));
              setQuery('');
            }}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -20 }}
            transition={{ duration: 0.15 }}
            className="fixed left-1/2 top-1/4 z-50 w-full max-w-lg -translate-x-1/2"
          >
            <div className="rounded-xl border bg-background shadow-2xl overflow-hidden">
              <div className="flex items-center border-b px-4">
                <Search className="h-4 w-4 text-muted-foreground" />
                <Input
                  ref={inputRef}
                  placeholder="Type a command or search..."
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onKeyDown={handleKeyDown}
                  className="border-0 focus-visible:ring-0 focus-visible:ring-offset-0 h-12"
                />
              </div>
              <div className="max-h-80 overflow-y-auto p-2 scrollbar-thin">
                {filteredItems.length === 0 ? (
                  <div className="py-6 text-center text-sm text-muted-foreground">
                    No results found.
                  </div>
                ) : (
                  filteredItems.map((item, index) => {
                    const Icon = item.icon;
                    return (
                      <button
                        key={item.id}
                        onClick={() => handleSelect(item.href)}
                        onMouseEnter={() => setSelectedIndex(index)}
                        className={cn(
                          'flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors',
                          selectedIndex === index
                            ? 'bg-accent text-accent-foreground'
                            : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground',
                        )}
                      >
                        <Icon className="h-4 w-4 shrink-0" />
                        <div className="flex-1 text-left">
                          <div className="font-medium">{item.label}</div>
                          {item.description && (
                            <div className="text-xs text-muted-foreground">{item.description}</div>
                          )}
                        </div>
                        <ArrowRight className="h-3 w-3 opacity-0 group-hover:opacity-100" />
                      </button>
                    );
                  })
                )}
              </div>
              <div className="border-t px-4 py-2">
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span>Navigate with ↑↓</span>
                  <span>Select with ↵</span>
                  <span>Close with esc</span>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
