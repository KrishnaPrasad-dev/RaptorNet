type MembersVettedBadgeProps = {
  total: number;
};

export default function MembersVettedBadge({ total }: MembersVettedBadgeProps) {
  return (
    <span className="rn-vetted-pill rounded-full border border-white/15 bg-black/30 px-4 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-white/75">
      <span className="tabular-nums">{total}</span> builders vetted
    </span>
  );
}