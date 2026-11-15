// Cliente REST seguro para a API do Render (https://api.render.com/v1).
//
// Princípios de segurança:
// - A RENDER_API_KEY vem ÚNICAMENTE de process.env (nunca é lida de arquivo,
//   nunca impressa em logs nem incluída em mensagens de erro).
// - Qualquer exceção que envolva a requisição é capturada e a chave é
//   redigida antes de qualquer saída.
// - Operações de escrita (POST/PATCH/DELETE/PUT) estão definidas mas NÃO são
//   executadas neste módulo sem chamada explícita do operador.
//
// Uso:
//   node --experimental-strip-types scripts/render-client.mts owners
//   node --experimental-strip-types scripts/render-client.mts services tea-...

const BASE_URL = "https://api.render.com/v1";

// TypeScript: process.env nao tem tipos Node aqui. Definicao minima.
declare const process: {
  env: Record<string, string>;
  argv: string[];
  exit(code?: number): never;
};

function requireKey(): string {
  const key = process.env.RENDER_API_KEY;
  if (!key || key.length === 0) {
    throw new Error(
      "RENDER_API_KEY não definida no ambiente. Defina a variável e tente novamente.",
    );
  }
  return key;
}

// Redage qualquer aparição acidental da chave em uma string (defesa em profundidade).
function redactKey(text: string): string {
  const key = process.env.RENDER_API_KEY;
  if (!key) return text;
  return text.split(key).join("***RENDER_API_KEY***");
}

type HttpMethod = "GET" | "POST" | "PATCH" | "PUT" | "DELETE";

interface RenderRequestOptions {
  method: HttpMethod;
  path: string;
  body?: unknown;
  query?: Record<string, string | number | boolean>;
}

async function renderRequest<T = unknown>(opts: RenderRequestOptions): Promise<T> {
  const key = requireKey();
  const url = new URL(BASE_URL + opts.path);
  if (opts.query) {
    for (const [k, v] of Object.entries(opts.query)) {
      url.searchParams.append(k, String(v));
    }
  }

  const headers: HeadersInit = {
    Authorization: `Bearer ${key}`,
    Accept: "application/json",
  };
  if (opts.body !== undefined) {
    headers["Content-Type"] = "application/json";
  }

  let response: Response;
  try {
    response = await fetch(url.toString(), {
      method: opts.method,
      headers,
      body: opts.body !== undefined ? JSON.stringify(opts.body) : undefined,
      // Nunca repassa credenciais do ambiente além da própria chave do Render.
    });
  } catch (err) {
    // Erro de rede/transporte: não há corpo da resposta para vazar a chave.
    throw new Error(
      `Erro de transporte ao chamar ${opts.method} ${opts.path}: ${redactKey(String(err))}`,
    );
  }

  let bodyText = "";
  try {
    bodyText = await response.text();
  } catch {
    // Se não conseguir ler o corpo, segue com texto vazio.
  }

  if (!response.ok) {
    // Redage a chave no corpo da resposta de erro antes de lançar.
    throw new Error(
      `Render API ${response.status} ${response.statusText} para ${opts.method} ${opts.path}: ${redactKey(bodyText)}`,
    );
  }

  if (!bodyText || bodyText.trim().length === 0) {
    return undefined as T;
  }

  try {
    return JSON.parse(bodyText) as T;
  } catch (err) {
    throw new Error(
      `Não foi possível analisar JSON da resposta de ${opts.method} ${opts.path}: ${redactKey(String(err))}`,
    );
  }
}

// ============================================================================
// API de somente leitura (workspaces/owners)
// ============================================================================

interface Owner {
  id: string;
  name: string;
  email: string;
  type: string;
}

interface OwnersResponse {
  cursor?: string;
  owner: Owner[];
}

export async function listOwners(query?: Record<string, string | number | boolean>): Promise<OwnersResponse> {
  return renderRequest<OwnersResponse>({ method: "GET", path: "/owners", query });
}

export async function retrieveOwner(ownerId: string): Promise<Owner> {
  return renderRequest<Owner>({ method: "GET", path: `/owners/${encodeURIComponent(ownerId)}` });
}

// ============================================================================
// Usuário autenticado
// ============================================================================

interface User {
  id: string;
  email: string;
  name?: string;
}

