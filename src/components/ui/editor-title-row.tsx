'use client';

import * as React from 'react';

import { cn } from '@/lib/utils';

export function EditorTitleRow({
  children,
  className,
  emojiSlot,
}: {
  children: React.ReactNode;
  className?: string;
  emojiSlot?: React.ReactNode;
}) {
  return (
    <div
      className={cn(
        'flex items-start gap-3 px-16 sm:px-[max(64px,calc(50%-350px))]',
        className
      )}
    >
      {emojiSlot ? <div className="mt-3 flex shrink-0 items-center gap-1">{emojiSlot}</div> : null}
      <div className="min-w-0 flex-1">{children}</div>
    </div>
  );
}
