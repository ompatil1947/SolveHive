export default function Badge({ badge }) {
  if (!badge) return null;
  const badgeMap = {
    Helper:       { cls: 'badge-helper', emoji: '🌱' },
    'Pro Helper': { cls: 'badge-pro',    emoji: '⚡' },
    Expert:       { cls: 'badge-expert', emoji: '🏆' },
  };
  const config = badgeMap[badge] || badgeMap['Helper'];
  return <span className={config.cls}>{config.emoji} {badge}</span>;
}
