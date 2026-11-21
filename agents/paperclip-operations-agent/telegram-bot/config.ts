/**
 * Configuration loader for Telegram Bot
 * Loads from environment variables with validation
 */

export interface BotConfig {
  telegramBotToken: string;
  telegramChatId: string;
  paperclipApiUrl: string;
  paperclipApiKey: string;
  paperclipCompanyId: string;
  paperclipAgentId: string;
}

function getEnv(key: string, defaultValue?: string): string {
  const value = process.env[key]?.trim();
  if (!value && defaultValue === undefined) {
    throw new Error(`Environment variable ${key} is required but not set`);
  }
  return value || defaultValue!;
}

function getEnvOptional(key: string): string | undefined {
  return process.env[key]?.trim();
}

export function loadConfig(): BotConfig {
  return {
    telegramBotToken: getEnv('TELEGRAM_BOT_TOKEN', '8843826391:AAGrNRMOcGwKAxgqN9tvKvRsxWBMi1vZntg'),
    telegramChatId: getEnv('TELEGRAM_CHAT_ID', '8816487898'),
    paperclipApiUrl: getEnv('PAPERCLIP_API_URL', 'http://localhost:3100'),
    paperclipApiKey: getEnv('PAPERCLIP_API_KEY'),
    paperclipCompanyId: getEnv('PAPERCLIP_COMPANY_ID'),
    paperclipAgentId: getEnv('PAPERCLIP_AGENT_ID'),
  };
}

export function validateConfig(config: BotConfig): string[] {
  const errors: string[] = [];

  if (!config.telegramBotToken || config.telegramBotToken === '8843826391:AAGrNRMOcGwKAxgqN9tvKvRsxWBMi1vZntg') {
    errors.push('TELEGRAM_BOT_TOKEN: usando token padrão - configure o seu');
  }

  if (!config.telegramChatId || config.telegramChatId === '8816487898') {
    errors.push('TELEGRAM_CHAT_ID: usando chat ID padrão - configure o seu');
  }

  if (!config.paperclipApiKey) {
    errors.push('PAPERCLIP_API_KEY: obrigatório');
  }

  if (!config.paperclipCompanyId) {
    errors.push('PAPERCLIP_COMPANY_ID: obrigatório');
  }

  if (!config.paperclipAgentId) {
    errors.push('PAPERCLIP_AGENT_ID: obrigatório');
  }

  return errors;
}

export function printConfig(config: BotConfig): void {
  console.log('📋 Configuração do Bot:');
  console.log(`  Telegram Bot Token: ${config.telegramBotToken.slice(0, 10)}...`);
  console.log(`  Telegram Chat ID: ${config.telegramChatId}`);
  console.log(`  Paperclip API URL: ${config.paperclipApiUrl}`);
  console.log(`  Paperclip Company: ${config.paperclipCompanyId}`);
  console.log(`  Paperclip Agent: ${config.paperclipAgentId}`);
  console.log(`  Paperclip API Key: ${config.paperclipApiKey ? '***' + config.paperclipApiKey.slice(-4) : 'NÃO CONFIGURADO'}`);
}