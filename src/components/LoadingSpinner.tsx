/**
 * Loading spinner component.
 */
export function LoadingSpinner() {
  return (
    <div className="flex items-center justify-center py-8" role="status">
      <div
        className="w-10 h-10 border-4 border-blue-200 border-t-blue-600 
                    rounded-full animate-spin"
      />
      <span className="sr-only">Cargando...</span>
    </div>
  );
}
