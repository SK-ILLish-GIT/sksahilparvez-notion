import { useEffect, useState } from "react";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { portfolio } from "@/data";
import { scrollToSection } from "@/lib/utils";

export function SlashCommand() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((o) => !o);
      }
    };
    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  return (
    <CommandDialog open={open} onOpenChange={setOpen}>
      <CommandInput placeholder="Search pages… (⌘K)" />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>
        <CommandGroup heading="Pages">
          {portfolio.sections.map((section) => (
            <CommandItem
              key={section.id}
              value={section.label}
              onSelect={() => {
                scrollToSection(section.id);
                setOpen(false);
              }}
            >
              <span>{section.icon}</span>
              <span>{section.label}</span>
            </CommandItem>
          ))}
        </CommandGroup>
        <CommandGroup heading="Actions">
          <CommandItem
            value="book call"
            onSelect={() => {
              scrollToSection("contact");
              setOpen(false);
            }}
          >
            📅 Book a call
          </CommandItem>
          <CommandItem
            value="cv resume"
            onSelect={() => {
              window.open(portfolio.site.cvPath, "_blank");
              setOpen(false);
            }}
          >
            📄 CV
          </CommandItem>
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  );
}
