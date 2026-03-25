"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";

import {
  addChild,
  createFamily,
  deleteFamily,
  removeChild,
  setParents,
} from "@/lib/actions";
import type { Family, FamilyChild, Person, PersonViewModel, Tree } from "@/lib/types";
import { Button } from "@/components/foundation/button";
import { Card } from "@/components/foundation/card";
import { Input, Select } from "@/components/foundation/input";
import { useToast } from "@/components/foundation/toast";

type PersonRelationshipManagerProps = {
  tree: Tree;
  person: PersonViewModel;
  people: Person[];
  families: Family[];
  familyChildren: FamilyChild[];
};

function getPersonName(people: Person[], personId?: string | null) {
  return people.find((candidate) => candidate.id === personId)?.fullName ?? "Unknown person";
}

export function PersonRelationshipManager({
  tree,
  person,
  people,
  families,
  familyChildren,
}: PersonRelationshipManagerProps) {
  const router = useRouter();
  const { pushToast } = useToast();
  const [isPending, startSaving] = useTransition();
  const [spouseId, setSpouseId] = useState("");
  const [marriageDateText, setMarriageDateText] = useState("");
  const [marriagePlace, setMarriagePlace] = useState("");
  const [fatherId, setFatherId] = useState(person.relatives.parents.find((relative) => relative.gender === "male")?.id ?? "");
  const [motherId, setMotherId] = useState(person.relatives.parents.find((relative) => relative.gender === "female")?.id ?? "");

  const eligiblePeople = people.filter((candidate) => candidate.id !== person.id);
  const ownFamilies = families.filter(
    (family) => family.spouse1Id === person.id || family.spouse2Id === person.id,
  );
  const parentFamilyIds = familyChildren
    .filter((item) => item.childId === person.id)
    .map((item) => item.familyId);
  const parentFamilies = families.filter((family) => parentFamilyIds.includes(family.id));

  return (
    <div className="space-y-4">
      <Card className="space-y-4">
        <div className="space-y-2">
          <h3 className="text-xl font-semibold text-[var(--text-primary)]">Parents</h3>
          <p className="text-sm text-[var(--text-secondary)]">
            Attach this person to an existing father and mother record. Single-parent families are allowed.
          </p>
        </div>
        {parentFamilies.length ? (
          <div className="rounded-[var(--radius-md)] bg-[var(--bg-elevated)] p-3 text-sm text-[var(--text-secondary)]">
            Current parent family:{" "}
            {parentFamilies
              .map(
                (family) =>
                  `${getPersonName(people, family.spouse1Id)} and ${family.spouse2Id ? getPersonName(people, family.spouse2Id) : "single parent"}`,
              )
              .join(", ")}
          </div>
        ) : null}
        <div className="grid gap-3 md:grid-cols-2">
          <label className="space-y-2">
            <span className="text-sm text-[var(--text-secondary)]">Father</span>
            <Select value={fatherId} onChange={(event) => setFatherId(event.target.value)}>
              <option value="">Not set</option>
              {eligiblePeople.map((candidate) => (
                <option key={candidate.id} value={candidate.id}>
                  {candidate.fullName}
                </option>
              ))}
            </Select>
          </label>
          <label className="space-y-2">
            <span className="text-sm text-[var(--text-secondary)]">Mother</span>
            <Select value={motherId} onChange={(event) => setMotherId(event.target.value)}>
              <option value="">Not set</option>
              {eligiblePeople.map((candidate) => (
                <option key={candidate.id} value={candidate.id}>
                  {candidate.fullName}
                </option>
              ))}
            </Select>
          </label>
        </div>
        <div className="flex justify-end">
          <Button
            loading={isPending}
            onClick={() =>
              startSaving(async () => {
                if (!fatherId && !motherId) {
                  pushToast("Select at least one parent before saving.", "danger");
                  return;
                }

                await setParents({
                  treeId: tree.id,
                  personId: person.id,
                  fatherId: fatherId || null,
                  motherId: motherId || null,
                });
                pushToast("Parents updated.", "success");
                router.refresh();
              })
            }
          >
            Save parents
          </Button>
        </div>
      </Card>

      <Card className="space-y-4">
        <div className="space-y-2">
          <h3 className="text-xl font-semibold text-[var(--text-primary)]">Spouses and children</h3>
          <p className="text-sm text-[var(--text-secondary)]">
            Create family units, attach children, and remove outdated connections.
          </p>
        </div>
        <div className="grid gap-3 md:grid-cols-3">
          <label className="space-y-2 md:col-span-1">
            <span className="text-sm text-[var(--text-secondary)]">Spouse</span>
            <Select value={spouseId} onChange={(event) => setSpouseId(event.target.value)}>
              <option value="">Single parent family</option>
              {eligiblePeople.map((candidate) => (
                <option key={candidate.id} value={candidate.id}>
                  {candidate.fullName}
                </option>
              ))}
            </Select>
          </label>
          <label className="space-y-2">
            <span className="text-sm text-[var(--text-secondary)]">Marriage date</span>
            <Input
              value={marriageDateText}
              onChange={(event) => setMarriageDateText(event.target.value)}
            />
          </label>
          <label className="space-y-2">
            <span className="text-sm text-[var(--text-secondary)]">Marriage place</span>
            <Input
              value={marriagePlace}
              onChange={(event) => setMarriagePlace(event.target.value)}
            />
          </label>
        </div>
        <div className="flex justify-end">
          <Button
            loading={isPending}
            onClick={() =>
              startSaving(async () => {
                await createFamily({
                  treeId: tree.id,
                  spouse1Id: person.id,
                  spouse2Id: spouseId || null,
                  marriageDateText: marriageDateText || null,
                  marriageDateNormalized: null,
                  marriagePlace: marriagePlace || null,
                });
                setSpouseId("");
                setMarriageDateText("");
                setMarriagePlace("");
                pushToast("Family created.", "success");
                router.refresh();
              })
            }
          >
            Create family
          </Button>
        </div>
        <div className="space-y-3">
          {ownFamilies.length ? (
            ownFamilies.map((family) => (
              <FamilyCard
                key={family.id}
                family={family}
                people={people}
                familyChildren={familyChildren}
                currentPersonId={person.id}
                isPending={isPending}
                onAddChild={(childId) =>
                  startSaving(async () => {
                    await addChild({
                      familyId: family.id,
                      childId,
                    });
                    pushToast("Child linked to family.", "success");
                    router.refresh();
                  })
                }
                onRemoveChild={(childId) =>
                  startSaving(async () => {
                    await removeChild({
                      familyId: family.id,
                      childId,
                    });
                    pushToast("Child removed from family.", "success");
                    router.refresh();
                  })
                }
                onDelete={() =>
                  startSaving(async () => {
                    if (
                      typeof window !== "undefined" &&
                      !window.confirm("Delete this family and its child links?")
                    ) {
                      return;
                    }

                    await deleteFamily(family.id);
                    pushToast("Family deleted.", "success");
                    router.refresh();
                  })
                }
              />
            ))
          ) : (
            <p className="text-sm text-[var(--text-muted)]">No spouse or child families recorded yet.</p>
          )}
        </div>
      </Card>
    </div>
  );
}