export async function getAuthenticatedUser(): Promise<User> {
  return renderRequest<User>({ method: "GET", path: "/user" });
}

// ============================================================================
// Serviços
// ============================================================================

interface Service {
  id: string;
  name: string;
  type: string;
  region: string;
  status: string;
  owner_id: string;
  service_details?: unknown;
  env?: unknown;
  created_at?: string;
  updated_at?: string;
}

interface ServicesResponse {
  cursor?: string;
  services: Service[];
}

export async function listServices(query?: Record<string, string | number | boolean>): Promise<ServicesResponse> {
  return renderRequest<ServicesResponse>({ method: "GET", path: "/services", query });
}

export async function retrieveService(serviceId: string): Promise<Service> {
  return renderRequest<Service>({ method: "GET", path: `/services/${encodeURIComponent(serviceId)}` });
}

// ============================================================================
// Deploys
// ============================================================================

interface Deploy {
  id: string;
  service_id: string;
  status: string;
  commit?: string;
  created_at?: string;
  updated_at?: string;
}

interface DeploysResponse {
  cursor?: string;
  deploys: Deploy[];
}

export async function listDeploys(serviceId: string, query?: Record<string, string | number | boolean>): Promise<DeploysResponse> {
  return renderRequest<DeploysResponse>({ method: "GET", path: `/services/${encodeURIComponent(serviceId)}/deploys`, query });
}

export async function retrieveDeploy(serviceId: string, deployId: string): Promise<Deploy> {
  return renderRequest<Deploy>({ method: "GET", path: `/services/${encodeURIComponent(serviceId)}/deploys/${encodeURIComponent(deployId)}` });
}

export async function triggerDeploy(serviceId: string): Promise<Deploy> {
  return renderRequest<Deploy>({ method: "POST", path: `/services/${encodeURIComponent(serviceId)}/deploys` });
}

export async function cancelDeploy(serviceId: string, deployId: string): Promise<{ id: string; status: string }> {
  return renderRequest<{ id: string; status: string }>({
    method: "DELETE",
    path: `/services/${encodeURIComponent(serviceId)}/deploys/${encodeURIComponent(deployId)}`,
  });
}

// ============================================================================
// Eventos de serviço
// ============================================================================

interface Event {
  id: string;
  service_id?: string;
  type: string;
  message: string;
  created_at?: string;
}

interface EventsResponse {
  cursor?: string;
  events: Event[];
}

export async function listEvents(serviceId: string, query?: Record<string, string | number | boolean>): Promise<EventsResponse> {
  return renderRequest<EventsResponse>({ method: "GET", path: `/services/${encodeURIComponent(serviceId)}/events`, query });
}

// ============================================================================
// Instâncias de serviço
// ============================================================================

interface Instance {
  id: string;
  service_id: string;
  status: string;
  region: string;
  ip?: string;
}

interface InstancesResponse {
  cursor?: string;
  instances: Instance[];
}

export async function listInstances(serviceId: string): Promise<InstancesResponse> {
  return renderRequest<InstancesResponse>({ method: "GET", path: `/services/${encodeURIComponent(serviceId)}/instances` });
}

// ============================================================================
// IP de saída do serviço
// ============================================================================

interface OutboundIPs {
  service_id: string;
  ips: string[];
}

export async function retrieveServiceOutboundIPs(serviceId: string): Promise<OutboundIPs> {
  return renderRequest<OutboundIPs>({ method: "GET", path: `/services/${encodeURIComponent(serviceId)}/outbound-ips` });
}

// ============================================================================
// Variáveis de ambiente por serviço
// ============================================================================

interface EnvVar {
  key: string;
  value: string;
  sync?: boolean;
}

interface EnvVarsResponse {
  cursor?: string;
  env_vars: EnvVar[];
}

export async function listEnvVars(serviceId: string): Promise<EnvVarsResponse> {
  return renderRequest<EnvVarsResponse>({ method: "GET", path: `/services/${encodeURIComponent(serviceId)}/env-vars` });
}

export async function retrieveEnvVar(serviceId: string, key: string): Promise<EnvVar> {
  return renderRequest<EnvVar>({ method: "GET", path: `/services/${encodeURIComponent(serviceId)}/env-vars/${encodeURIComponent(key)}` });
}

