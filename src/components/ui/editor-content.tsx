'use client';

import * as React from 'react';

import type { VariantProps } from 'class-variance-authority';
import type { PlateContentProps, PlateViewProps } from 'platejs/react';

import { cva } from 'class-variance-authority';
import { PlateContent, PlateView } from 'platejs/react';

import { cn } from '@/lib/utils';

const editorVariants = cva(
  cn(
    'group/editor',
    'relative w-full cursor-text select-text overflow-x-hidden whitespace-pre-wrap break-words',
    'rounded-md ring-offset-background focus-visible:outline-none',
    '**:data-slate-placeholder:!top-1/2 **:data-slate-placeholder:-translate-y-1/2 placeholder:text-muted-foreground/80 **:data-slate-placeholder:text-muted-foreground/80 **:data-slate-placeholder:opacity-100!',
    '[&_strong]:font-bold'
  ),
  {
    defaultVariants: {
      variant: 'default',
    },
    variants: {
      disabled: {
        true: 'cursor-not-allowed opacity-50',
      },
      focused: {
        true: 'ring-2 ring-ring ring-offset-2',
      },
      variant: {
        ai: 'w-full px-0 text-base md:text-sm',
        aiChat:
          'max-h-[min(70vh,320px)] w-full overflow-y-auto px-3 py-2 text-base md:text-sm',
        comment: cn('rounded-none border-none bg-transparent text-sm'),
        default:
          'size-full px-16 pt-2 pb-72 text-base sm:px-[max(64px,calc(50%-350px))]',
        demo: 'size-full px-16 pt-2 pb-72 text-base sm:px-[max(64px,calc(50%-350px))]',
        fullWidth: 'size-full px-16 pt-2 pb-72 text-base sm:px-24',
        none: '',
        select: 'px-3 py-2 text-base data-readonly:w-fit',
      },
    },
  }
);

export type EditorProps = PlateContentProps &
  VariantProps<typeof editorVariants>;

export const Editor = ({
  className,
  disabled,
  focused,
  variant,
  ref,
  ...props
}: EditorProps & { ref?: React.RefObject<HTMLDivElement | null> }) => (
  <PlateContent
    ref={ref}
    className={cn(
      editorVariants({
        disabled,
        focused,
        variant,
      }),
      className
    )}
    disabled={disabled}
    disableDefaultStyles
    {...props}
  />
);

Editor.displayName = 'Editor';

export function EditorView({
  className,
  variant,
  ...props
}: PlateViewProps & VariantProps<typeof editorVariants>) {
  return (
    <PlateView
      {...props}
      className={cn(editorVariants({ variant }), className)}
    />
  );
}

EditorView.displayName = 'EditorView';