function FamilyCard({
  family,
  people,
  familyChildren,
  currentPersonId,
  isPending,
  onAddChild,
  onRemoveChild,
  onDelete,
}: {
  family: Family;
  people: Person[];
  familyChildren: FamilyChild[];
  currentPersonId: string;
  isPending: boolean;
  onAddChild: (childId: string) => void;
  onRemoveChild: (childId: string) => void;
  onDelete: () => void;
}) {
  const [childId, setChildId] = useState("");
  const childLinks = familyChildren.filter((item) => item.familyId === family.id);
  const availableChildren = people.filter(
    (candidate) =>
      candidate.id !== currentPersonId &&
      candidate.id !== family.spouse1Id &&
      candidate.id !== family.spouse2Id &&
      !childLinks.some((link) => link.childId === candidate.id),
  );
  const spouseLabel =
    family.spouse1Id === currentPersonId
      ? getPersonName(people, family.spouse2Id)
      : getPersonName(people, family.spouse1Id);

  return (
    <div className="space-y-3 rounded-[var(--radius-md)] border border-[var(--border-default)] bg-[var(--bg-elevated)] p-4">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="space-y-1">
          <p className="font-semibold text-[var(--text-primary)]">
            {family.spouse2Id ? `With ${spouseLabel}` : "Single-parent family"}
          </p>
          <p className="text-sm text-[var(--text-secondary)]">
            {family.marriageDateText || "No marriage date"} {family.marriagePlace ? `· ${family.marriagePlace}` : ""}
          </p>
        </div>
        <Button type="button" variant="ghost" loading={isPending} onClick={onDelete}>
          Delete family
        </Button>
      </div>
      <div className="space-y-2">
        <p className="text-sm font-semibold text-[var(--text-primary)]">Children</p>
        {childLinks.length ? (
          childLinks.map((link) => (
            <div key={`${link.familyId}:${link.childId}`} className="flex items-center justify-between gap-3 text-sm">
              <span className="text-[var(--text-secondary)]">{getPersonName(people, link.childId)}</span>
              <Button
                type="button"
                variant="ghost"
                loading={isPending}
                onClick={() => onRemoveChild(link.childId)}
              >
                Remove
              </Button>
            </div>
          ))
        ) : (
          <p className="text-sm text-[var(--text-muted)]">No children linked yet.</p>
        )}
      </div>
      <div className="flex flex-wrap items-end gap-3">
        <label className="min-w-[220px] flex-1 space-y-2">
          <span className="text-sm text-[var(--text-secondary)]">Add child</span>
          <Select value={childId} onChange={(event) => setChildId(event.target.value)}>
            <option value="">Select a person</option>
            {availableChildren.map((candidate) => (
              <option key={candidate.id} value={candidate.id}>
                {candidate.fullName}
              </option>
            ))}
          </Select>
        </label>
        <Button
          type="button"
          loading={isPending}
          onClick={() => {
            if (!childId) {
              return;
            }

            if (childLinks.some((link) => link.childId === childId)) {
              return;
            }

            onAddChild(childId);
            setChildId("");
          }}
        >
          Add child
        </Button>
      </div>
    </div>
  );
}
