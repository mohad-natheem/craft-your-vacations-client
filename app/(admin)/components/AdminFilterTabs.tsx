interface Tab {
  value: string;
  label: string;
}

interface Props {
  tabs: Tab[];
  active: string;
  onChange: (value: string) => void;
}

export default function AdminFilterTabs({ tabs, active, onChange }: Props) {
  return (
    <div className="flex gap-2 mb-6 flex-wrap">
      {tabs.map(({ value, label }) => (
        <button
          key={value}
          onClick={() => onChange(value)}
          className={`px-4 py-1.5 rounded-full text-label-sm transition-colors ${
            active === value
              ? "bg-primary text-white"
              : "bg-surface text-text-muted hover:bg-surface-high"
          }`}
        >
          {label}
        </button>
      ))}
    </div>
  );
}
