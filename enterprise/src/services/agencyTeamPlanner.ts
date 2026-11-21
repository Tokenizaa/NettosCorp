import { AgencyAgentProfile } from '../types';

export interface PlannerRunbook {
  slug: string;
  title: string;
  mode: string;
  duration: string;
  summary: string;
  doc: string;
  roster: { group: string; activation: string; agents: string[] }[];
}

export interface TeamRecommendation {
  profile: AgencyAgentProfile;
  score: number;
  matches: string[];
  group?: string;
  activation?: string;
  reason: string;
}

const SCENARIO_RULES: Record<string, string[]> = {
  'incident-response': ['incidente', 'indisponibilidade', 'outage', 'vazamento', 'ataque', 'resposta a incidente', 'falha crítica', 'produção fora'],
  'marketing-campaign': ['campanha', 'marketing', 'aquisição', 'tráfego pago', 'redes sociais', 'lançamento', 'growth', 'geração de leads'],
  'enterprise-feature': ['funcionalidade', 'feature', 'integração', 'compliance', 'produto existente', 'plataforma existente', 'enterprise'],
  'startup-mvp': ['mvp', 'startup', 'novo produto', 'produto novo', 'protótipo', 'validar ideia', 'construir plataforma', 'desenvolver plataforma', 'saas'],
};

const normalize = (value: string) => value.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLocaleLowerCase();
const tokenize = (value: string) => normalize(value).split(/[^a-z0-9]+/).filter(token => token.length > 2);

function sourceIdentifier(profile: AgencyAgentProfile): string {
  return String(profile.source_file || '').replace(/[`'"]/g, '').split('/').pop()?.replace(/\.md$/i, '') || '';
}

function profileSearchText(profile: AgencyAgentProfile, originalSourceText = ''): string {
  return [
    profile.name, profile.code, profile.identity, profile.specialty,
    profile.specialty_description, profile.personality, profile.methodology,
    ...(profile.competencies || []), ...(profile.responsibilities || []), originalSourceText,
  ].join(' ');
}

export function recommendTeamComposition(
  objective: string,
  profiles: AgencyAgentProfile[],
  runbooks: PlannerRunbook[],
  originalSearchTextByCode: Record<string, string> = {},
): { runbook: PlannerRunbook | null; scenarioMatches: string[]; recommendations: TeamRecommendation[] } {
  const normalizedObjective = normalize(objective.trim());
  const objectiveTokens = new Set(tokenize(objective));
  if (!normalizedObjective) return { runbook: null, scenarioMatches: [], recommendations: [] };

  const scenarioCandidates = runbooks.map(runbook => {
    const keywords = SCENARIO_RULES[runbook.slug] || [];
    const matches = keywords.filter(keyword => normalizedObjective.includes(normalize(keyword)));
    return { runbook, matches, score: matches.length };
  }).sort((a, b) => b.score - a.score);

  const selectedScenario = scenarioCandidates[0]?.score ? scenarioCandidates[0] : null;
  const profileByIdentifier = new Map<string, AgencyAgentProfile>();
  for (const profile of profiles) {
    profileByIdentifier.set(profile.code, profile);
    const sourceId = sourceIdentifier(profile);
    if (sourceId) profileByIdentifier.set(sourceId, profile);
  }

  const rosterAssignments = new Map<string, { group: string; activation: string }>();
  if (selectedScenario) {
    for (const group of selectedScenario.runbook.roster) {
      for (const agentSlug of group.agents) {
        const profile = profileByIdentifier.get(agentSlug);
        if (profile && !rosterAssignments.has(profile.id)) {
          rosterAssignments.set(profile.id, { group: group.group, activation: group.activation });
        }
      }
    }
  }

  const recommendations = profiles.map(profile => {
    const profileTokens = new Set(tokenize(profileSearchText(profile, originalSearchTextByCode[profile.code] || '')));
    const matches = [...objectiveTokens].filter(token => profileTokens.has(token));
    const lexicalScore = matches.length / Math.max(1, objectiveTokens.size);
    const assignment = rosterAssignments.get(profile.id);
    const score = Math.min(1, lexicalScore * 0.55 + (assignment ? 0.45 : 0));
    const reason = assignment
      ? `Previsto no grupo ${assignment.group}; ativação: ${assignment.activation}.`
      : matches.length
        ? `Correspondência no conteúdo original, competências, responsabilidades ou metodologia: ${matches.slice(0, 6).join(', ')}.`
        : '';
    return { profile, score, matches, group: assignment?.group, activation: assignment?.activation, reason };
  }).filter(item => item.score > 0)
    .sort((a, b) => b.score - a.score || a.profile.name.localeCompare(b.profile.name))
    .slice(0, 18);

  return {
    runbook: selectedScenario?.runbook || null,
    scenarioMatches: selectedScenario?.matches || [],
    recommendations,
  };
}
