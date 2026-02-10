interface ErrorMessageProps {
  message: string;
}

/**
 * Displays an error message in a styled alert box.
 */
export function ErrorMessage({ message }: ErrorMessageProps) {
  return (
    <div
      role="alert"
      className="w-full max-w-md bg-red-50 border border-red-200 
                 text-red-700 rounded-lg px-4 py-3 text-center shadow-sm"
    >
      <p className="font-medium">⚠️ {message}</p>
    </div>
  );
}
