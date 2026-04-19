interface LoadingSpinnerProps {
  message?: string;
  className?: string;
}

export function LoadingSpinner({ message, className = "" }: LoadingSpinnerProps) {
  return (
    <div className={`flex flex-col items-center justify-center gap-4 min-h-[calc(100vh-64px)] ${className}`}>
      <div className="w-12 h-12 rounded-full border-4 border-primary-app/20 border-t-primary-app animate-spin" />
      {message && (
        <p className="text-body-md text-text-muted">{message}</p>
      )}
    </div>
  );
}

export default LoadingSpinner;
