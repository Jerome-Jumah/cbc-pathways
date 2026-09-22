"use client";

import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { MultiSelect, Option } from "@/components/ui/multi-select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  CLUSTER_OPTIONS,
  COUNTY_OPTIONS,
  SUBJECT_OPTIONS,
} from "@/constants/filter-options";
import { cn } from "@/lib/utils";
import {
  ArrowDown01Icon,
  Search01Icon,
  Tick02Icon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { useRouter } from "next/navigation";
import { useState } from "react";

const SUBJECT_OPTIONS_SELECT: Option[] = SUBJECT_OPTIONS.map((s) => ({
  label: s.label,
  value: s.value,
}));


export function HomeSearch() {
  const router = useRouter();
  const [subjects, setSubjects] = useState<string[]>([]);
  const [county, setCounty] = useState<string>("");
  const [countyOpen, setCountyOpen] = useState(false);
  const [gender, setGender] = useState<string>("any");
  const [cluster, setCluster] = useState<string>("");
  const [countySearch, setCountySearch] = useState("");

  const filteredCounties = COUNTY_OPTIONS.filter((c) =>
    c.label.toLowerCase().includes(countySearch.toLowerCase()),
  );

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (subjects.length > 0) params.set("subjects", subjects.join(","));
    if (county) params.set("county", county);
    if (gender && gender !== "any") params.set("gender", gender);
    if (cluster) params.set("cluster", cluster);
    router.push(`/find-schools?${params.toString()}`);
  };

  return (
    <div className="w-full bg-card rounded-2xl shadow-[0_4px_24px_rgba(0,0,0,0.04)] border border-border p-4 mb-10 z-20 relative">
      <div className="grid grid-cols-1 md:grid-cols-4 xl:grid-cols-[2.5fr_1.5fr_1.5fr_1.5fr_auto] gap-4 items-end">
        <div className="flex flex-col gap-2">
          <label htmlFor="home-subjects-select" className="text-sm font-semibold text-foreground ml-1">
            Select Subjects
          </label>
          <MultiSelect
            options={SUBJECT_OPTIONS_SELECT}
            selected={subjects}
            onChange={setSubjects}
            placeholder="Search subjects..."
          />
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-sm font-semibold text-foreground ml-1">
            County <span className="text-muted-foreground/80 font-normal">(Optional)</span>
          </label>
          <Popover open={countyOpen} onOpenChange={setCountyOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                role="combobox"
                aria-expanded={countyOpen}
                className="flex h-[46px] w-full items-center justify-between border border-border rounded-xl px-4 py-3 bg-card font-medium text-foreground hover:bg-card hover:border-border shadow-none text-sm"
              >
                {county ? (
                  COUNTY_OPTIONS.find((c) => c.value === county)?.label
                ) : (
                  <span className="text-muted-foreground/80 font-normal">Select county...</span>
                )}
                <HugeiconsIcon
                  icon={ArrowDown01Icon}
                  size={18}
                  className="text-muted-foreground/80 opacity-100"
                />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[220px] p-0" align="start">
              <Command>
                <CommandInput
                  placeholder="Search county..."
                  value={countySearch}
                  onValueChange={setCountySearch}
                />
                <CommandList>
                  <CommandEmpty>No county found.</CommandEmpty>
                  <CommandGroup>
                    {filteredCounties.map((c) => (
                      <CommandItem
                        key={c.value}
                        value={c.value}
                        onSelect={(currentValue) => {
                          setCounty(currentValue === county ? "" : currentValue);
                          setCountyOpen(false);
                          setCountySearch("");
                        }}
                      >
                        <HugeiconsIcon
                          icon={Tick02Icon}
                          className={cn(
                            "mr-2 h-4 w-4",
                            county === c.value ? "opacity-100" : "opacity-0",
                          )}
                        />
                        {c.label}
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>
        </div>

        <div className="flex flex-col gap-2 relative">
          <label htmlFor="home-gender-select" className="text-sm font-semibold text-foreground ml-1">
            Gender <span className="text-muted-foreground/80 font-normal">(Optional)</span>
          </label>
          <div className="relative w-full">
            <select
              id="home-gender-select"
              value={gender}
              onChange={(e) => setGender(e.target.value)}
              className="w-full appearance-none flex items-center justify-between border border-border rounded-xl px-4 py-3 bg-card cursor-pointer hover:border-border text-foreground font-medium text-sm h-[46px] outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            >
              <option value="any">Any</option>
              <option value="BOYS">Boys School</option>
              <option value="GIRLS">Girls School</option>
              <option value="MIXED">Mixed School</option>
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-muted-foreground/80">
              <HugeiconsIcon icon={ArrowDown01Icon} size={18} />
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-2 relative">
          <label htmlFor="home-cluster-select" className="text-sm font-semibold text-foreground ml-1">
            Cluster <span className="text-muted-foreground/80 font-normal">(Optional)</span>
          </label>
          <div className="relative w-full">
            <select
              id="home-cluster-select"
              value={cluster}
              onChange={(e) => setCluster(e.target.value)}
              className={cn(
                "w-full appearance-none flex items-center justify-between border border-border rounded-xl px-4 py-3 bg-card cursor-pointer hover:border-border text-sm h-[46px] outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500",
                !cluster
                  ? "text-muted-foreground/80 font-normal"
                  : "text-foreground font-medium",
              )}
            >
              <option value="">Any cluster</option>
              {CLUSTER_OPTIONS.map((c) => (
                <option key={c.value} value={c.value}>
                  {c.label}
                </option>
              ))}
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-muted-foreground/80">
              <HugeiconsIcon icon={ArrowDown01Icon} size={18} />
            </div>
          </div>
        </div>

        <Button
          id="home-search-btn"
          onClick={handleSearch}
          className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl px-8 h-[46px] shadow-sm font-semibold w-full md:w-auto"
        >
          <HugeiconsIcon icon={Search01Icon} size={18} className="mr-2" /> Find Schools
        </Button>
      </div>
    </div>
  );
}
