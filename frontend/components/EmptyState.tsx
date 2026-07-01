export function EmptyState({ title, description }: { title: string; description: string }) {
  return (
    <div className="rounded-lg border border-dashed border-hairline px-6 py-14 text-center">
      <p className="font-display text-lg text-bone">{title}</p>
      <p className="mx-auto mt-1.5 max-w-xs text-sm text-bone-dim">{description}</p>
    </div>
  );
}
