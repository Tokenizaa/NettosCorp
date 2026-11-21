#!/usr/bin/env node
/**
 * Telegram Bot for Paperclip Operations Agent
 *
 * This bot connects Telegram to the Paperclip Operations Agent via Paperclip API.
 * It handles commands, forwards messages to the agent, and returns responses.
 *
 * Bot Token: 8843826391:AAGrNRMOcGwKAxgqN9tvKvRsxWBMi1vZntg
 * Chat ID: 8816487898
 */

import { Telegraf, Context, Markup } from 'telegraf';
import { PaperclipClient } from './paperclip-client.js';
import { loadConfig } from './config.js';

interface BotConfig {
  telegramBotToken: string;
  telegramChatId: string;
  paperclipApiUrl: string;
  paperclipApiKey: string;
  paperclipCompanyId: string;
  paperclipAgentId: string;
}

interface PendingCommand {
  id: string;
  chatId: string;
  messageId: number;
  command: string;
  args: string[];
  timestamp: number;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  result?: string;
}

class PaperclipTelegramBot {
  private bot: Telegraf;
  private client: PaperclipClient;
  private config: BotConfig;
  private pendingCommands: Map<string, PendingCommand> = new Map();
  private allowedChatIds: Set<string>;

  constructor(config: BotConfig) {
    this.config = config;
    this.bot = new Telegraf(config.telegramBotToken);
    this.client = new PaperclipClient({
      apiUrl: config.paperclipApiUrl,
      apiKey: config.paperclipApiKey,
      companyId: config.paperclipCompanyId,
      agentId: config.paperclipAgentId,
    });
    this.allowedChatIds = new Set([config.telegramChatId]);
    this.setupHandlers();
  }

  private setupHandlers(): void {
    // Start command
    this.bot.start((ctx) => this.handleStart(ctx));
    this.bot.help((ctx) => this.handleHelp(ctx));

    // Core Paperclip commands
    this.bot.command('inbox', (ctx) => this.handleInbox(ctx));
    this.bot.command('issues', (ctx) => this.handleListIssues(ctx));
    this.bot.command('issue', (ctx) => this.handleGetIssue(ctx));
    this.bot.command('create', (ctx) => this.handleCreateIssue(ctx));
    this.bot.command('checkout', (ctx) => this.handleCheckout(ctx));
    this.bot.command('release', (ctx) => this.handleRelease(ctx));
    this.bot.command('comment', (ctx) => this.handleComment(ctx));
    this.bot.command('status', (ctx) => this.handleUpdateStatus(ctx));
    this.bot.command('hire', (ctx) => this.handleHireAgent(ctx));
    this.bot.command('agents', (ctx) => this.handleListAgents(ctx));
    this.bot.command('runs', (ctx) => this.handleListRuns(ctx));
    this.bot.command('run', (ctx) => this.handleGetRun(ctx));
    this.bot.command('wake', (ctx) => this.handleWakeAgent(ctx));
    this.bot.command('approve', (ctx) => this.handleApprove(ctx));
    this.bot.command('reject', (ctx) => this.handleReject(ctx));

    // Utility commands
    this.bot.command('ping', (ctx) => this.handlePing(ctx));
    this.bot.command('config', (ctx) => this.handleConfig(ctx));

    // Handle callback queries (inline buttons)
    this.bot.on('callback_query', (ctx) => this.handleCallbackQuery(ctx));

    // Handle text messages (for multi-step commands)
    this.bot.on('text', (ctx) => this.handleTextMessage(ctx));

    // Error handling
    this.bot.catch((err, ctx) => this.handleError(err, ctx));
  }

  private async handleStart(ctx: Context): Promise<void> {
    if (!this.isAllowed(ctx)) return;

    const welcome = `
🤖 *Paperclip Operations Bot*

Bem-vindo! Eu conecto você ao seu Paperclip Operations Agent.

*Comandos Principais:*
/inbox - Ver issues atribuídas
/issues - Listar issues
/issue <id> - Ver detalhes de uma issue
/create - Criar nova issue
/checkout <id> - Fazer checkout de issue
/release <id> - Liberar issue
/comment <id> <texto> - Comentar em issue
/status <id> <status> - Atualizar status
/hire - Hire novo agent
/agents - Listar agents
/runs - Listar runs recentes
/run <id> - Ver detalhes de run
/wake <agent-id> - Acordar agent
/approve <id> - Aprovar approval
/reject <id> - Rejeitar approval

*Utilitários:*
/ping - Testar conexão
/config - Ver configuração
/help - Esta ajuda
    `;
    await ctx.reply(welcome, { parse_mode: 'Markdown' });
  }

