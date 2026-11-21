/**
 * Paperclip API Client for Telegram Bot
 * Provides typed methods for all Paperclip operations
 */

export interface PaperclipClientConfig {
  apiUrl: string;
  apiKey: string;
  companyId: string;
  agentId: string;
}

export interface AgentIdentity {
  id: string;
  name: string;
  role: string;
  title?: string;
  icon?: string;
  status: string;
  adapterType: string;
}

export interface Issue {
  id: string;
  identifier: string;
  title: string;
  description?: string;
  status: string;
  priority?: string;
  assigneeAgentId?: string;
  assigneeUserId?: string;
  projectId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface InboxItem {
  id: string;
  identifier: string;
  title: string;
  status: string;
  priority?: string;
}

export interface Run {
  id: string;
  status: string;
  agentId?: string;
  issueId?: string;
  startedAt: string;
  endedAt?: string;
  exitCode?: number;
  errorMessage?: string;
}

export interface Agent {
  id: string;
  name: string;
  role: string;
  title?: string;
  status: string;
  adapterType: string;
}

export interface Approval {
  id: string;
  type: string;
  status: string;
  payload: Record<string, unknown>;
}

export interface CreateIssueInput {
  title: string;
  description?: string;
  projectId?: string;
  priority?: string;
}

export interface ListIssuesOptions {
  status?: string;
  limit?: number;
  assigneeAgentId?: string;
}

export interface HireAgentPayload {
  name: string;
  role: string;
  title?: string;
  icon?: string;
  capabilities?: string;
  adapterType: string;
  adapterConfig?: Record<string, unknown>;
  runtimeConfig?: Record<string, unknown>;
  desiredSkills?: string[];
  permissions?: Record<string, unknown>;
  budgetMonthlyCents?: number;
  reportsTo?: string;
  metadata?: Record<string, unknown>;
}

export class PaperclipClient {
  private config: PaperclipClientConfig;
  private runId: string;

  constructor(config: PaperclipClientConfig) {
    this.config = config;
    this.runId = this.generateRunId();
  }

  private generateRunId(): string {
    return `run_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`;
  }

  private async request<T>(
    method: string,
    path: string,
    body?: unknown,
    headers?: Record<string, string>
  ): Promise<T> {
    const url = `${this.config.apiUrl}${path}`;
    const requestHeaders: Record<string, string> = {
      'Authorization': `Bearer ${this.config.apiKey}`,
      'Content-Type': 'application/json',
      'X-Paperclip-Run-Id': this.runId,
      ...headers,
    };

    const response = await fetch(url, {
      method,
      headers: requestHeaders,
      body: body ? JSON.stringify(body) : undefined,
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`API ${method} ${path} failed: ${response.status} ${errorText}`);
    }

    if (response.status === 204) {
      return {} as T;
    }

    return response.json() as Promise<T>;
  }

  // Agent Identity
  async getAgentIdentity(): Promise<AgentIdentity | null> {
    return this.request<AgentIdentity>('GET', `/api/agents/me`);
  }

  // Inbox
  async getInbox(): Promise<InboxItem[]> {
    return this.request<InboxItem[]>('GET', `/api/agents/me/inbox-lite`);
  }

  // Issues
  async listIssues(options: ListIssuesOptions = {}): Promise<Issue[]> {
    const params = new URLSearchParams();
    if (options.status) params.set('status', options.status);
    if (options.limit) params.set('limit', options.limit.toString());
    if (options.assigneeAgentId) params.set('assigneeAgentId', options.assigneeAgentId);

    const query = params.toString() ? `?${params.toString()}` : '';
    return this.request<Issue[]>('GET', `/api/companies/${this.config.companyId}/issues${query}`);
  }

  async getIssue(issueId: string): Promise<Issue | null> {
    return this.request<Issue>('GET', `/api/issues/${issueId}`);
  }

  async createIssue(input: CreateIssueInput): Promise<Issue> {
    return this.request<Issue>('POST', `/api/companies/${this.config.companyId}/issues`, input);
  }

  async checkoutIssue(issueId: string): Promise<{ success: boolean }> {
    return this.request('POST', `/api/issues/${issueId}/checkout`, {
      agentId: this.config.agentId,
      expectedStatuses: ['todo', 'backlog', 'blocked', 'in_review'],
    });
  }

  async releaseIssue(issueId: string): Promise<{ success: boolean }> {
    return this.request('POST', `/api/issues/${issueId}/release`, {});
  }

  async commentIssue(issueId: string, comment: string): Promise<{ id: string }> {
    return this.request('POST', `/api/issues/${issueId}/comments`, { body: comment });
  }