export async function addOrUpdateEnvVar(serviceId: string, body: EnvVar): Promise<EnvVar> {
  return renderRequest<EnvVar>({ method: "POST", path: `/services/${encodeURIComponent(serviceId)}/env-vars`, body });
}

export async function updateEnvVars(serviceId: string, body: EnvVar[]): Promise<EnvVarsResponse> {
  return renderRequest<EnvVarsResponse>({ method: "PUT", path: `/services/${encodeURIComponent(serviceId)}/env-vars`, body });
}

export async function deleteEnvVar(serviceId: string, key: string): Promise<void> {
  return renderRequest<void>({ method: "DELETE", path: `/services/${encodeURIComponent(serviceId)}/env-vars/${encodeURIComponent(key)}` });
}

// ============================================================================
// Postgres
// ============================================================================

interface PostgresInstance {
  id: string;
  name: string;
  region: string;
  status: string;
  owner_id: string;
  database?: string;
  user?: string;
  created_at?: string;
  updated_at?: string;
}

interface PostgresResponse {
  cursor?: string;
  postgres_instances: PostgresInstance[];
}

export async function listPostgres(query?: Record<string, string | number | boolean>): Promise<PostgresResponse> {
  return renderRequest<PostgresResponse>({ method: "GET", path: "/postgres", query });
}

export async function retrievePostgres(instanceId: string): Promise<PostgresInstance> {
  return renderRequest<PostgresInstance>({ method: "GET", path: `/postgres/${encodeURIComponent(instanceId)}` });
}

export async function createPostgres(body: unknown): Promise<PostgresInstance> {
  return renderRequest<PostgresInstance>({ method: "POST", path: "/postgres", body });
}

export async function updatePostgres(instanceId: string, body: unknown): Promise<PostgresInstance> {
  return renderRequest<PostgresInstance>({ method: "PATCH", path: `/postgres/${encodeURIComponent(instanceId)}`, body });
}

export async function deletePostgres(instanceId: string): Promise<void> {
  return renderRequest<void>({ method: "DELETE", path: `/postgres/${encodeURIComponent(instanceId)}` });
}

export async function retrievePostgresConnectionInfo(instanceId: string): Promise<unknown> {
  return renderRequest<unknown>({ method: "GET", path: `/postgres/${encodeURIComponent(instanceId)}/connection-info` });
}

export async function suspendPostgres(instanceId: string): Promise<PostgresInstance> {
  return renderRequest<PostgresInstance>({ method: "POST", path: `/postgres/${encodeURIComponent(instanceId)}/suspend` });
}

export async function resumePostgres(instanceId: string): Promise<PostgresInstance> {
  return renderRequest<PostgresInstance>({ method: "POST", path: `/postgres/${encodeURIComponent(instanceId)}/resume` });
}

export async function restartPostgres(instanceId: string): Promise<PostgresInstance> {
  return renderRequest<PostgresInstance>({ method: "POST", path: `/postgres/${encodeURIComponent(instanceId)}/restart` });
}

export async function failoverPostgres(instanceId: string): Promise<PostgresInstance> {
  return renderRequest<PostgresInstance>({ method: "POST", path: `/postgres/${encodeURIComponent(instanceId)}/failover` });
}

// ============================================================================
// Key Value
// ============================================================================

interface KeyValueInstance {
  id: string;
  name: string;
  region: string;
  status: string;
  owner_id: string;
  created_at?: string;
  updated_at?: string;
}

interface KeyValueResponse {
  cursor?: string;
  key_value_instances: KeyValueInstance[];
}

export async function listKeyValue(query?: Record<string, string | number | boolean>): Promise<KeyValueResponse> {
  return renderRequest<KeyValueResponse>({ method: "GET", path: "/key-value", query });
}

export async function retrieveKeyValue(instanceId: string): Promise<KeyValueInstance> {
  return renderRequest<KeyValueInstance>({ method: "GET", path: `/key-value/${encodeURIComponent(instanceId)}` });
}

export async function createKeyValue(body: unknown): Promise<KeyValueInstance> {
  return renderRequest<KeyValueInstance>({ method: "POST", path: "/key-value", body });
}

export async function updateKeyValue(instanceId: string, body: unknown): Promise<KeyValueInstance> {
  return renderRequest<KeyValueInstance>({ method: "PATCH", path: `/key-value/${encodeURIComponent(instanceId)}`, body });
}

