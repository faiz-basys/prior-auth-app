"use client";

import { Search, Bell, HelpCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

export function AppTopbar() {
    return (
        <header className="sticky top-0 z-20 flex px-4 h-16 items-center gap-4 border-b border-border bg-card">
            <span className="text-base font-bold text-foreground">
                Review Portal
            </span>

            <div className="relative hidden max-w-xs flex-1 md:block">
                <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                <input
                    type="search"
                    placeholder="Search case ID..."
                    aria-label="Search case ID"
                    className="h-10 w-full rounded-full border border-border bg-secondary/60 pl-9 pr-4 text-sm text-foreground outline-none placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/40"
                />
            </div>

            <div className="ml-auto flex items-center gap-2">
                <Button variant="ghost" size="icon" aria-label="Notifications">
                    <Bell className="size-5 text-muted-foreground" />
                </Button>
                <Button variant="ghost" size="icon" aria-label="Help">
                    <HelpCircle className="size-5 text-muted-foreground" />
                </Button>
                <Button className="ml-1">Create Appeal</Button>
                <div className="ml-2 hidden items-center gap-2 border-l border-border pl-3 lg:flex">
                    <span className="flex size-8 items-center justify-center rounded-full bg-primary/15 text-xs font-semibold text-primary">
                        KH
                    </span>
                    <div className="leading-tight">
                        <p className="text-sm font-semibold text-foreground">
                            Karen Highland
                        </p>
                        <p className="text-xs text-muted-foreground">
                            Senior Reviewer
                        </p>
                    </div>
                </div>
            </div>
        </header>
    );
}
