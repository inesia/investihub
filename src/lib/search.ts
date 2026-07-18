import type { CaseStatus, CaseWithRelations } from "@/types";
import { STATUS_LABELS } from "@/types";

export interface SearchFilters {
  query: string;
  status: CaseStatus | "ALL";
  assignee: string;
  client: string;
  dateFrom: string;
  dateTo: string;
}

export const DEFAULT_SEARCH_FILTERS: SearchFilters = {
  query: "",
  status: "ALL",
  assignee: "",
  client: "",
  dateFrom: "",
  dateTo: "",
};

export interface SearchResultItem {
  id: string;
  type: "case" | "client";
  title: string;
  subtitle: string;
  meta: string;
  href: string;
  status?: CaseStatus;
}

import { getClients } from "./client-store";

export const mockClients = getClients();

function normalize(value: string): string {
  return value.toLowerCase().trim();
}

function matchesQuery(text: string, query: string): boolean {
  return normalize(text).includes(normalize(query));
}

function caseSearchableText(caseItem: CaseWithRelations): string {
  return [
    caseItem.id,
    caseItem.policyNumber,
    caseItem.insuredName,
    caseItem.description ?? "",
    STATUS_LABELS[caseItem.status],
    caseItem.status,
    caseItem.client.name,
    caseItem.client.companyName ?? "",
    caseItem.assignee?.name ?? "",
    caseItem.assignee?.name ?? "unassigned",
  ].join(" ");
}

export function filterCases(
  cases: CaseWithRelations[],
  filters: SearchFilters
): CaseWithRelations[] {
  return cases.filter((caseItem) => {
    if (filters.status !== "ALL" && caseItem.status !== filters.status) {
      return false;
    }

    if (filters.assignee.trim()) {
      const assigneeName = caseItem.assignee?.name ?? "unassigned";
      if (!matchesQuery(assigneeName, filters.assignee)) return false;
    }

    if (filters.client.trim()) {
      const clientText = `${caseItem.client.companyName ?? ""} ${caseItem.client.name}`;
      if (!matchesQuery(clientText, filters.client)) return false;
    }

    if (filters.dateFrom) {
      const from = new Date(filters.dateFrom);
      if (caseItem.createdAt < from) return false;
    }

    if (filters.dateTo) {
      const to = new Date(filters.dateTo);
      to.setHours(23, 59, 59, 999);
      if (caseItem.createdAt > to) return false;
    }

    if (filters.query.trim()) {
      const tokens = filters.query.trim().split(/\s+/);
      const haystack = caseSearchableText(caseItem);
      const allTokensMatch = tokens.every((token) => matchesQuery(haystack, token));
      if (!allTokensMatch) return false;
    }

    return true;
  });
}

export function searchAll(
  cases: CaseWithRelations[],
  filters: SearchFilters,
  options?: { includeClients?: boolean }
): SearchResultItem[] {
  const results: SearchResultItem[] = [];
  const filteredCases = filterCases(cases, filters);

  for (const caseItem of filteredCases) {
    results.push({
      id: caseItem.id,
      type: "case",
      title: caseItem.insuredName,
      subtitle: caseItem.policyNumber,
      meta: `${STATUS_LABELS[caseItem.status]} · ${caseItem.assignee?.name ?? "Unassigned"}`,
      href: `/dashboard/cases/${caseItem.id}`,
      status: caseItem.status,
    });
  }

  if (options?.includeClients) {
    const clientQuery = filters.query || filters.client;
    for (const client of mockClients) {
      const clientHaystack = `${client.name} ${client.email} ${client.phone}`;
      const passesClientFilter =
        !filters.client.trim() || matchesQuery(clientHaystack, filters.client);
      const passesQuery =
        !clientQuery.trim() ||
        clientQuery
          .trim()
          .split(/\s+/)
          .every((token) => matchesQuery(clientHaystack, token));

      if (passesClientFilter && passesQuery) {
        results.push({
          id: client.id,
          type: "client",
          title: client.name,
          subtitle: client.email,
          meta: `${client.activeCases} active cases`,
          href: "/dashboard/clients",
        });
      }
    }
  }

  return results;
}

export function filtersToParams(filters: SearchFilters): URLSearchParams {
  const params = new URLSearchParams();
  if (filters.query) params.set("q", filters.query);
  if (filters.status !== "ALL") params.set("status", filters.status);
  if (filters.assignee) params.set("assignee", filters.assignee);
  if (filters.client) params.set("client", filters.client);
  if (filters.dateFrom) params.set("from", filters.dateFrom);
  if (filters.dateTo) params.set("to", filters.dateTo);
  return params;
}

export function paramsToFilters(params: URLSearchParams): SearchFilters {
  return {
    query: params.get("q") ?? "",
    status: (params.get("status") as CaseStatus | "ALL") ?? "ALL",
    assignee: params.get("assignee") ?? "",
    client: params.get("client") ?? "",
    dateFrom: params.get("from") ?? "",
    dateTo: params.get("to") ?? "",
  };
}

export function hasActiveFilters(filters: SearchFilters): boolean {
  return (
    Boolean(filters.query.trim()) ||
    filters.status !== "ALL" ||
    Boolean(filters.assignee.trim()) ||
    Boolean(filters.client.trim()) ||
    Boolean(filters.dateFrom) ||
    Boolean(filters.dateTo)
  );
}