export async function deleteKeyValue(instanceId: string): Promise<void> {
  return renderRequest<void>({ method: "DELETE", path: `/key-value/${encodeURIComponent(instanceId)}` });
}

export async function retrieveKeyValueConnectionInfo(instanceId: string): Promise<unknown> {
  return renderRequest<unknown>({ method: "GET", path: `/key-value/${encodeURIComponent(instanceId)}/connection-info` });
}

export async function suspendKeyValue(instanceId: string): Promise<KeyValueInstance> {
  return renderRequest<KeyValueInstance>({ method: "POST", path: `/key-value/${encodeURIComponent(instanceId)}/suspend` });
}

export async function resumeKeyValue(instanceId: string): Promise<KeyValueInstance> {
  return renderRequest<KeyValueInstance>({ method: "POST", path: `/key-value/${encodeURIComponent(instanceId)}/resume` });
}

// ============================================================================
// Disks
// ============================================================================

interface Disk {
  id: string;
  name: string;
  region: string;
  size_gb: number;
  status: string;
  service_id?: string;
  created_at?: string;
  updated_at?: string;
}

interface DisksResponse {
  cursor?: string;
  disks: Disk[];
}

export async function listDisks(query?: Record<string, string | number | boolean>): Promise<DisksResponse> {
  return renderRequest<DisksResponse>({ method: "GET", path: "/disks", query });
}

export async function retrieveDisk(diskId: string): Promise<Disk> {
  return renderRequest<Disk>({ method: "GET", path: `/disks/${encodeURIComponent(diskId)}` });
}

export async function addDisk(body: unknown): Promise<Disk> {
  return renderRequest<Disk>({ method: "POST", path: "/disks", body });
}

export async function updateDisk(diskId: string, body: unknown): Promise<Disk> {
  return renderRequest<Disk>({ method: "PATCH", path: `/disks/${encodeURIComponent(diskId)}`, body });
}

export async function deleteDisk(diskId: string): Promise<void> {
  return renderRequest<void>({ method: "DELETE", path: `/disks/${encodeURIComponent(diskId)}` });
}

export async function listDiskSnapshots(diskId: string): Promise<{ cursor?: string; snapshots: unknown[] }> {
  return renderRequest<{ cursor?: string; snapshots: unknown[] }>({ method: "GET", path: `/disks/${encodeURIComponent(diskId)}/snapshots` });
}

// ============================================================================
// Domínios personalizados
// ============================================================================

interface CustomDomain {
  id: string;
  name: string;
  service_id: string;
  status: string;
  dns_configured: boolean;
  created_at?: string;
  updated_at?: string;
}

interface CustomDomainsResponse {
  cursor?: string;
  custom_domains: CustomDomain[];
}

export async function listCustomDomains(serviceId: string): Promise<CustomDomainsResponse> {
  return renderRequest<CustomDomainsResponse>({ method: "GET", path: `/services/${encodeURIComponent(serviceId)}/custom-domains` });
}

export async function addCustomDomain(serviceId: string, body: unknown): Promise<CustomDomain> {
  return renderRequest<CustomDomain>({ method: "POST", path: `/services/${encodeURIComponent(serviceId)}/custom-domains`, body });
}

export async function retrieveCustomDomain(serviceId: string, domainId: string): Promise<CustomDomain> {
  return renderRequest<CustomDomain>({ method: "GET", path: `/services/${encodeURIComponent(serviceId)}/custom-domains/${encodeURIComponent(domainId)}` });
}

export async function deleteCustomDomain(serviceId: string, domainId: string): Promise<void> {
  return renderRequest<void>({ method: "DELETE", path: `/services/${encodeURIComponent(serviceId)}/custom-domains/${encodeURIComponent(domainId)}` });
}

export async function verifyCustomDomainDNS(serviceId: string, domainId: string): Promise<CustomDomain> {
  return renderRequest<CustomDomain>({ method: "POST", path: `/services/${encodeURIComponent(serviceId)}/custom-domains/${encodeURIComponent(domainId)}/verify` });
}

// ============================================================================
// Ambientes / Projetos
// ============================================================================

interface Project {
  id: string;
  name: string;
  owner_id: string;
  created_at?: string;
  updated_at?: string;
}