  async updateIssueStatus(issueId: string, status: string, comment?: string): Promise<Issue> {
    return this.request('PATCH', `/api/issues/${issueId}`, { status, comment });
  }

  async getIssueHeartbeatContext(issueId: string): Promise<Record<string, unknown>> {
    return this.request('GET', `/api/issues/${issueId}/heartbeat-context`);
  }

  // Agents
  async listAgents(): Promise<Agent[]> {
    return this.request<Agent[]>('GET', `/api/companies/${this.config.companyId}/agents`);
  }

  async getAgent(agentId: string): Promise<Agent | null> {
    return this.request<Agent>('GET', `/api/agents/${agentId}`);
  }

  async hireAgent(payload: HireAgentPayload): Promise<{ agent: Agent; approval?: Approval }> {
    return this.request('POST', `/api/companies/${this.config.companyId}/agent-hires`, payload);
  }

  async wakeAgent(agentId: string, payload?: Record<string, unknown>): Promise<{ success: boolean }> {
    return this.request('POST', `/api/agents/${agentId}/wake`, payload || {});
  }

  async updateAgent(agentId: string, data: Record<string, unknown>): Promise<Agent> {
    return this.request('PATCH', `/api/agents/${agentId}`, data);
  }

  // Runs
  async listRuns(limit = 20): Promise<Run[]> {
    return this.request<Run[]>('GET', `/api/companies/${this.config.companyId}/runs?limit=${limit}`);
  }

  async getRun(runId: string): Promise<Run | null> {
    return this.request<Run>('GET', `/api/runs/${runId}`);
  }

  async getAgentRuns(agentId: string, limit = 20): Promise<Run[]> {
    return this.request<Run[]>('GET', `/api/agents/${agentId}/runs?limit=${limit}`);
  }

  // Approvals
  async listApprovals(status?: string): Promise<Approval[]> {
    const query = status ? `?status=${status}` : '';
    return this.request<Approval[]>('GET', `/api/companies/${this.config.companyId}/approvals${query}`);
  }

  async getApproval(approvalId: string): Promise<Approval | null> {
    return this.request<Approval>('GET', `/api/approvals/${approvalId}`);
  }

  async approveApproval(approvalId: string): Promise<Approval> {
    return this.request('POST', `/api/approvals/${approvalId}/approve`, {});
  }

  async rejectApproval(approvalId: string, reason: string): Promise<Approval> {
    return this.request('POST', `/api/approvals/${approvalId}/reject`, { reason });
  }

  // Agent Configurations
  async listAgentConfigurations(): Promise<Record<string, unknown>[]> {
    return this.request('GET', `/api/companies/${this.config.companyId}/agent-configurations`);
  }

  // Projects
  async listProjects(): Promise<Record<string, unknown>[]> {
    return this.request('GET', `/api/companies/${this.config.companyId}/projects`);
  }

  // Skills
  async listCompanySkills(): Promise<Record<string, unknown>[]> {
    return this.request('GET', `/api/companies/${this.config.companyId}/skills`);
  }

  async syncAgentSkills(agentId: string, desiredSkills: string[], mode: 'add' | 'remove' | 'replace' = 'add'): Promise<{ success: boolean }> {
    return this.request('POST', `/api/agents/${agentId}/skills/sync`, { desiredSkills, mode });
  }

  // Activity Log
  async getActivityLog(issueId: string, limit = 50): Promise<Record<string, unknown>[]> {
    return this.request('GET', `/api/issues/${issueId}/activity?limit=${limit}`);
  }

  // Documents
  async getIssueDocument(issueId: string, key: string): Promise<Record<string, unknown> | null> {
    return this.request('GET', `/api/issues/${issueId}/documents/${key}`);
  }

  async setIssueDocument(issueId: string, key: string, title: string, body: string, baseRevisionId?: string): Promise<Record<string, unknown>> {
    return this.request('PUT', `/api/issues/${issueId}/documents/${key}`, {
      title,
      format: 'markdown',
      body,
      baseRevisionId,
    });
  }

  // Interactions
  async createInteraction(issueId: string, interaction: Record<string, unknown>): Promise<Record<string, unknown>> {
    return this.request('POST', `/api/issues/${issueId}/interactions`, interaction);
  }

  // Webhook/Connection test
  async testConnection(): Promise<{ ok: boolean }> {
    try {
      await this.getAgentIdentity();
      return { ok: true };
    } catch {
      return { ok: false };
    }
  }
}

// Factory function
export function createPaperclipClient(config: PaperclipClientConfig): PaperclipClient {
  return new PaperclipClient(config);
}