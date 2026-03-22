import React from 'react';

interface BocraLoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  fullScreen?: boolean;
  message?: string;
}

const sizeClasses = {
  sm: 'w-4 h-4',
  md: 'w-6 h-6',
  lg: 'w-8 h-8',
};

const gapClasses = {
  sm: 'gap-2',
  md: 'gap-3',
  lg: 'gap-4',
};

// BOCRA service area colors
const BOCRA_COLORS = {
  telecom: '#30B6CF',  // Cyan/Blue
  broadcast: '#2D6A2D', // Green
  postal: '#AF2F54',   // Pink/Magenta
  internet: '#EFC812',  // Golden Yellow
};

export default function BocraLoadingSpinner({
  size = 'md',
  fullScreen = false,
  message = 'Loading...',
}: BocraLoadingSpinnerProps) {
  const spinner = (
    <div className="flex flex-col items-center justify-center gap-4">
      <style>{`
        @keyframes bounce-in {
          0% {
            transform: scale(0);
            opacity: 0;
          }
          50% {
            transform: scale(1.2);
          }
          100% {
            transform: scale(1);
            opacity: 1;
          }
        }

        .bounce-circle {
          animation: bounce-in 0.6s ease-out forwards;
        }

        .circle-1 { animation-delay: 0s; }
        .circle-2 { animation-delay: 0.15s; }
        .circle-3 { animation-delay: 0.3s; }
        .circle-4 { animation-delay: 0.45s; }
      `}</style>

      <div className={`flex ${gapClasses[size]} items-center justify-center`}>
        {/* Blue/Telecom Circle */}
        <div
          className={`${sizeClasses[size]} rounded-full bounce-circle circle-1`}
          style={{ backgroundColor: BOCRA_COLORS.telecom }}
        />

        {/* Green/Broadcast Circle */}
        <div
          className={`${sizeClasses[size]} rounded-full bounce-circle circle-2`}
          style={{ backgroundColor: BOCRA_COLORS.broadcast }}
        />

        {/* Pink/Postal Circle */}
        <div
          className={`${sizeClasses[size]} rounded-full bounce-circle circle-3`}
          style={{ backgroundColor: BOCRA_COLORS.postal }}
        />

        {/* Yellow/Internet Circle */}
        <div
          className={`${sizeClasses[size]} rounded-full bounce-circle circle-4`}
          style={{ backgroundColor: BOCRA_COLORS.internet }}
        />
      </div>

      {message && (
        <p className="text-sm font-medium text-gray-600">{message}</p>
      )}
    </div>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-white/80 backdrop-blur-sm z-50">
        {spinner}
      </div>
    );
  }

  return <div className="flex items-center justify-center">{spinner}</div>;
}