interface ProjectsResponse {
  cursor?: string;
  projects: Project[];
}

export async function listProjects(query?: Record<string, string | number | boolean>): Promise<ProjectsResponse> {
  return renderRequest<ProjectsResponse>({ method: "GET", path: "/projects", query });
}

export async function createProject(body: unknown): Promise<Project> {
  return renderRequest<Project>({ method: "POST", path: "/projects", body });
}

export async function retrieveProject(projectId: string): Promise<Project> {
  return renderRequest<Project>({ method: "GET", path: `/projects/${encodeURIComponent(projectId)}` });
}

export async function updateProject(projectId: string, body: unknown): Promise<Project> {
  return renderRequest<Project>({ method: "PATCH", path: `/projects/${encodeURIComponent(projectId)}`, body });
}

export async function deleteProject(projectId: string): Promise<void> {
  return renderRequest<void>({ method: "DELETE", path: `/projects/${encodeURIComponent(projectId)}` });
}

interface Environment {
  id: string;
  name: string;
  project_id: string;
  created_at?: string;
  updated_at?: string;
}

interface EnvironmentsResponse {
  cursor?: string;
  environments: Environment[];
}

export async function listEnvironments(projectId: string): Promise<EnvironmentsResponse> {
  return renderRequest<EnvironmentsResponse>({ method: "GET", path: `/projects/${encodeURIComponent(projectId)}/environments` });
}

export async function createEnvironment(projectId: string, body: unknown): Promise<Environment> {
  return renderRequest<Environment>({ method: "POST", path: `/projects/${encodeURIComponent(projectId)}/environments`, body });
}

export async function retrieveEnvironment(envId: string): Promise<Environment> {
  return renderRequest<Environment>({ method: "GET", path: `/environments/${encodeURIComponent(envId)}` });
}

export async function updateEnvironment(envId: string, body: unknown): Promise<Environment> {
  return renderRequest<Environment>({ method: "PATCH", path: `/environments/${encodeURIComponent(envId)}`, body });
}

export async function deleteEnvironment(envId: string): Promise<void> {
  return renderRequest<void>({ method: "DELETE", path: `/environments/${encodeURIComponent(envId)}` });
}

export async function addResourcesToEnvironment(envId: string, body: unknown): Promise<void> {
  return renderRequest<void>({ method: "POST", path: `/environments/${encodeURIComponent(envId)}/resources`, body });
}

export async function removeResourcesFromEnvironment(envId: string, body: unknown): Promise<void> {
  return renderRequest<void>({ method: "DELETE", path: `/environments/${encodeURIComponent(envId)}/resources`, body });
}

// ============================================================================
// Build Sources
// ============================================================================

interface BuildSource {
  id: string;
  name: string;
  type: string;
  owner_id: string;
  created_at?: string;
  updated_at?: string;
}

interface BuildSourcesResponse {
  cursor?: string;
  build_sources: BuildSource[];
}

export async function listBuildSources(query?: Record<string, string | number | boolean>): Promise<BuildSourcesResponse> {
  return renderRequest<BuildSourcesResponse>({ method: "GET", path: "/build-sources", query });
}

export async function createBuildSource(body: unknown): Promise<BuildSource> {
  return renderRequest<BuildSource>({ method: "POST", path: "/build-sources", body });
}

export async function retrieveBuildSource(buildSourceId: string): Promise<BuildSource> {
  return renderRequest<BuildSource>({ method: "GET", path: `/build-sources/${encodeURIComponent(buildSourceId)}` });
}

export async function updateBuildSource(buildSourceId: string, body: unknown): Promise<BuildSource> {
  return renderRequest<BuildSource>({ method: "PATCH", path: `/build-sources/${encodeURIComponent(buildSourceId)}`, body });
}

export async function deleteBuildSource(buildSourceId: string): Promise<void> {
  return renderRequest<void>({ method: "DELETE", path: `/build-sources/${encodeURIComponent(buildSourceId)}` });
}

// ============================================================================
// Blueprints
// ============================================================================

interface Blueprint {
  id: string;
  name: string;
  owner_id: string;
  created_at?: string;
  updated_at?: string;
}

interface BlueprintsResponse {
  cursor?: string;
  blueprints: Blueprint[];
}

