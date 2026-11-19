"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { AlertCircle, CheckCircle2, X } from "lucide-react";
import { cn } from "cn";

type ToastTone = "success" | "error" | "info";

type ToastOptions = {
  title: string;
  description?: string;
  tone?: ToastTone;
  duration?: number;
  action?: { label: string; onClick: () => void };
};

type ToastItem = ToastOptions & { id: number; duration: number };

type ToastContextValue = {
  toast: (options: ToastOptions) => number;
  dismiss: (id: number) => void;
};

const ToastContext = createContext<ToastContextValue | null>(null);

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) throw new Error("useToast must be used within <Toaster>");
  return context;
}

let nextId = 1;

export function Toaster({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const dismiss = useCallback((id: number) => {
    setToasts((prev) => prev.filter((item) => item.id !== id));
  }, []);

  const toast = useCallback((options: ToastOptions) => {
    const id = nextId++;
    const duration = options.duration ?? (options.action ? 6000 : 3200);
    setToasts((prev) => [...prev.slice(-2), { ...options, id, duration }]);
    return id;
  }, []);

  const value = useMemo(() => ({ toast, dismiss }), [toast, dismiss]);

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div
        aria-live="polite"
        className="pointer-events-none fixed inset-x-0 bottom-0 z-[60] flex flex-col items-center gap-2 px-4 pb-[max(1rem,env(safe-area-inset-bottom))]"
      >
        {toasts.map((item) => (
          <ToastView key={item.id} item={item} onDismiss={() => dismiss(item.id)} />
        ))}
      </div>
    </ToastContext.Provider>
  );
}

function ToastView({ item, onDismiss }: { item: ToastItem; onDismiss: () => void }) {
  const [paused, setPaused] = useState(false);
  const remaining = useRef(item.duration);
  const startedAt = useRef(0);

  useEffect(() => {
    if (paused) return;
    startedAt.current = Date.now();
    const timer = window.setTimeout(onDismiss, remaining.current);
    return () => {
      window.clearTimeout(timer);
      remaining.current -= Date.now() - startedAt.current;
    };
  }, [paused, onDismiss]);

  const Icon = item.tone === "error" ? AlertCircle : CheckCircle2;

  return (
    <div
      role="status"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      className="pointer-events-auto relative flex w-full max-w-md animate-toast-in items-center gap-3 overflow-hidden rounded-2xl bg-foreground py-3 pr-2 pl-4 text-background shadow-float"
    >
      {item.tone !== "info" ? (
        <Icon
          className={cn(
            "size-5 shrink-0",
            item.tone === "error" ? "text-red-400" : "text-brand",
          )}
        />
      ) : null}
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-semibold">{item.title}</p>
        {item.description ? (
          <p className="truncate text-[13px] opacity-70">{item.description}</p>
        ) : null}
      </div>
      {item.action ? (
        <button
          type="button"
          onClick={() => {
            item.action?.onClick();
            onDismiss();
          }}
          className="shrink-0 rounded-lg px-3 py-1.5 text-sm font-semibold text-brand transition-colors hover:bg-background/10"
        >
          {item.action.label}
        </button>
      ) : null}
      <button
        type="button"
        aria-label="닫기"
        onClick={onDismiss}
        className="shrink-0 rounded-lg p-1.5 opacity-50 transition-opacity hover:opacity-100"
      >
        <X className="size-4" />
      </button>
      <span
        aria-hidden
        className="absolute inset-x-0 bottom-0 h-0.5 origin-left bg-background/25"
        style={{
          animation: `toast-progress ${item.duration}ms linear forwards`,
          animationPlayState: paused ? "paused" : "running",
        }}
      />
    </div>
  );
}
