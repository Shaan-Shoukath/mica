'use client';

import * as React from 'react';

import { ImagePlusIcon, SmilePlusIcon } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export function EditorHeaderActions({
  className,
  coverControl,
  emojiControl,
  onAddCover,
}: {
  className?: string;
  coverControl?: React.ReactNode;
  emojiControl?: React.ReactNode;
  onAddCover?: () => void;
}) {
  return (
    <div
      className={cn(
        'flex items-center gap-2 px-16 pt-6 sm:px-[max(64px,calc(50%-350px))]',
        className
      )}
    >
      {emojiControl === undefined ? (
        <Button
          className="h-7 rounded-full px-2.5 text-muted-foreground hover:text-foreground"
          size="sm"
          type="button"
          variant="ghost"
        >
          <SmilePlusIcon className="size-3.5" />
          Add emoji
        </Button>
      ) : (
        emojiControl
      )}
      {coverControl === undefined ? (
        <Button
          className="h-7 rounded-full px-2.5 text-muted-foreground hover:text-foreground"
          onClick={onAddCover}
          size="sm"
          type="button"
          variant="ghost"
        >
          <ImagePlusIcon className="size-3.5" />
          Add cover
        </Button>
      ) : (
        coverControl
      )}
    </div>
  );
}