export async function listBlueprints(query?: Record<string, string | number | boolean>): Promise<BlueprintsResponse> {
  return renderRequest<BlueprintsResponse>({ method: "GET", path: "/blueprints", query });
}

export async function validateBlueprint(body: unknown): Promise<unknown> {
  return renderRequest<unknown>({ method: "POST", path: "/blueprints/validate", body });
}

export async function retrieveBlueprint(blueprintId: string): Promise<Blueprint> {
  return renderRequest<Blueprint>({ method: "GET", path: `/blueprints/${encodeURIComponent(blueprintId)}` });
}

export async function updateBlueprint(blueprintId: string, body: unknown): Promise<Blueprint> {
  return renderRequest<Blueprint>({ method: "PATCH", path: `/blueprints/${encodeURIComponent(blueprintId)}`, body });
}

export async function disconnectBlueprint(blueprintId: string): Promise<void> {
  return renderRequest<void>({ method: "POST", path: `/blueprints/${encodeURIComponent(blueprintId)}/disconnect` });
}

export async function listBlueprintSyncs(blueprintId: string): Promise<{ cursor?: string; syncs: unknown[] }> {
  return renderRequest<{ cursor?: string; syncs: unknown[] }>({ method: "GET", path: `/blueprints/${encodeURIComponent(blueprintId)}/syncs` });
}

// ============================================================================
// Webhooks
// ============================================================================

interface Webhook {
  id: string;
  name: string;
  url: string;
  owner_id: string;
  created_at?: string;
  updated_at?: string;
}

interface WebhooksResponse {
  cursor?: string;
  webhooks: Webhook[];
}

export async function listWebhooks(query?: Record<string, string | number | boolean>): Promise<WebhooksResponse> {
  return renderRequest<WebhooksResponse>({ method: "GET", path: "/webhooks", query });
}

export async function createWebhook(body: unknown): Promise<Webhook> {
  return renderRequest<Webhook>({ method: "POST", path: "/webhooks", body });
}

export async function retrieveWebhook(webhookId: string): Promise<Webhook> {
  return renderRequest<Webhook>({ method: "GET", path: `/webhooks/${encodeURIComponent(webhookId)}` });
}

export async function updateWebhook(webhookId: string, body: unknown): Promise<Webhook> {
  return renderRequest<Webhook>({ method: "PATCH", path: `/webhooks/${encodeURIComponent(webhookId)}`, body });
}

export async function deleteWebhook(webhookId: string): Promise<void> {
  return renderRequest<void>({ method: "DELETE", path: `/webhooks/${encodeURIComponent(webhookId)}` });
}

export async function listWebhookEvents(webhookId: string): Promise<{ cursor?: string; events: unknown[] }> {
  return renderRequest<{ cursor?: string; events: unknown[] }>({ method: "GET", path: `/webhooks/${encodeURIComponent(webhookId)}/events` });
}

// ============================================================================
// Logs
// ============================================================================

interface Log {
  timestamp: string;
  level: string;
  message: string;
  service_id?: string;
}

interface LogsResponse {
  cursor?: string;
  logs: Log[];
}

export async function listLogs(query?: Record<string, string | number | boolean>): Promise<LogsResponse> {
  return renderRequest<LogsResponse>({ method: "GET", path: "/logs", query });
}

// ============================================================================
// Membros do workspace
// ============================================================================

interface Member {
  id: string;
  user_id: string;
  role: string;
  email: string;
}

interface MembersResponse {
  cursor?: string;
  members: Member[];
}

export async function listOwnerMembers(ownerId: string): Promise<MembersResponse> {
  return renderRequest<MembersResponse>({ method: "GET", path: `/owners/${encodeURIComponent(ownerId)}/members` });
}

export async function updateWorkspaceMember(ownerId: string, memberId: string, body: unknown): Promise<Member> {
  return renderRequest<Member>({ method: "PATCH", path: `/owners/${encodeURIComponent(ownerId)}/members/${encodeURIComponent(memberId)}`, body });
}

export async function removeWorkspaceMember(ownerId: string, memberId: string): Promise<void> {
  return renderRequest<void>({ method: "DELETE", path: `/owners/${encodeURIComponent(ownerId)}/members/${encodeURIComponent(memberId)}` });
}

// ============================================================================
// Registro de auditoria
// ============================================================================

