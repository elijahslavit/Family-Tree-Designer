"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";

import {
  createOrUpdateLineage,
  deleteLineage,
  updateLineageMembers,
} from "@/lib/actions";
import type { Lineage, Person, PersonViewModel, Tree } from "@/lib/types";
import { Button } from "@/components/foundation/button";
import { Card } from "@/components/foundation/card";
import { Input, Textarea } from "@/components/foundation/input";
import { useToast } from "@/components/foundation/toast";

type LineageWithMembers = Lineage & {
  members: Person[];
};

type PersonLineageManagerProps = {
  tree: Tree;
  person: PersonViewModel;
  lineages: LineageWithMembers[];
};

export function PersonLineageManager({
  tree,
  person,
  lineages,
}: PersonLineageManagerProps) {
  const router = useRouter();
  const { pushToast } = useToast();
  const [isPending, startSaving] = useTransition();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  return (
    <Card className="space-y-4">
      <div className="space-y-2">
        <h3 className="text-xl font-semibold text-[var(--text-primary)]">Lineages</h3>
        <p className="text-sm text-[var(--text-secondary)]">
          Create named descent lines and include or remove this person from each sequence.
        </p>
      </div>
      <div className="space-y-3 rounded-[var(--radius-md)] border border-dashed border-[var(--border-default)] p-4">
        <p className="font-semibold text-[var(--text-primary)]">Create lineage</p>
        <label className="space-y-2">
          <span className="text-sm text-[var(--text-secondary)]">Name</span>
          <Input value={name} onChange={(event) => setName(event.target.value)} />
        </label>
        <label className="space-y-2">
          <span className="text-sm text-[var(--text-secondary)]">Description</span>
          <Textarea
            value={description}
            onChange={(event) => setDescription(event.target.value)}
            className="min-h-24"
          />
        </label>
        <div className="flex justify-end">
          <Button
            loading={isPending}
            onClick={() =>
              startSaving(async () => {
                if (!name.trim()) {
                  pushToast("Lineage name is required.", "danger");
                  return;
                }

                await createOrUpdateLineage({
                  treeId: tree.id,
                  name,
                  description: description || null,
                });
                setName("");
                setDescription("");
                pushToast("Lineage created.", "success");
                router.refresh();
              })
            }
          >
            Create lineage
          </Button>
        </div>
      </div>
      <div className="space-y-3">
        {lineages.length ? (
          lineages.map((lineage) => (
            <LineageCard
              key={lineage.id}
              lineage={lineage}
              person={person}
              tree={tree}
              onRefresh={() => router.refresh()}
            />
          ))
        ) : (
          <p className="text-sm text-[var(--text-muted)]">No lineages created yet.</p>
        )}
      </div>
    </Card>
  );
}

function LineageCard({
  lineage,
  person,
  tree,
  onRefresh,
}: {
  lineage: LineageWithMembers;
  person: PersonViewModel;
  tree: Tree;
  onRefresh: () => void;
}) {
  const { pushToast } = useToast();
  const [name, setName] = useState(lineage.name);
  const [description, setDescription] = useState(lineage.description ?? "");
  const [isPending, startSaving] = useTransition();
  const isMember = lineage.members.some((member) => member.id === person.id);
  const memberIds = lineage.members.map((member) => member.id);
  const memberIndex = memberIds.indexOf(person.id);

  const moveMember = (direction: -1 | 1) => {
    const nextIndex = memberIndex + direction;

    if (memberIndex < 0 || nextIndex < 0 || nextIndex >= memberIds.length) {
      return memberIds;
    }

    const reordered = [...memberIds];
    const [current] = reordered.splice(memberIndex, 1);
    reordered.splice(nextIndex, 0, current);
    return reordered;
  };

  return (
    <div className="space-y-3 rounded-[var(--radius-md)] border border-[var(--border-default)] bg-[var(--bg-elevated)] p-4">
      <label className="space-y-2">
        <span className="text-sm text-[var(--text-secondary)]">Name</span>
        <Input value={name} onChange={(event) => setName(event.target.value)} />
      </label>
      <label className="space-y-2">
        <span className="text-sm text-[var(--text-secondary)]">Description</span>
        <Textarea
          value={description}
          onChange={(event) => setDescription(event.target.value)}
          className="min-h-24"
        />
      </label>
      <div className="space-y-2 text-sm text-[var(--text-secondary)]">
        <p className="font-semibold text-[var(--text-primary)]">Members</p>
        <p>{lineage.members.map((member) => member.fullName).join(" -> ") || "No members yet."}</p>
        {isMember ? (
          <div className="flex flex-wrap gap-2">
            <Button
              type="button"
              variant="ghost"
              loading={isPending}
              disabled={memberIndex <= 0}
              onClick={() =>
                startSaving(async () => {
                  await updateLineageMembers({
                    lineageId: lineage.id,
                    memberIds: moveMember(-1),
                  });
                  pushToast("Lineage order updated.", "success");
                  onRefresh();
                })
              }
            >
              Move earlier
            </Button>
            <Button
              type="button"
              variant="ghost"
              loading={isPending}
              disabled={memberIndex === -1 || memberIndex >= memberIds.length - 1}
              onClick={() =>
                startSaving(async () => {
                  await updateLineageMembers({
                    lineageId: lineage.id,
                    memberIds: moveMember(1),
                  });
                  pushToast("Lineage order updated.", "success");
                  onRefresh();
                })
              }
            >
              Move later
            </Button>
          </div>
        ) : null}
      </div>
      <div className="flex flex-wrap justify-between gap-3">
        <Button
          type="button"
          variant="ghost"
          loading={isPending}
          onClick={() =>
            startSaving(async () => {
              if (
                typeof window !== "undefined" &&
                !window.confirm(`Delete the lineage "${lineage.name}"?`)
              ) {
                return;
              }

              await deleteLineage(lineage.id);
              pushToast("Lineage deleted.", "success");
              onRefresh();
            })
          }
        >
          Delete
        </Button>
        <div className="flex flex-wrap gap-3">
          <Button
            type="button"
            variant="secondary"
            loading={isPending}
          onClick={() =>
            startSaving(async () => {
              const updatedMembers = isMember
                ? lineage.members
                    .filter((member) => member.id !== person.id)
                    .map((member) => member.id)
                : [...lineage.members.map((member) => member.id), person.id];

              await updateLineageMembers({
                lineageId: lineage.id,
                memberIds: updatedMembers,
              });
              pushToast(
                isMember ? "Person removed from lineage." : "Person added to lineage.",
                "success",
              );
              onRefresh();
            })
          }
          >
            {isMember ? "Remove from lineage" : "Add to lineage"}
          </Button>
          <Button
            type="button"
            loading={isPending}
            onClick={() =>
              startSaving(async () => {
                if (!name.trim()) {
                  pushToast("Lineage name is required.", "danger");
                  return;
                }

                await createOrUpdateLineage({
                  treeId: tree.id,
                  id: lineage.id,
                  name,
                  description: description || null,
                });
                pushToast("Lineage updated.", "success");
                onRefresh();
              })
            }
          >
            Save lineage
          </Button>
        </div>
      </div>
    </div>
  );
}
