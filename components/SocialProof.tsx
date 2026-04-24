import { Star } from 'lucide-react';

export default function SocialProof() {
  return (
    <div className="flex flex-col items-center justify-center gap-4">
      {/* Avatars */}
      <div className="flex items-center">
        <div className="flex -space-x-3">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-white bg-gray-300"
            >
              <span className="text-xs font-semibold text-gray-600">U{i}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Rating & User Count */}
      <div className="flex items-center gap-3">
        <div className="flex gap-1">
          {[1, 2, 3, 4, 5].map((i) => (
            <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
          ))}
        </div>
        <span className="text-sm font-medium text-black">4.8+</span>
        <span className="text-sm text-gray-600">From 40,000+ Users</span>
      </div>
    </div>
  );
}