interface AuditLog {
  id: string;
  owner_id: string;
  action: string;
  actor?: string;
  created_at?: string;
}

interface AuditLogsResponse {
  cursor?: string;
  audit_logs: AuditLog[];
}

export async function listOwnerAuditLogs(ownerId: string, query?: Record<string, string | number | boolean>): Promise<AuditLogsResponse> {
  return renderRequest<AuditLogsResponse>({ method: "GET", path: `/owners/${encodeURIComponent(ownerId)}/audit-logs`, query });
}

// ============================================================================
// Notificações / settings do owner
// ============================================================================

interface NotificationSettings {
  owner_id: string;
  email_enabled: boolean;
  created_at?: string;
  updated_at?: string;
}

export async function retrieveOwnerNotificationSettings(ownerId: string): Promise<NotificationSettings> {
  return renderRequest<NotificationSettings>({ method: "GET", path: `/owners/${encodeURIComponent(ownerId)}/notification-settings` });
}

export async function patchOwnerNotificationSettings(ownerId: string, body: unknown): Promise<NotificationSettings> {
  return renderRequest<NotificationSettings>({ method: "PATCH", path: `/owners/${encodeURIComponent(ownerId)}/notification-settings`, body });
}

// ============================================================================
// Execução via CLI (apenas leitura por padrão)
// ============================================================================

