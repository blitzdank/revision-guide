"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { CountdownForm } from "./countdown-form";
import { deleteCountdown } from "./actions";
import { formatCountdown, type Countdown } from "@/lib/countdown";

type DialogState = { mode: "closed" } | { mode: "create" } | { mode: "edit"; countdown: Countdown };

export function CountdownsManager({
  upcoming,
  done,
}: {
  upcoming: Countdown[];
  done: Countdown[];
}) {
  const [dialog, setDialog] = useState<DialogState>({ mode: "closed" });
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  return (
    <div className="flex flex-col gap-6">
      <button
        type="button"
        onClick={() => setDialog({ mode: "create" })}
        className="flex items-center justify-center gap-2 rounded-full bg-pink px-4 py-3 text-base font-semibold text-pink-strong"
      >
        <Plus size={18} aria-hidden /> Add countdown
      </button>

      {upcoming.length === 0 && done.length === 0 && (
        <p className="rounded-2xl bg-surface p-5 text-sm text-muted shadow-sm">
          No countdowns yet. Add your first exam above.
        </p>
      )}

      <div className="flex flex-col gap-3">
        {upcoming.map((countdown) => (
          <CountdownCard
            key={countdown.id}
            countdown={countdown}
            confirming={confirmDeleteId === countdown.id}
            onEdit={() => setDialog({ mode: "edit", countdown })}
            onDeleteClick={() =>
              setConfirmDeleteId((current) => (current === countdown.id ? null : countdown.id))
            }
            onConfirmDelete={() => {
              setConfirmDeleteId(null);
              deleteCountdown(countdown.id);
            }}
          />
        ))}
      </div>

      {done.length > 0 && (
        <section>
          <h2 className="mb-3 text-sm font-semibold text-muted">Done</h2>
          <div className="flex flex-col gap-3">
            {done.map((countdown) => (
              <CountdownCard
                key={countdown.id}
                countdown={countdown}
                muted
                confirming={confirmDeleteId === countdown.id}
                onEdit={() => setDialog({ mode: "edit", countdown })}
                onDeleteClick={() =>
                  setConfirmDeleteId((current) => (current === countdown.id ? null : countdown.id))
                }
                onConfirmDelete={() => {
                  setConfirmDeleteId(null);
                  deleteCountdown(countdown.id);
                }}
              />
            ))}
          </div>
        </section>
      )}

      {dialog.mode !== "closed" && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/30 p-4 md:items-center">
          <div className="w-full max-w-sm rounded-3xl bg-surface p-6 shadow-lg">
            <h2 className="mb-4 text-lg font-bold text-text">
              {dialog.mode === "create" ? "Add countdown" : "Edit countdown"}
            </h2>
            <CountdownForm
              countdown={dialog.mode === "edit" ? dialog.countdown : undefined}
              onSaved={() => setDialog({ mode: "closed" })}
              onCancel={() => setDialog({ mode: "closed" })}
            />
          </div>
        </div>
      )}
    </div>
  );
}

function CountdownCard({
  countdown,
  muted = false,
  confirming,
  onEdit,
  onDeleteClick,
  onConfirmDelete,
}: {
  countdown: Countdown;
  muted?: boolean;
  confirming: boolean;
  onEdit: () => void;
  onDeleteClick: () => void;
  onConfirmDelete: () => void;
}) {
  return (
    <div className={`rounded-2xl bg-surface p-4 shadow-sm ${muted ? "opacity-60" : ""}`}>
      <div className="flex items-center justify-between gap-3">
        <div className="min-w-0">
          <p className="truncate font-semibold text-text">{countdown.name}</p>
          <p className="text-sm text-muted">
            {new Date(countdown.exam_at).toLocaleDateString(undefined, {
              weekday: "long",
              day: "numeric",
              month: "long",
            })}
          </p>
        </div>
        <span className="shrink-0 rounded-full bg-yellow/35 px-3 py-1 text-sm font-semibold text-yellow-strong">
          {formatCountdown(countdown)}
        </span>
      </div>

      <div className="mt-3 flex gap-2 text-sm">
        <button type="button" onClick={onEdit} className="text-muted underline">
          Edit
        </button>
        {confirming ? (
          <button type="button" onClick={onConfirmDelete} className="font-semibold text-wrong underline">
            Confirm delete?
          </button>
        ) : (
          <button type="button" onClick={onDeleteClick} className="text-muted underline">
            Delete
          </button>
        )}
      </div>
    </div>
  );
}
