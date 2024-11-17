'use client';

import { forwardRef, useMemo, useState } from 'react';
import { HexColorPicker } from 'react-colorful';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Input } from '@/components/ui/input';
import useForwardedRef from '@/lib/useForwardedRef';
import { Edit2Icon, EditIcon } from 'lucide-react';

const ColorPicker = forwardRef(
  (
    { disabled, value, onChange, onBlur, name, className, ...props },
    forwardedRef
  ) => {
    const ref = useForwardedRef(forwardedRef);
    const [open, setOpen] = useState(false);

    const parsedValue = useMemo(() => {
      return value || '#FFFFFF';
    }, [value]);

    return (
      <Popover onOpenChange={setOpen} open={open}>
        <div className="flex w-max">
          <PopoverTrigger asChild disabled={disabled} onBlur={onBlur}>
            <Button
              {...props}
              className={cn('flex items-center justify-center hover:opacity-75 mr-2', className)}
              name={name}
              onClick={() => {
                setOpen(true);
              }}
              size='icon'
              style={{
                backgroundColor: parsedValue,
              }}
              variant='outline'
            >
              <Edit2Icon className="text-muted dark:text-foreground" />
            </Button>
          </PopoverTrigger>
          <Input
            maxLength={7}
            onChange={(e) => {
              onChange(e?.currentTarget?.value);
            }}
            ref={ref}
            value={parsedValue}
            className="w-24"
          />
        </div>
        <PopoverContent className='w-full'>
          <HexColorPicker color={parsedValue} onChange={onChange} />
          <div className="w-[200px] mt-4">
            <Input
              maxLength={7}
              onChange={(e) => {
                onChange(e?.currentTarget?.value);
              }}
              ref={ref}
              value={parsedValue}
            />
          </div>
        </PopoverContent>
      </Popover>
    );
  }
);
ColorPicker.displayName = 'ColorPicker';

export default ColorPicker;