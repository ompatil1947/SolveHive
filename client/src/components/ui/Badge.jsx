export default function Badge({ badge }) {
  if (!badge) return null;

  const badgeMap = {
    Helper: { cls: 'badge-helper', emoji: '🌱', label: 'Helper' },
    'Pro Helper': { cls: 'badge-pro', emoji: '⚡', label: 'Pro Helper' },
    Expert: { cls: 'badge-expert', emoji: '🏆', label: 'Expert' },
  };

  const config = badgeMap[badge] || badgeMap['Helper'];

  return (
    <span className={config.cls}>
      {config.emoji} {config.label}
    </span>
  );
}
