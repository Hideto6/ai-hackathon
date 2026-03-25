import type { GlossaryTermEntity } from "@/entities/glossary-term/model/types";

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/shared/ui/shadcn/ui/sheet";

interface GlossaryPopoverSectionProps {
  term: GlossaryTermEntity | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function GlossaryPopoverSection({
  term,
  open,
  onOpenChange,
}: GlossaryPopoverSectionProps) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="bottom" className="mx-auto max-w-md rounded-t-3xl">
        <SheetHeader className="pt-6 pb-24">
          <SheetTitle className="text-xl">
            {term?.term}
            {term ? (
              <span className="ml-2 text-sm font-normal text-muted-foreground">
                ({term.reading})
              </span>
            ) : null}
          </SheetTitle>
          <SheetDescription className="break-words text-sm leading-7 text-muted-foreground">
            {term?.description}
          </SheetDescription>
        </SheetHeader>
      </SheetContent>
    </Sheet>
  );
}
