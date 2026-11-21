/** Presentation-only Brazilian Portuguese localization for Agency Agents.
 * Canonical English names, slugs, profile content and source documents remain untouched.
 */
const phraseMap: Record<string, string> = {
  '3d & scene developer': 'Desenvolvedor 3D e de Cenários',
  'ai engineer': 'Engenheiro de Inteligência Artificial',
  'agents orchestrator': 'Orquestrador de Agentes',
  'project manager senior': 'Gerente de Projetos Sênior',
  'project shepherd': 'Coordenador de Projetos',
  'product sprint prioritizer': 'Especialista em Priorização de Produto',
  'design ux architect': 'Arquiteto de Experiência do Usuário',
  'ux researcher': 'Pesquisador de Experiência do Usuário',
  'ui designer': 'Designer de Interfaces',
  'frontend developer': 'Desenvolvedor Front-end',
  'backend architect': 'Arquiteto Back-end',
  'senior developer': 'Desenvolvedor Sênior',
  'devops automator': 'Especialista em Automação e DevOps',
  'evidence collector': 'Coletor de Evidências',
  'reality checker': 'Analista de Validação',
  'growth hacker': 'Especialista em Crescimento',
  'content creator': 'Criador de Conteúdo',
  'social media strategist': 'Estrategista de Redes Sociais',
  'brand guardian': 'Guardião da Marca',
  'analytics reporter': 'Analista de Dados e Indicadores',
  'rapid prototyper': 'Especialista em Prototipação Rápida',
  'performance benchmarker': 'Analista de Desempenho',
  'infrastructure maintainer': 'Responsável pela Infraestrutura',
  'legal compliance checker': 'Especialista em Conformidade Jurídica',
  'finance tracker': 'Analista de Acompanhamento Financeiro',
  'executive summary generator': 'Redator de Resumos Executivos',
  'test results analyzer': 'Analista de Resultados de Testes',
  'workflow optimizer': 'Especialista em Otimização de Processos',
  'experiment tracker': 'Analista de Experimentos',
  'twitter engager': 'Especialista em Engajamento no X',
  'tiktok strategist': 'Estrategista de TikTok',
  'instagram curator': 'Curador de Conteúdo para Instagram',
  'reddit community builder': 'Especialista em Comunidades do Reddit',
  'app store optimizer': 'Especialista em Otimização de Lojas de Aplicativos',
  'trend researcher': 'Pesquisador de Tendências',
  'support responder': 'Analista de Suporte',
  'startup mvp build': 'Construção de Produto Mínimo Viável',
  'enterprise feature development': 'Desenvolvimento de Funcionalidades Corporativas',
  'multi-channel marketing campaign': 'Campanha de Marketing Multicanal',
  'incident response': 'Resposta a Incidentes',
};

const wordMap: Record<string, string> = {
  academic: 'Acadêmico', design: 'Design', engineering: 'Engenharia', finance: 'Finanças',
  'game': 'Jogos', development: 'Desenvolvimento', gis: 'Geoprocessamento',
  healthcare: 'Saúde', marketing: 'Marketing', paid: 'Mídia', media: 'Paga',
  product: 'Produto', project: 'Projetos', management: 'Gestão', research: 'Pesquisa',
  sales: 'Vendas', security: 'Segurança', spatial: 'Espacial', computing: 'Computação',
  specialized: 'Especializados', support: 'Suporte', testing: 'Testes',
  strategy: 'Estratégia', operations: 'Operações', technology: 'Tecnologia',
  governance: 'Governança', 'human': 'Recursos Humanos', resources: 'Humanos',
  legal: 'Jurídico', compliance: 'Conformidade', data: 'Dados',
  infrastructure: 'Infraestrutura', customer: 'Cliente', success: 'Sucesso',
  communications: 'Comunicação', other: 'Outros', agent: 'Agente', agents: 'Agentes',
  orchestrator: 'Orquestrador', senior: 'Sênior', manager: 'Gerente',
  developer: 'Desenvolvedor', architect: 'Arquiteto', designer: 'Designer',
  researcher: 'Pesquisador', strategist: 'Estrategista', creator: 'Criador',
  analyst: 'Analista', engineer: 'Engenheiro', automator: 'Automatizador',
  tester: 'Testador', tester: 'Testador', checker: 'Verificador',
  specialist: 'Especialista', specialistS: 'Especialistas', support: 'Suporte',
  infrastructure: 'Infraestrutura', maintainer: 'Responsável', reporter: 'Relator',
  tracker: 'Acompanhamento', generator: 'Gerador', builder: 'Construtor',
  curator: 'Curador', optimizer: 'Otimizador', prioritizer: 'Priorizador',
  sprint: 'Ciclo', rapid: 'Rápida', performance: 'Desempenho', evidence: 'Evidências',
  reality: 'Realidade', brand: 'Marca', guardian: 'Guardião', content: 'Conteúdo',
  social: 'Sociais', media: 'Mídia', growth: 'Crescimento', hacker: 'Especialista',
  frontend: 'Front-end', backend: 'Back-end', devops: 'DevOps', ai: 'IA',
  ux: 'Experiência do Usuário', ui: 'Interface', 3d: '3D', scene: 'Cenários',
  game: 'Jogos', spatial: 'Espacial', app: 'Aplicativos', store: 'Loja',
  incident: 'Incidente', response: 'Resposta', workflow: 'Fluxo de Trabalho',
  experiment: 'Experimento', results: 'Resultados', test: 'Teste', tests: 'Testes',
  executive: 'Executivo', summary: 'Resumo', finance: 'Financeiro',
  legal: 'Jurídico', twitter: 'X', tiktok: 'TikTok', instagram: 'Instagram',
  reddit: 'Reddit', startup: 'Inicial', enterprise: 'Corporativo',
};

