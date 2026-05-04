'use client';

import * as React from 'react';

import { cn } from '@/lib/utils';

export function EditorTitleInput({
  className,
  ...props
}: React.ComponentProps<'input'>) {
  return (
    <input
      className={cn(
        'w-full bg-transparent px-16 pt-8 pb-4 text-3xl font-semibold tracking-tight text-foreground outline-none placeholder:text-muted-foreground/70 sm:px-[max(64px,calc(50%-350px))]',
        'selection:bg-brand/25',
        className
      )}
      {...props}
    />
  );
}
