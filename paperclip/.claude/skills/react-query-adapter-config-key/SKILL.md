---
name: react-query-adapter-config-key
description: Use when config affects fetch: add config to query key.
category: data-fetching
---

When a React Query fetch depends on a derived configuration object (e.g., `buildAdapterConfig()` for FCC proxy), the query key **must** include a serialized form of that config so the query re-fetches when the config changes.

Pattern:
```typescript
const adapterConfig = buildAdapterConfig();
const { data } = useQuery({
  queryKey: queryKeys.agents.adapterModels(companyId, adapterType, JSON.stringify(adapterConfig)),
  queryFn: () => agentsApi.adapterModels(companyId, adapterType, { environmentId: null, adapterConfig }),
  enabled: Boolean(companyId) && step === 4,
});
```

Anti-pattern: Using a static key (e.g., `null` or omit config) causes stale data when FCC detection toggles — the model list won't refresh to show FCC-discovered models.