const normalize = (value: string) => value.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLocaleLowerCase().replace(/[^a-z0-9]+/g, ' ').trim();

export function translateAgentName(name: string, code?: string): string {
  const key = normalize(name);
  if (phraseMap[key]) return phraseMap[key];
  const codeKey = normalize((code || '').replace(/-/g, ' '));
  if (phraseMap[codeKey]) return phraseMap[codeKey];
  const source = key || codeKey;
  return source.split(' ').map(token => wordMap[token] || token.toLocaleUpperCase()).join(' ');
}

export function translateAgentCategory(value: string): string {
  const labels: Record<string, string> = {
    strategy: 'Estratégia', operations: 'Operações', technology: 'Tecnologia',
    governance: 'Governança', finance: 'Financeiro', 'human-resources': 'Recursos Humanos',
    legal: 'Jurídico', marketing: 'Marketing', sales: 'Vendas', product: 'Produto',
    research: 'Pesquisa', security: 'Segurança', compliance: 'Conformidade',
    data: 'Dados', infrastructure: 'Infraestrutura', 'customer-success': 'Sucesso do Cliente',
    communications: 'Comunicação', other: 'Outros',
  };
  return labels[value] || value;
}

export function translateDivision(value: string): string {
  const labels: Record<string, string> = {
    academic: 'Acadêmica', design: 'Design', engineering: 'Engenharia', finance: 'Finanças',
    'game-development': 'Desenvolvimento de Jogos', gis: 'Geoprocessamento',
    healthcare: 'Saúde', marketing: 'Marketing', 'paid-media': 'Mídia Paga',
    product: 'Produto', 'project-management': 'Gestão de Projetos', research: 'Pesquisa',
    sales: 'Vendas', security: 'Segurança', 'spatial-computing': 'Computação Espacial',
    specialized: 'Especialidades', support: 'Suporte', testing: 'Testes',
  };
  return labels[value] || value;
}

export function translateCapability(value: string): string {
  const labels: Record<string, string> = {
    strategy: 'Estratégia', product: 'Produto', design: 'Design', engineering: 'Engenharia',
    data: 'Dados', security: 'Segurança', quality: 'Qualidade', growth: 'Crescimento',
    operations: 'Operações', governance: 'Governança', customer: 'Clientes', finance: 'Finanças',
  };
  return labels[value] || value;
}

export function translateRunbookTitle(value: string): string {
  const key = normalize(value);
  return phraseMap[key] || value;
}

export function translateRunbookGroup(value: string): string {
  const labels: Record<string, string> = {
    'core team': 'Equipe principal', 'growth team': 'Equipe de crescimento',
    'support team': 'Equipe de suporte', 'compliance & governance': 'Conformidade e governança',
    'quality assurance': 'Garantia da qualidade', 'campaign core': 'Núcleo da campanha',
    'platform specialists': 'Especialistas por plataforma', support: 'Suporte',
    'p0 critical response': 'Resposta crítica — P0',
    'verification & post-mortem': 'Verificação e análise pós-incidente',
  };
  return labels[normalize(value)] || value;
}

