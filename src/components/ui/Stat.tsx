import React from 'react';

interface StatProps {
  value: string;
  unit: string;
  label: string;
  note?: string;
}

export const Stat = ({ value, unit, label, note }: StatProps) => {
  return (
    <div className="flex flex-col gap-2 p-6 rounded-2xl bg-surface border border-line">
      <div className="flex items-baseline gap-1">
        <span className="text-5xl font-black text-white">{value}</span>
        <span className="text-lg font-bold text-brand">{unit}</span>
      </div>
      <div className="flex flex-col">
        <span className="text-xs uppercase tracking-wider text-text-muted font-bold">{label}</span>
        {note && <span className="text-xs text-text-faint mt-1">{note}</span>}
      </div>
    </div>
  );
};
