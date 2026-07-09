import React from 'react';

export type SpecItem = {
  label: string;
  value: string;
  note?: string;
};

interface SpecListProps {
  items: SpecItem[];
}

export const SpecList = ({ items }: SpecListProps) => {
  return (
    <dl className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-px bg-white/5 overflow-hidden rounded-xl border border-line">
      {items.map((item, idx) => (
        <div key={idx} className="bg-surface p-5 flex flex-col gap-1.5">
          <dt className="text-xs uppercase tracking-wider text-text-faint font-bold">
            {item.label}
          </dt>
          <dd className="flex flex-col">
            <span className="text-lg font-semibold text-white">{item.value}</span>
            {item.note && <span className="text-xs text-text-muted mt-0.5">{item.note}</span>}
          </dd>
        </div>
      ))}
    </dl>
  );
};
