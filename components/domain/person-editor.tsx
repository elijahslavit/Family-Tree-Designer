"use client";

import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { useForm, useWatch } from "react-hook-form";

import { createPerson, deletePerson, updatePerson } from "@/lib/actions";
import { BiographyRenderer } from "@/components/domain/biography-renderer";
import type { Person, Tree } from "@/lib/types";
import { Input, Select, Textarea } from "@/components/foundation/input";
import { Button } from "@/components/foundation/button";
import { Card } from "@/components/foundation/card";
import { useToast } from "@/components/foundation/toast";

type PersonEditorProps = {
  tree: Tree;
  person?: Person;
};

type PersonFormValues = {
  givenName: string;
  surname: string;
  gender: "male" | "female" | "unknown" | "other";
  birthDateText: string;
  birthPlace: string;
  deathDateText: string;
  deathPlace: string;
  summary: string;
  biographyMd: string;
  isLiving: boolean;
};

export function PersonEditor({ tree, person }: PersonEditorProps) {
  const router = useRouter();
  const { pushToast } = useToast();
  const [isPending, startSaving] = useTransition();
  const form = useForm<PersonFormValues>({
    defaultValues: {
      givenName: person?.givenName ?? "",
      surname: person?.surname ?? "",
      gender: person?.gender ?? "unknown",
      birthDateText: person?.birthDateText ?? "",
      birthPlace: person?.birthPlace ?? "",
      deathDateText: person?.deathDateText ?? "",
      deathPlace: person?.deathPlace ?? "",
      summary: person?.summary ?? "",
      biographyMd: person?.biographyMd ?? "",
      isLiving: person?.isLiving ?? false,
    },
  });
  const biographyPreview = useWatch({
    control: form.control,
    name: "biographyMd",
  });

  const onSubmit = form.handleSubmit((values) => {
    startSaving(async () => {
      const payload = {
        treeId: tree.id,
        id: person?.id,
        givenName: values.givenName,
        surname: values.surname,
        gender: values.gender,
        birthDateText: values.birthDateText || null,
        birthDateNormalized: null,
        birthPlace: values.birthPlace || null,
        deathDateText: values.deathDateText || null,
        deathDateNormalized: null,
        deathPlace: values.deathPlace || null,
        summary: values.summary || null,
        biographyMd: values.biographyMd || null,
        isLiving: values.isLiving,
        suffix: null,
      };

      if (person) {
        await updatePerson(payload);
        pushToast("Person updated.", "success");
        router.push(`/person/${person.id}`);
      } else {
        const personId = await createPerson(payload);
        pushToast("Person created. Continue with relationships and events next.", "success");
        router.push(`/person/${personId}/edit`);
      }
    });
  });

  return (
    <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_minmax(0,0.9fr)]">
      <Card className="space-y-5">
      <div className="space-y-2">
        <p className="text-xs uppercase tracking-[0.16em] text-[var(--text-muted)]">
          Person editor
        </p>
        <h2 className="text-2xl font-semibold text-[var(--text-primary)]">
          {person ? "Edit person" : "Add person"}
        </h2>
      </div>
      <form className="grid gap-4 md:grid-cols-2" onSubmit={onSubmit}>
        <label className="space-y-2">
          <span className="text-sm text-[var(--text-secondary)]">Given name</span>
          <Input {...form.register("givenName")} />
        </label>
        <label className="space-y-2">
          <span className="text-sm text-[var(--text-secondary)]">Surname</span>
          <Input {...form.register("surname")} />
        </label>
        <label className="space-y-2">
          <span className="text-sm text-[var(--text-secondary)]">Gender</span>
          <Select {...form.register("gender")}>
            <option value="unknown">Unknown</option>
            <option value="female">Female</option>
            <option value="male">Male</option>
            <option value="other">Other</option>
          </Select>
        </label>
        <label className="space-y-2">
          <span className="text-sm text-[var(--text-secondary)]">Living person</span>
          <div className="flex items-center gap-3 rounded-[var(--radius-md)] border border-[var(--border-default)] px-3 py-2">
            <input type="checkbox" {...form.register("isLiving")} />
            <span className="text-sm text-[var(--text-secondary)]">
              Hide sensitive details in public view
            </span>
          </div>
        </label>
        <label className="space-y-2">
          <span className="text-sm text-[var(--text-secondary)]">Birth date</span>
          <Input {...form.register("birthDateText")} />
        </label>
        <label className="space-y-2">
          <span className="text-sm text-[var(--text-secondary)]">Birth place</span>
          <Input {...form.register("birthPlace")} />
        </label>
        <label className="space-y-2">
          <span className="text-sm text-[var(--text-secondary)]">Death date</span>
          <Input {...form.register("deathDateText")} />
        </label>
        <label className="space-y-2">
          <span className="text-sm text-[var(--text-secondary)]">Death place</span>
          <Input {...form.register("deathPlace")} />
        </label>
        <label className="space-y-2 md:col-span-2">
          <span className="text-sm text-[var(--text-secondary)]">Summary</span>
          <Textarea {...form.register("summary")} className="min-h-24" />
        </label>
        <label className="space-y-2 md:col-span-2">
          <span className="text-sm text-[var(--text-secondary)]">Biography (Markdown)</span>
          <Textarea {...form.register("biographyMd")} className="min-h-52" />
        </label>
        <div className="md:col-span-2 flex justify-between gap-3">
          {person ? (
            <Button
              loading={isPending}
              type="button"
              variant="danger"
              onClick={() =>
                startSaving(async () => {
                  if (
                    typeof window !== "undefined" &&
                    !window.confirm(`Delete ${person.fullName} and all connected records?`)
                  ) {
                    return;
                  }

                  await deletePerson(person.id);
                  pushToast("Person deleted.", "success");
                  router.push("/directory");
                })
              }
            >
              Delete person
            </Button>
          ) : (
            <span />
          )}
          <Button loading={isPending} type="submit">
            {person ? "Save changes" : "Create person"}
          </Button>
        </div>
      </form>
      </Card>
      <div className="space-y-4">
        <Card className="space-y-3">
          <p className="text-xs uppercase tracking-[0.16em] text-[var(--text-muted)]">
            Live preview
          </p>
          <h3 className="text-xl font-semibold text-[var(--text-primary)]">
            Biography rendering
          </h3>
          <p className="text-sm text-[var(--text-secondary)]">
            Markdown is sanitized before rendering. This preview matches the profile surface.
          </p>
        </Card>
        <BiographyRenderer markdown={biographyPreview} />
      </div>
    </div>
  );
}
