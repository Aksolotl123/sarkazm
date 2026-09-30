import type { ReactNode } from 'react';

export function Notice({ tone, children }: { tone: 'warning' | 'info'; children: ReactNode }) {
  return (
    <div className={`notice notice-${tone}`} role={tone === 'warning' ? 'alert' : 'status'}>
      {children}
    </div>
  );
}
