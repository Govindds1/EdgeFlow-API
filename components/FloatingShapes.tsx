export default function FloatingShapes() {
  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none">
      {/* Diamond 1 */}
      <div className="absolute top-20 left-10 w-12 h-12 rotate-45 bg-gray-200 opacity-10 rounded-sm"></div>

      {/* Square 2 */}
      <div className="absolute top-1/3 right-20 w-16 h-16 bg-gray-300 opacity-5 rounded-lg"></div>

      {/* Diamond 3 */}
      <div className="absolute bottom-1/4 left-1/4 w-20 h-20 rotate-45 bg-gray-200 opacity-10 rounded-sm"></div>

      {/* Square 4 */}
      <div className="absolute bottom-10 right-1/3 w-10 h-10 bg-gray-300 opacity-5 rounded-md"></div>

      {/* Diamond 5 */}
      <div className="absolute top-1/2 right-10 w-14 h-14 rotate-45 bg-gray-200 opacity-10 rounded-sm"></div>
    </div>
  );
}
