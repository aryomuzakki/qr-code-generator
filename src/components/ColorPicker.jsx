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
import { Label } from './ui/label';

const ColorPicker = forwardRef(
  (
    { label, disabled, value, onChange, onBlur, name, className, ...props },
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
              id={props.id + "-btn"}
              name={name + "-btn"}
              className={cn(`flex items-center justify-center mr-2 bg-[var(--colorpicker-bg-color)] hover:bg-[var(--colorpicker-transbg-color)]`, className)}
              onClick={() => {
                setOpen(true);
              }}
              size='icon'
              style={{
                "--colorpicker-bg-color": parsedValue,
                "--colorpicker-transbg-color": parsedValue + "bf",
              }}
              variant='outline'
            >
              <span className="sr-only">Color Picker</span>
              <Edit2Icon className="text-muted dark:text-foreground" />
            </Button>
          </PopoverTrigger>
          <Input
            disabled={disabled}
            id={props.id}
            name={props.name}
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
              id={props.id + "-popover"}
              name={props.name + "-popover"}
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