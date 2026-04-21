import { useState } from "react";
import { ChevronDown, Search } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface FilterDropdownProps {
  label: string;
  options: string[];
  selected: string[];
  onToggle: (value: string) => void;
}

export function FilterDropdown({ label, options, selected, onToggle }: FilterDropdownProps) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");

  const filtered = options.filter((o) =>
    o.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="mb-3">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-3 py-2.5 y2k-border y2k-shadow-sm bg-y2k-blush font-display text-sm uppercase tracking-wider hover:bg-y2k-pink transition-colors"
      >
        <span className="flex items-center gap-2">
          ★ {label}
          {selected.length > 0 && (
            <span className="inline-flex items-center justify-center w-5 h-5 text-[10px] font-body font-bold bg-foreground text-primary-foreground">
              {selected.length}
            </span>
          )}
        </span>
        <ChevronDown
          className={`h-4 w-4 transition-transform ${open ? "rotate-180" : ""}`}
        />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="border-x-[3px] border-b-[3px] border-foreground bg-background">
              <div className="p-2 border-b-2 border-foreground/20">
                <div className="relative">
                  <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
                  <input
                    type="text"
                    placeholder={`Search ${label.toLowerCase()}...`}
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full pl-7 pr-2 py-1.5 text-xs font-body bg-y2k-blush border-2 border-foreground placeholder:text-muted-foreground focus:outline-none focus:bg-y2k-pink/30"
                  />
                </div>
              </div>
              <div className="max-h-48 overflow-y-auto">
                {filtered.length === 0 ? (
                  <p className="text-xs text-muted-foreground p-3 text-center font-body">
                    No results :(
                  </p>
                ) : (
                  filtered.map((option) => {
                    const isSelected = selected.includes(option);
                    return (
                      <button
                        key={option}
                        onClick={() => onToggle(option)}
                        className={`w-full text-left px-3 py-2 text-xs font-body flex items-center gap-2 hover:bg-y2k-blush transition-colors ${
                          isSelected ? "bg-y2k-pink/40 font-semibold" : ""
                        }`}
                      >
                        <span
                          className={`w-4 h-4 y2k-border flex items-center justify-center text-[10px] ${
                            isSelected ? "bg-primary text-primary-foreground" : "bg-background"
                          }`}
                        >
                          {isSelected && "✓"}
                        </span>
                        {option}
                      </button>
                    );
                  })
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
