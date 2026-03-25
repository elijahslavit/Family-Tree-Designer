"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";

import { createOrUpdateEvent, deleteEvent } from "@/lib/actions";
import type { EventRecord, PersonViewModel, Tree } from "@/lib/types";
import { Button } from "@/components/foundation/button";
import { Card } from "@/components/foundation/card";
import { Input, Textarea } from "@/components/foundation/input";
import { useToast } from "@/components/foundation/toast";

type PersonEventsManagerProps = {
  tree: Tree;
  person: PersonViewModel;
  events: EventRecord[];
};

export function PersonEventsManager({
  tree,
  person,
  events,
}: PersonEventsManagerProps) {
  const router = useRouter();
  const { pushToast } = useToast();
  const [isPending, startSaving] = useTransition();
  const [newEvent, setNewEvent] = useState({
    type: "",
    dateText: "",
    place: "",
    description: "",
  });

  return (
    <Card className="space-y-4">
      <div className="space-y-2">
        <h3 className="text-xl font-semibold text-[var(--text-primary)]">Timeline events</h3>
        <p className="text-sm text-[var(--text-secondary)]">
          Add custom milestones beyond birth and death, or revise imported entries.
        </p>
      </div>
      <div className="space-y-3 rounded-[var(--radius-md)] border border-dashed border-[var(--border-default)] p-4">
        <p className="font-semibold text-[var(--text-primary)]">Add event</p>
        <div className="grid gap-3 md:grid-cols-2">
          <label className="space-y-2">
            <span className="text-sm text-[var(--text-secondary)]">Type</span>
            <Input
              value={newEvent.type}
              onChange={(event) =>
                setNewEvent((current) => ({ ...current, type: event.target.value }))
              }
              placeholder="occupation"
            />
          </label>
          <label className="space-y-2">
            <span className="text-sm text-[var(--text-secondary)]">Date</span>
            <Input
              value={newEvent.dateText}
              onChange={(event) =>
                setNewEvent((current) => ({ ...current, dateText: event.target.value }))
              }
            />
          </label>
          <label className="space-y-2 md:col-span-2">
            <span className="text-sm text-[var(--text-secondary)]">Place</span>
            <Input
              value={newEvent.place}
              onChange={(event) =>
                setNewEvent((current) => ({ ...current, place: event.target.value }))
              }
            />
          </label>
          <label className="space-y-2 md:col-span-2">
            <span className="text-sm text-[var(--text-secondary)]">Description</span>
            <Textarea
              value={newEvent.description}
              onChange={(event) =>
                setNewEvent((current) => ({ ...current, description: event.target.value }))
              }
              className="min-h-24"
            />
          </label>
        </div>
        <div className="flex justify-end">
          <Button
            loading={isPending}
            onClick={() =>
              startSaving(async () => {
                if (!newEvent.type.trim()) {
                  pushToast("Event type is required.", "danger");
                  return;
                }

                await createOrUpdateEvent({
                  treeId: tree.id,
                  personId: person.id,
                  type: newEvent.type,
                  dateText: newEvent.dateText || null,
                  dateNormalized: null,
                  place: newEvent.place || null,
                  description: newEvent.description || null,
                });
                setNewEvent({
                  type: "",
                  dateText: "",
                  place: "",
                  description: "",
                });
                pushToast("Event saved.", "success");
                router.refresh();
              })
            }
          >
            Add event
          </Button>
        </div>
      </div>
      <div className="space-y-3">
        {events.length ? (
          events.map((event) => (
            <EditableEventCard
              key={event.id}
              tree={tree}
              person={person}
              event={event}
              onRefresh={() => router.refresh()}
            />
          ))
        ) : (
          <p className="text-sm text-[var(--text-muted)]">No custom events recorded yet.</p>
        )}
      </div>
    </Card>
  );
}

function EditableEventCard({
  tree,
  person,
  event,
  onRefresh,
}: {
  tree: Tree;
  person: PersonViewModel;
  event: EventRecord;
  onRefresh: () => void;
}) {
  const { pushToast } = useToast();
  const [type, setType] = useState(event.type);
  const [dateText, setDateText] = useState(event.dateText ?? "");
  const [place, setPlace] = useState(event.place ?? "");
  const [description, setDescription] = useState(event.description ?? "");
  const [isPending, startSaving] = useTransition();

  return (
    <div className="space-y-3 rounded-[var(--radius-md)] border border-[var(--border-default)] bg-[var(--bg-elevated)] p-4">
      <div className="grid gap-3 md:grid-cols-2">
        <label className="space-y-2">
          <span className="text-sm text-[var(--text-secondary)]">Type</span>
          <Input value={type} onChange={(currentEvent) => setType(currentEvent.target.value)} />
        </label>
        <label className="space-y-2">
          <span className="text-sm text-[var(--text-secondary)]">Date</span>
          <Input
            value={dateText}
            onChange={(currentEvent) => setDateText(currentEvent.target.value)}
          />
        </label>
        <label className="space-y-2 md:col-span-2">
          <span className="text-sm text-[var(--text-secondary)]">Place</span>
          <Input value={place} onChange={(currentEvent) => setPlace(currentEvent.target.value)} />
        </label>
        <label className="space-y-2 md:col-span-2">
          <span className="text-sm text-[var(--text-secondary)]">Description</span>
          <Textarea
            value={description}
            onChange={(currentEvent) => setDescription(currentEvent.target.value)}
            className="min-h-24"
          />
        </label>
      </div>
      <div className="flex flex-wrap justify-end gap-3">
        <Button
          type="button"
          variant="ghost"
          loading={isPending}
          onClick={() =>
            startSaving(async () => {
              if (
                typeof window !== "undefined" &&
                !window.confirm(`Delete the ${event.type} event for ${person.fullName}?`)
              ) {
                return;
              }

              await deleteEvent(event.id);
              pushToast("Event deleted.", "success");
              onRefresh();
            })
          }
        >
          Delete
        </Button>
        <Button
          type="button"
          loading={isPending}
          onClick={() =>
            startSaving(async () => {
              if (!type.trim()) {
                pushToast("Event type is required.", "danger");
                return;
              }

              await createOrUpdateEvent({
                treeId: tree.id,
                id: event.id,
                personId: person.id,
                type,
                dateText: dateText || null,
                dateNormalized: null,
                place: place || null,
                description: description || null,
              });
              pushToast("Event updated.", "success");
              onRefresh();
            })
          }
        >
          Save event
        </Button>
      </div>
    </div>
  );
}
