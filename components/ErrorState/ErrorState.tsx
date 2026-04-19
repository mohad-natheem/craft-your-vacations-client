import Button from "@/components/Button/Button";

interface ErrorStateProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
  className?: string;
}

export function ErrorState({
  title = "Something went wrong",
  message,
  onRetry,
  className = "",
}: ErrorStateProps) {
  return (
    <div className={`flex items-center justify-center min-h-[calc(100vh-64px)] px-4 ${className}`}>
      <div className="flex flex-col items-center gap-4 max-w-sm text-center bg-surface rounded-2xl ghost-border shadow-ambient p-10">
        <span className="material-symbols-outlined text-5xl text-secondary">
          Oops!
        </span>
        <h3 className="text-headline-sm text-text">{title}</h3>
        {message && (
          <p className="text-body-md text-text-muted">{message}</p>
        )}
        {onRetry && (
          <Button variant="primary" size="md" onClick={onRetry}>
            Try again
          </Button>
        )}
      </div>
    </div>
  );
}

export default ErrorState;
