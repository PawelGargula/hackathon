"use client";

import { useRef } from "react";
import { Send } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { sendMessage } from "@/app/actions";
import { formatTime } from "@/lib/format";

export type ThreadMessage = {
  id: string;
  senderId: string;
  body: string;
  createdAt: Date;
};

export function RequestThread({
  requestId,
  currentUserId,
  messages,
  disabled,
}: {
  requestId: string;
  currentUserId: string;
  messages: ThreadMessage[];
  disabled?: boolean;
}) {
  const formRef = useRef<HTMLFormElement>(null);

  return (
    <div className="flex min-w-0 flex-col gap-2">
      <div className="flex min-w-0 flex-col gap-1.5">
        {messages.length === 0 && (
          <p className="text-xs text-muted-foreground">Brak wiadomości.</p>
        )}
        {messages.map((m) => {
          const mine = m.senderId === currentUserId;
          return (
            <div
              key={m.id}
              className={cn(
                "flex flex-col",
                mine ? "items-end" : "items-start",
              )}
            >
              <div
                className={cn(
                "max-w-[85%] break-words rounded-lg px-3 py-1.5 text-sm",
                  mine
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-foreground",
                )}
              >
                {m.body}
              </div>
              <span className="px-1 text-[10px] text-muted-foreground">
                {formatTime(new Date(m.createdAt))}
              </span>
            </div>
          );
        })}
      </div>

      {!disabled && (
        <form
          ref={formRef}
          action={async (formData) => {
            await sendMessage(formData);
            formRef.current?.reset();
          }}
          className="flex min-w-0 items-center gap-2"
        >
          <input type="hidden" name="requestId" value={requestId} />
          <Input
            name="body"
            placeholder="Napisz wiadomość..."
            autoComplete="off"
            required
            className="min-w-0"
          />
          <Button type="submit" size="icon" aria-label="Wyślij">
            <Send />
          </Button>
        </form>
      )}
    </div>
  );
}
