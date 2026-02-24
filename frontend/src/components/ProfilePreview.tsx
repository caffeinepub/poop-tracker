import { type Profile } from '../backend';

interface ProfilePreviewProps {
  profile: Profile;
  size?: 'sm' | 'md' | 'lg';
  showName?: boolean;
}

export default function ProfilePreview({ profile, size = 'md', showName = true }: ProfilePreviewProps) {
  const sizeClasses = {
    sm: 'w-12 h-12 text-2xl',
    md: 'w-16 h-16 text-3xl',
    lg: 'w-24 h-24 text-5xl',
  };

  const nameClasses = {
    sm: 'text-xs',
    md: 'text-sm',
    lg: 'text-base',
  };

  return (
    <div className="flex flex-col items-center gap-2">
      <div
        className={`${sizeClasses[size]} rounded-full flex items-center justify-center border-2 shadow-lg transition-transform hover:scale-110`}
        style={{
          background: profile.background,
          borderColor: profile.color,
        }}
      >
        <span>{profile.emoji}</span>
      </div>
      {showName && (
        <span
          className={`font-bold ${nameClasses[size]}`}
          style={{ color: profile.color }}
        >
          {profile.displayName}
        </span>
      )}
    </div>
  );
}