  private async handleHelp(ctx: Context): Promise<void> {
    await this.handleStart(ctx);
  }

  private async handlePing(ctx: Context): Promise<void> {
    if (!this.isAllowed(ctx)) return;

    try {
      const identity = await this.client.getAgentIdentity();
      await ctx.reply(
        `✅ *Pong!*\n\n` +
        `Agent: ${identity?.name || 'Unknown'}\n` +
        `Role: ${identity?.role || 'Unknown'}\n` +
        `Company: ${this.config.paperclipCompanyId}\n` +
        `API: ${this.config.paperclipApiUrl}`,
        { parse_mode: 'Markdown' }
      );
    } catch (error) {
      await ctx.reply(`❌ Erro: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  private async handleConfig(ctx: Context): Promise<void> {
    if (!this.isAllowed(ctx)) return;

    const config = `
⚙️ *Configuração Atual*
\`\`\`
API URL: ${this.config.paperclipApiUrl}
Company: ${this.config.paperclipCompanyId}
Agent: ${this.config.paperclipAgentId}
Chat ID: ${this.config.telegramChatId}
\`\`\`
    `;
    await ctx.reply(config, { parse_mode: 'Markdown' });
  }

  private async handleInbox(ctx: Context): Promise<void> {
    if (!this.isAllowed(ctx)) return;

    await ctx.reply('📥 Buscando inbox...');
    try {
      const inbox = await this.client.getInbox();
      if (!inbox || inbox.length === 0) {
        await ctx.reply('📭 Inbox vazia');
        return;
      }

      const messages = inbox.slice(0, 10).map((item, i) =>
        `${i + 1}. [${item.identifier}] ${item.title} (${item.status})`
      ).join('\n');

      await ctx.reply(`📥 *Inbox (${inbox.length} issues)*\n\n${messages}`, {
        parse_mode: 'Markdown'
      });
    } catch (error) {
      await ctx.reply(`❌ Erro: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  private async handleListIssues(ctx: Context): Promise<void> {
    if (!this.isAllowed(ctx)) return;

    const args = ctx.message?.text?.split(' ') || [];
    const status = args[1] || 'todo,in_progress,in_review';
    const limit = parseInt(args[2]) || 20;

    await ctx.reply(`📋 Listando issues (status: ${status})...`);
    try {
      const issues = await this.client.listIssues({ status, limit });
      if (!issues || issues.length === 0) {
        await ctx.reply('📭 Nenhuma issue encontrada');
        return;
      }

      const messages = issues.slice(0, 15).map((issue, i) =>
        `${i + 1}. [${issue.identifier}] ${issue.title} - ${issue.status} ${issue.priority ? `(${issue.priority})` : ''}`
      ).join('\n');

      await ctx.reply(`📋 *Issues (${issues.length})*\n\n${messages}`, {
        parse_mode: 'Markdown'
      });
    } catch (error) {
      await ctx.reply(`❌ Erro: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  private async handleGetIssue(ctx: Context): Promise<void> {
    if (!this.isAllowed(ctx)) return;

    const args = ctx.message?.text?.split(' ') || [];
    const issueId = args[1];

    if (!issueId) {
      await ctx.reply('❌ Uso: /issue <issue-id>');
      return;
    }

    await ctx.reply(`🔍 Buscando issue ${issueId}...`);
    try {
      const issue = await this.client.getIssue(issueId);
      if (!issue) {
        await ctx.reply('❌ Issue não encontrada');
        return;
      }

      const details = `
📋 *Issue: ${issue.identifier}*
**Título:** ${issue.title}
**Status:** ${issue.status}
**Prioridade:** ${issue.priority || 'N/A'}
**Assignee:** ${issue.assigneeAgentId ? `Agent: ${issue.assigneeAgentId}` : issue.assigneeUserId ? `User: ${issue.assigneeUserId}` : 'Não atribuída'}
**Projeto:** ${issue.projectId || 'N/A'}
**Criada:** ${new Date(issue.createdAt).toLocaleString()}
**Atualizada:** ${new Date(issue.updatedAt).toLocaleString()}

**Descrição:**
${issue.description || '_Sem descrição_'}
      `;
      await ctx.reply(details, { parse_mode: 'Markdown' });
    } catch (error) {
      await ctx.reply(`❌ Erro: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  private async handleCreateIssue(ctx: Context): Promise<void> {
    if (!this.isAllowed(ctx)) return;

    // Start multi-step creation
    const commandId = `create_${Date.now()}`;
    this.pendingCommands.set(commandId, {
      id: commandId,
      chatId: ctx.chat!.id.toString(),
      messageId: ctx.message!.message_id,
      command: 'create',
      args: [],
      timestamp: Date.now(),
      status: 'pending',
    });

    await ctx.reply(
      '📝 *Criar Nova Issue*\n\n' +
      'Envie o **título** da issue:',
      { parse_mode: 'Markdown' }
    );
  }

  private async handleCheckout(ctx: Context): Promise<void> {
    if (!this.isAllowed(ctx)) return;

    const args = ctx.message?.text?.split(' ') || [];
    const issueId = args[1];

    if (!issueId) {
      await ctx.reply('❌ Uso: /checkout <issue-id>');
      return;
    }

    await ctx.reply(`🔄 Fazendo checkout da issue ${issueId}...`);
    try {
      const result = await this.client.checkoutIssue(issueId);
      await ctx.reply(`✅ Checkout realizado!\n\n${JSON.stringify(result, null, 2)}`);
    } catch (error) {
      await ctx.reply(`❌ Erro: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  private async handleRelease(ctx: Context): Promise<void> {
    if (!this.isAllowed(ctx)) return;

    const args = ctx.message?.text?.split(' ') || [];
    const issueId = args[1];

    if (!issueId) {
      await ctx.reply('❌ Uso: /release <issue-id>');
      return;
    }

    await ctx.reply(`🔓 Liberando issue ${issueId}...`);
    try {
      const result = await this.client.releaseIssue(issueId);
      await ctx.reply(`✅ Issue liberada!\n\n${JSON.stringify(result, null, 2)}`);
    } catch (error) {
      await ctx.reply(`❌ Erro: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  private async handleComment(ctx: Context): Promise<void> {
    if (!this.isAllowed(ctx)) return;

    const text = ctx.message?.text || '';
    const match = text.match(/\/comment\s+(\S+)\s+(.+)/s);

    if (!match) {
      await ctx.reply('❌ Uso: /comment <issue-id> <texto>');
      return;
    }

    const [, issueId, commentText] = match;

    await ctx.reply(`💬 Comentando na issue ${issueId}...`);
    try {
      const result = await this.client.commentIssue(issueId, commentText);
      await ctx.reply(`✅ Comentário adicionado!\n\n${JSON.stringify(result, null, 2)}`);
    } catch (error) {
      await ctx.reply(`❌ Erro: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  private async handleUpdateStatus(ctx: Context): Promise<void> {
    if (!this.isAllowed(ctx)) return;

    const args = ctx.message?.text?.split(' ') || [];
    if (args.length < 3) {
      await ctx.reply('❌ Uso: /status <issue-id> <status>\nStatus: backlog, todo, in_progress, in_review, done, blocked, cancelled');
      return;
    }

    const [, issueId, status] = args;
    const validStatuses = ['backlog', 'todo', 'in_progress', 'in_review', 'done', 'blocked', 'cancelled'];

    if (!validStatuses.includes(status)) {
      await ctx.reply(`❌ Status inválido. Use: ${validStatuses.join(', ')}`);
      return;
    }

    await ctx.reply(`🔄 Atualizando status para ${status}...`);
    try {
      const result = await this.client.updateIssueStatus(issueId, status);
      await ctx.reply(`✅ Status atualizado!\n\n${JSON.stringify(result, null, 2)}`);
    } catch (error) {
      await ctx.reply(`❌ Erro: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  private async handleHireAgent(ctx: Context): Promise<void> {
    if (!this.isAllowed(ctx)) return;

    await ctx.reply('👥 *Hire Novo Agent*\n\nEnvie o JSON do payload de hire:', { parse_mode: 'Markdown' });

    const commandId = `hire_${Date.now()}`;
    this.pendingCommands.set(commandId, {
      id: commandId,
      chatId: ctx.chat!.id.toString(),
      messageId: ctx.message!.message_id,
      command: 'hire',
      args: [],
      timestamp: Date.now(),
      status: 'pending',
    });
  }

  private async handleListAgents(ctx: Context): Promise<void> {
    if (!this.isAllowed(ctx)) return;

    await ctx.reply('👥 Listando agents...');
    try {
      const agents = await this.client.listAgents();
      if (!agents || agents.length === 0) {
        await ctx.reply('📭 Nenhum agent encontrado');
        return;
      }

      const messages = agents.slice(0, 15).map((agent, i) =>
        `${i + 1}. ${agent.name} (${agent.role}) - ${agent.status} - ${agent.adapterType}`
      ).join('\n');

      await ctx.reply(`👥 *Agents (${agents.length})*\n\n${messages}`, { parse_mode: 'Markdown' });
    } catch (error) {
      await ctx.reply(`❌ Erro: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  private async handleListRuns(ctx: Context): Promise<void> {
    if (!this.isAllowed(ctx)) return;

    const args = ctx.message?.text?.split(' ') || [];
    const limit = parseInt(args[1]) || 10;

    await ctx.reply(`🏃 Listando runs (limit: ${limit})...`);
    try {
      const runs = await this.client.listRuns(limit);
      if (!runs || runs.length === 0) {
        await ctx.reply('📭 Nenhum run encontrado');
        return;
      }

      const messages = runs.slice(0, 10).map((run, i) =>
        `${i + 1}. Run ${run.id.slice(0, 8)} - ${run.status} - ${run.agentId?.slice(0, 8)} - ${new Date(run.startedAt).toLocaleTimeString()}`
      ).join('\n');

      await ctx.reply(`🏃 *Runs Recentes (${runs.length})*\n\n${messages}`, { parse_mode: 'Markdown' });
    } catch (error) {
      await ctx.reply(`❌ Erro: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  private async handleGetRun(ctx: Context): Promise<void> {
    if (!this.isAllowed(ctx)) return;

    const args = ctx.message?.text?.split(' ') || [];
    const runId = args[1];

    if (!runId) {
      await ctx.reply('❌ Uso: /run <run-id>');
      return;
    }

    await ctx.reply(`🔍 Buscando run ${runId}...`);
    try {
      const run = await this.client.getRun(runId);
      if (!run) {
        await ctx.reply('❌ Run não encontrado');
        return;
      }

      const details = `
🏃 *Run: ${run.id}*
**Status:** ${run.status}
**Agent:** ${run.agentId || 'N/A'}
**Issue:** ${run.issueId || 'N/A'}
**Iniciado:** ${new Date(run.startedAt).toLocaleString()}
**Finalizado:** ${run.endedAt ? new Date(run.endedAt).toLocaleString() : 'Em andamento'}
**Exit Code:** ${run.exitCode ?? 'N/A'}
**Error:** ${run.errorMessage || 'Nenhum'}
      `;
      await ctx.reply(details, { parse_mode: 'Markdown' });
    } catch (error) {
      await ctx.reply(`❌ Erro: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  private async handleWakeAgent(ctx: Context): Promise<void> {
    if (!this.isAllowed(ctx)) return;

    const args = ctx.message?.text?.split(' ') || [];
    const agentId = args[1];

    if (!agentId) {
      await ctx.reply('❌ Uso: /wake <agent-id>');
      return;
    }

    await ctx.reply(`⚡ Acordando agent ${agentId}...`);
    try {
      const result = await this.client.wakeAgent(agentId);
      await ctx.reply(`✅ Agent acordado!\n\n${JSON.stringify(result, null, 2)}`);
    } catch (error) {
      await ctx.reply(`❌ Erro: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  private async handleApprove(ctx: Context): Promise<void> {
    if (!this.isAllowed(ctx)) return;

    const args = ctx.message?.text?.split(' ') || [];
    const approvalId = args[1];

    if (!approvalId) {
      await ctx.reply('❌ Uso: /approve <approval-id>');
      return;
    }

    await ctx.reply(`✅ Aprovando ${approvalId}...`);
    try {
      const result = await this.client.approveApproval(approvalId);
      await ctx.reply(`✅ Aprovado!\n\n${JSON.stringify(result, null, 2)}`);
    } catch (error) {
      await ctx.reply(`❌ Erro: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  private async handleReject(ctx: Context): Promise<void> {
    if (!this.isAllowed(ctx)) return;

    const args = ctx.message?.text?.split(' ') || [];
    const approvalId = args[1];
    const reason = args.slice(2).join(' ') || 'Rejeitado via Telegram';

    if (!approvalId) {
      await ctx.reply('❌ Uso: /reject <approval-id> [motivo]');
      return;
    }

    await ctx.reply(`❌ Rejeitando ${approvalId}...`);
    try {
      const result = await this.client.rejectApproval(approvalId, reason);
      await ctx.reply(`✅ Rejeitado!\n\n${JSON.stringify(result, null, 2)}`);
    } catch (error) {
      await ctx.reply(`❌ Erro: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  private async handleCallbackQuery(ctx: Context): Promise<void> {
    if (!this.isAllowed(ctx)) return;
    await ctx.answerCbQuery('Processando...');
    // Handle inline button callbacks here
  }

  private async handleTextMessage(ctx: Context): Promise<void> {
    if (!this.isAllowed(ctx)) return;

    const text = ctx.message?.text || '';

    // Check if this is a response to a pending multi-step command
    for (const [id, cmd] of this.pendingCommands) {
      if (cmd.chatId === ctx.chat!.id.toString() && cmd.status === 'pending') {
        await this.processPendingCommand(ctx, cmd, text);
        return;
      }
    }
  }

  private async processPendingCommand(ctx: Context, cmd: PendingCommand, text: string): Promise<void> {
    if (cmd.command === 'create') {
      if (cmd.args.length === 0) {
        // First message: title
        cmd.args.push(text);
        cmd.status = 'processing';
        await ctx.reply('📝 Título recebido. Agora envie a **descrição** (ou "skip" para pular):', { parse_mode: 'Markdown' });
      } else if (cmd.args.length === 1) {
        // Second message: description
        const description = text.toLowerCase() === 'skip' ? '' : text;
        cmd.args.push(description);
        cmd.status = 'completed';

        await ctx.reply('🔄 Criando issue...');
        try {
          const result = await this.client.createIssue({
            title: cmd.args[0],
            description: cmd.args[1],
          });
          await ctx.reply(`✅ Issue criada!\n\n${JSON.stringify(result, null, 2)}`);
        } catch (error) {
          await ctx.reply(`❌ Erro: ${error instanceof Error ? error.message : String(error)}`);
        }
        this.pendingCommands.delete(cmd.id);
      }
    } else if (cmd.command === 'hire') {
      try {
        const payload = JSON.parse(text);
        cmd.status = 'completed';
        await ctx.reply('🔄 Enviando hire request...');
        const result = await this.client.hireAgent(payload);
        await ctx.reply(`✅ Hire request enviado!\n\n${JSON.stringify(result, null, 2)}`);
      } catch (error) {
        await ctx.reply(`❌ JSON inválido ou erro: ${error instanceof Error ? error.message : String(error)}`);
      }
      this.pendingCommands.delete(cmd.id);
    }
  }

  private isAllowed(ctx: Context): boolean {
    const chatId = ctx.chat?.id.toString();
    if (!chatId || !this.allowedChatIds.has(chatId)) {
      ctx.reply('❌ Chat não autorizado').catch(() => {});
      return false;
    }
    return true;
  }

  private async handleError(err: Error, ctx: Context): Promise<void> {
    console.error('Bot error:', err);
    try {
      await ctx.reply(`❌ Erro interno: ${err.message}`);
    } catch (e) {
      // Ignore
    }
  }

  async start(): Promise<void> {
    console.log('🤖 Iniciando Telegram Bot...');
    await this.bot.launch();
    console.log('✅ Bot rodando!');

    // Enable graceful stop
    process.once('SIGINT', () => this.bot.stop('SIGINT'));
    process.once('SIGTERM', () => this.bot.stop('SIGTERM'));
  }
}

// Config loading
const config = loadConfig();

// Validate required config
const required = ['telegramBotToken', 'telegramChatId', 'paperclipApiUrl', 'paperclipApiKey', 'paperclipCompanyId', 'paperclipAgentId'];
for (const key of required) {
  if (!config[key as keyof BotConfig]) {
    console.error(`❌ Config obrigatória faltando: ${key}`);
    process.exit(1);
  }
}

// Start bot
const bot = new PaperclipTelegramBot(config as BotConfig);
await bot.start();