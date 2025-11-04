export function LoadingSpinner() {
  return (
    <div className="flex items-center justify-center py-12">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#8B1A1A] mx-auto"></div>
        <p className="mt-4 text-[#8B1A1A]">Loading products...</p>
      </div>
    </div>
  );
}
