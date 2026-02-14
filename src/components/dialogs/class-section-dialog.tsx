"use client"

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function ClassSectionDialog() {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();

  const [open, setOpen] = useState(true);
  const [className, setClassName] = useState("");
  const [section, setSection] = useState("");

  // Sync state with URL params
  useEffect(() => {
    const classParam = searchParams.get("class") || "";
    const sectionParam = searchParams.get("section") || "";

    setClassName(classParam);
    setSection(sectionParam);

    // Close only if both exist
    if (classParam && sectionParam) {
      setOpen(false);
    } else {
      setOpen(true);
    }
  }, [searchParams]);

  function updateQueryParams() {
    const params = new URLSearchParams(searchParams);

    if (className) {
      params.set("class", className);
    } else {
      params.delete("class");
    }

    if (section) {
      params.set("section", section);
    } else {
      params.delete("section");
    }

    replace(`${pathname}?${params.toString()}`);
  }

  function handleSubmit() {
    if (!className || !section) return;
    updateQueryParams();
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(val) => {
        // Prevent closing if class/section not selected
        if (!className || !section) return;
        setOpen(val);
      }}
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Select Class and Section</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <Input
            placeholder="Class (e.g. 10)"
            value={className}
            onChange={(e) => setClassName(e.target.value)}
          />

          <Input
            placeholder="Section (e.g. A)"
            value={section}
            onChange={(e) => setSection(e.target.value)}
          />

          <Button onClick={handleSubmit} className="w-full">
            Apply
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
