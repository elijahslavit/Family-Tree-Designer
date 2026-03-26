export type ThemeLayout = "classic" | "editorial" | "explorer";
export type ThemeSkin =
  | "dark-gold"
  | "parchment"
  | "modern"
  | "botanical"
  | "inkwash"
  | "portrait-gallery";
export type Gender = "male" | "female" | "unknown" | "other";
export type RelationshipType = "biological";
export type ReviewIssueType =
  | "duplicate"
  | "conflict"
  | "missing_data"
  | "parse_error";
export type ReviewIssueStatus = "open" | "resolved" | "dismissed";
export type ClaimConfidence = "accepted" | "probable" | "uncertain" | "disputed";

export interface Account {
  id: string;
  email: string;
  displayName: string;
  avatarUrl?: string | null;
  createdAt: string;
  plan: "free" | "pro";
}

export interface Tree {
  id: string;
  accountId: string;
  name: string;
  slug: string;
  description?: string | null;
  themeLayout: ThemeLayout;
  themeSkin: ThemeSkin;
  isPublic: boolean;
  shareToken: string;
  createdAt: string;
  updatedAt: string;
}

export interface Person {
  id: string;
  treeId: string;
  givenName: string;
  surname: string;
  fullName: string;
  suffix?: string | null;
  gender: Gender;
  birthDateText?: string | null;
  birthDateNormalized?: string | null;
  birthPlace?: string | null;
  deathDateText?: string | null;
  deathDateNormalized?: string | null;
  deathPlace?: string | null;
  summary?: string | null;
  biographyMd?: string | null;
  isLiving: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Family {
  id: string;
  treeId: string;
  spouse1Id: string;
  spouse2Id?: string | null;
  marriageDateText?: string | null;
  marriageDateNormalized?: string | null;
  marriagePlace?: string | null;
}

export interface FamilyChild {
  familyId: string;
  childId: string;
  order?: number | null;
  relationshipType: RelationshipType;
}

export interface EventRecord {
  id: string;
  treeId: string;
  personId: string;
  type: string;
  dateText?: string | null;
  dateNormalized?: string | null;
  place?: string | null;
  description?: string | null;
}

export interface Lineage {
  id: string;
  treeId: string;
  name: string;
  description?: string | null;
}

export interface LineageViewModel extends Lineage {
  members: Person[];
}

export interface LineageMember {
  lineageId: string;
  personId: string;
  order: number;
}

export interface SourceRecord {
  id: string;
  treeId: string;
  title: string;
  author?: string | null;
  url?: string | null;
  notes?: string | null;
  createdAt: string;
}

export interface ClaimRecord {
  id: string;
  treeId: string;
  subjectType: "person" | "family";
  subjectId: string;
  predicate: string;
  valueText: string;
  confidence: ClaimConfidence;
  notes?: string | null;
  createdAt: string;
}

export interface CitationRecord {
  id: string;
  claimId: string;
  sourceId: string;
  page?: string | null;
  notes?: string | null;
}

export interface ReviewIssue {
  id: string;
  treeId: string;
  type: ReviewIssueType;
  subjectType: "person" | "family" | "event";
  subjectId: string;
  description: string;
  status: ReviewIssueStatus;
  resolutionNote?: string | null;
  createdAt: string;
  resolvedAt?: string | null;
}

export interface ExternalId {
  id: string;
  treeId: string;
  subjectType: "person" | "family" | "source";
  subjectId: string;
  system: "gedcom" | "ancestry" | "familysearch" | "legacy_json";
  externalId: string;
}

export interface ImportJob {
  id: string;
  treeId: string;
  accountId: string;
  status: "pending" | "parsed" | "confirmed" | "failed";
  fileName: string;
  storagePath?: string | null;
  payloadJson?: string | null;
  counts: {
    people: number;
    families: number;
    events: number;
    issues: number;
  };
  issues: ReviewIssue[];
  createdAt: string;
  expiresAt: string;
}

export interface RelativeGroup {
  parents: Person[];
  siblings: Person[];
  spouses: Person[];
  children: Person[];
}

export interface TimelineItem {
  id: string;
  label: string;
  dateText?: string | null;
  dateNormalized?: string | null;
  place?: string | null;
  description?: string | null;
}

export interface DirectoryFilters {
  search?: string;
  surname?: string;
  lineageId?: string;
  sort?: "name" | "birth" | "death";
  page?: number;
  pageSize?: number;
}

export interface ViewerContext {
  mode: "creator" | "viewer";
  accountId?: string | null;
  shareToken?: string | null;
}

export interface TreeBundle {
  account: Account;
  tree: Tree;
  people: Person[];
  families: Family[];
  familyChildren: FamilyChild[];
  events: EventRecord[];
  lineages: Lineage[];
  lineageMembers: LineageMember[];
  sources: SourceRecord[];
  claims: ClaimRecord[];
  citations: CitationRecord[];
  reviewIssues: ReviewIssue[];
  externalIds: ExternalId[];
  importJobs: ImportJob[];
}

export interface PersonViewModel extends Person {
  relatives: RelativeGroup;
  lineages: Lineage[];
  timeline: TimelineItem[];
}

export interface CanvasNodeData extends Record<string, unknown> {
  id: string;
  label: string;
  subtitle?: string | null;
  summary?: string | null;
  isLiving: boolean;
  kind: "person" | "family";
  isFocus?: boolean;
  isHighlighted?: boolean;
  relationGroup?:
    | "focus"
    | "ancestor"
    | "sibling"
    | "spouse"
    | "descendant"
    | "relative";
  lineageNames?: string[];
}