export function translateActivation(value: string): string {
  const labels: Record<string, string> = {
    always: 'Sempre ativo', 'as needed': 'Sob demanda', 'week 3+': 'A partir da 3ª semana',
    'post-fix': 'Após a correção', 'minutes to hours': 'De minutos a horas',
  };
  return labels[normalize(value)] || value;
}

export function translateRunbookMode(value: string): string {
  const labels: Record<string, string> = {
    'nexus-full': 'NEXUS Completo', 'nexus-sprint': 'NEXUS Ciclo Rápido',
    'nexus-micro': 'NEXUS Enxuto',
  };
  return labels[normalize(value)] || value;
}

export function translateDuration(value: string): string {
  return value
    .replace(/weeks?/gi, match => (/^week$/i.test(match) ? 'semana' : 'semanas'))
    .replace(/minutes?/gi, match => (/^minute$/i.test(match) ? 'minuto' : 'minutos'))
    .replace(/hours?/gi, match => (/^hour$/i.test(match) ? 'hora' : 'horas'));
}

export function translateProfileStatus(value: string): string {
  const labels: Record<string, string> = {
    disponivel: 'Disponível', em_avaliacao: 'Em avaliação', homologado: 'Homologado',
    nao_recomendado: 'Não recomendado',
  };
  return labels[value] || value;
}

export function translateRunbookSummary(title: string): string {
  const summaries: Record<string, string> = {
    'Startup MVP Build': 'Da ideia ao produto em operação com usuários reais, mantendo velocidade sem abrir mão dos testes e da qualidade.',
    'Enterprise Feature Development': 'Entrega de uma funcionalidade relevante em um produto corporativo existente, com conformidade, segurança, qualidade e alinhamento entre as partes envolvidas.',
    'Multi-Channel Marketing Campaign': 'Planejamento e lançamento de uma campanha coordenada entre canais, com consistência de marca e foco em aquisição e engajamento mensuráveis.',
    'Incident Response': 'Da detecção à análise pós-incidente, com resposta rápida a falhas em produção sem eliminar etapas essenciais.',
  };
  return summaries[title] || 'Cenário operacional e composição de equipe definidos pelo método de origem.';
}

export function translatePlannerText(value: string): string {
  const replacements: [RegExp, string][] = [
    [/runbook/gi, 'roteiro operacional'], [/objective/gi, 'objetivo'], [/capability/gi, 'capacidade'],
    [/strategy/gi, 'estratégia'], [/product/gi, 'produto'], [/engineering/gi, 'engenharia'],
    [/security/gi, 'segurança'], [/quality/gi, 'qualidade'], [/growth/gi, 'crescimento'],
    [/operations/gi, 'operações'], [/governance/gi, 'governança'], [/customer/gi, 'cliente'],
    [/finance/gi, 'finanças'], [/design/gi, 'design'], [/data/gi, 'dados'],
    [/textual match/gi, 'correspondência textual'], [/source document indexed/gi, 'documento original indexado'],
  ];
  return replacements.reduce((text, [pattern, replacement]) => text.replace(pattern, replacement), value);
}

export function translateProfileText(value: string): string {
  const phrases: Record<string, string> = {
    'AI Engineer': 'Engenheiro de Inteligência Artificial',
    'Frontend Developer': 'Desenvolvedor Front-end',
    'Backend Architect': 'Arquiteto Back-end',
    'Senior Developer': 'Desenvolvedor Sênior',
    'UX Architect': 'Arquiteto de Experiência do Usuário',
    'UX Researcher': 'Pesquisador de Experiência do Usuário',
    'UI Designer': 'Designer de Interfaces',
    'Growth Hacker': 'Especialista em Crescimento',
    'Social Media Strategist': 'Estrategista de Redes Sociais',
    'Content Creator': 'Criador de Conteúdo',
    'Brand Guardian': 'Guardião da Marca',
    'DevOps Automator': 'Especialista em Automação e DevOps',
  };
  return phrases[value.trim()] || value;
}