const COMMANDS: Record<string, () => Promise<unknown>> = {
  owners: () => listOwners(),
  owner: async () => {
    const id = process.argv[3];
    if (!id) throw new Error("Uso: render-client.mts owner <ownerId>");
    return retrieveOwner(id);
  },
  user: () => getAuthenticatedUser(),
  services: () => listServices(),
  service: async () => {
    const id = process.argv[3];
    if (!id) throw new Error("Uso: render-client.mts service <serviceId>");
    return retrieveService(id);
  },
  deploys: async () => {
    const id = process.argv[3];
    if (!id) throw new Error("Uso: render-client.mts deploys <serviceId>");
    return listDeploys(id);
  },
  deploy: async () => {
    const [sid, did] = process.argv.slice(3);
    if (!sid || !did) throw new Error("Uso: render-client.mts deploy <serviceId> <deployId>");
    return retrieveDeploy(sid, did);
  },
  events: async () => {
    const id = process.argv[3];
    if (!id) throw new Error("Uso: render-client.mts events <serviceId>");
    return listEvents(id);
  },
  instances: async () => {
    const id = process.argv[3];
    if (!id) throw new Error("Uso: render-client.mts instances <serviceId>");
    return listInstances(id);
  },
  "outbound-ips": async () => {
    const id = process.argv[3];
    if (!id) throw new Error("Uso: render-client.mts outbound-ips <serviceId>");
    return retrieveServiceOutboundIPs(id);
  },
  env: async () => {
    const id = process.argv[3];
    if (!id) throw new Error("Uso: render-client.mts env <serviceId>");
    return listEnvVars(id);
  },
  postgres: () => listPostgres(),
  "postgres-instance": async () => {
    const id = process.argv[3];
    if (!id) throw new Error("Uso: render-client.mts postgres-instance <instanceId>");
    return retrievePostgres(id);
  },
  "postgres-connection-info": async () => {
    const id = process.argv[3];
    if (!id) throw new Error("Uso: render-client.mts postgres-connection-info <instanceId>");
    return retrievePostgresConnectionInfo(id);
  },
  keyvalue: () => listKeyValue(),
  "keyvalue-instance": async () => {
    const id = process.argv[3];
    if (!id) throw new Error("Uso: render-client.mts keyvalue-instance <instanceId>");
    return retrieveKeyValue(id);
  },
  "keyvalue-connection-info": async () => {
    const id = process.argv[3];
    if (!id) throw new Error("Uso: render-client.mts keyvalue-connection-info <instanceId>");
    return retrieveKeyValueConnectionInfo(id);
  },
  disks: () => listDisks(),
  disk: async () => {
    const id = process.argv[3];
    if (!id) throw new Error("Uso: render-client.mts disk <diskId>");
    return retrieveDisk(id);
  },
  domains: async () => {
    const id = process.argv[3];
    if (!id) throw new Error("Uso: render-client.mts domains <serviceId>");
    return listCustomDomains(id);
  },
  projects: () => listProjects(),
  project: async () => {
    const id = process.argv[3];
    if (!id) throw new Error("Uso: render-client.mts project <projectId>");
    return retrieveProject(id);
  },
  environments: async () => {
    const id = process.argv[3];
    if (!id) throw new Error("Uso: render-client.mts environments <projectId>");
    return listEnvironments(id);
  },
  "build-sources": () => listBuildSources(),
  buildsource: async () => {
    const id = process.argv[3];
    if (!id) throw new Error("Uso: render-client.mts buildsource <buildSourceId>");
    return retrieveBuildSource(id);
  },
  blueprints: () => listBlueprints(),
  blueprint: async () => {
    const id = process.argv[3];
    if (!id) throw new Error("Uso: render-client.mts blueprint <blueprintId>");
    return retrieveBlueprint(id);
  },
  webhooks: () => listWebhooks(),
  webhook: async () => {
    const id = process.argv[3];
    if (!id) throw new Error("Uso: render-client.mts webhook <webhookId>");
    return retrieveWebhook(id);
  },
  logs: () => listLogs(),
  members: async () => {
    const id = process.argv[3];
    if (!id) throw new Error("Uso: render-client.mts members <ownerId>");
    return listOwnerMembers(id);
  },
  "audit-logs": async () => {
    const id = process.argv[3];
    if (!id) throw new Error("Uso: render-client.mts audit-logs <ownerId>");
    return listOwnerAuditLogs(id);
  },
  "notification-settings": async () => {
    const id = process.argv[3];
    if (!id) throw new Error("Uso: render-client.mts notification-settings <ownerId>");
    return retrieveOwnerNotificationSettings(id);
  },
  help: async () => {
    console.log("Comandos disponíveis (somente leitura):");
    console.log("  owners                                  - listar workspaces");
    console.log("  owner <id>                              - detalhes do workspace");
    console.log("  user                                    - usuário autenticado");
    console.log("  services                                - listar serviços");
    console.log("  service <id>                            - detalhes do serviço");
    console.log("  deploys <serviceId>                     - listar deploys");
    console.log("  deploy <serviceId> <deployId>           - detalhes do deploy");
    console.log("  events <serviceId>                      - eventos do serviço");
    console.log("  instances <serviceId>                   - instâncias do serviço");
    console.log("  outbound-ips <serviceId>                - IPs de saída");
    console.log("  env <serviceId>                         - variáveis de ambiente");
    console.log("  postgres                                - instâncias Postgres");
    console.log("  postgres-instance <id>                  - detalhes do Postgres");
    console.log("  postgres-connection-info <id>           - conexão Postgres (sensível)");
    console.log("  keyvalue                                - instâncias Key Value");
    console.log("  keyvalue-instance <id>                  - detalhes Key Value");
    console.log("  keyvalue-connection-info <id>           - conexão Key Value (sensível)");
    console.log("  disks                                   - discos persistentes");
    console.log("  disk <id>                               - detalhes do disco");
    console.log("  domains <serviceId>                     - domínios personalizados");
    console.log("  projects                                - projetos");
    console.log("  project <id>                            - detalhes do projeto");
    console.log("  environments <projectId>                - ambientes do projeto");
    console.log("  build-sources                           - fontes de build");
    console.log("  buildsource <id>                        - detalhes da fonte de build");
    console.log("  blueprints                              - blueprints");
    console.log("  blueprint <id>                          - detalhes do blueprint");
    console.log("  webhooks                                - webhooks");
    console.log("  webhook <id>                            - detalhes do webhook");
    console.log("  logs                                    - logs");
    console.log("  members <ownerId>                       - membros do workspace");
    console.log("  audit-logs <ownerId>                    - log de auditoria");
    console.log("  notification-settings <ownerId>         - configurações de notificação");
    return null;
  },
};

async function main() {
  const cmd = process.argv[2] || "help";
  const handler = COMMANDS[cmd];
  if (!handler) {
    console.error(`Comando desconhecido: ${cmd}. Use 'help'.`);
    process.exit(1);
  }
  try {
    const result = await handler();
    if (result !== undefined && result !== null) {
      console.log(JSON.stringify(result, null, 2));
    }
  } catch (err) {
    // Nunca expor a chave nem stack traces com credenciais.
    console.error(redactKey(String(err)));
    process.exit(1);
  }
}

main();
