import assert from 'node:assert/strict';
import { recommendTeamComposition, PlannerRunbook } from '../src/services/agencyTeamPlanner';
import { AgencyAgentProfile } from '../src/types';

function profile(code: string, name: string, sourceFile: string, competencies: string[]): AgencyAgentProfile {
  return {
    id: code,
    organization_id: 'test-org',
    category: 'technology',
    specialty: 'engineering',
    name,
    code,
    identity: name,
    specialty_description: competencies.join(', '),
    competencies,
    personality: 'Analítico e colaborativo',
    responsibilities: competencies,
    methodology: 'Planejar, executar e validar',
    status: 'disponivel',
    source_file: sourceFile,
    source_hash: 'test-hash',
    created_at: '2026-01-01T00:00:00.000Z',
    updated_at: '2026-01-01T00:00:00.000Z',
  } as AgencyAgentProfile;
}

const profiles = [
  profile('backend-architect', 'Backend Architect', '`engineering/engineering-backend-architect.md`', ['incidente', 'recuperação', 'integração', 'arquitetura']),
  profile('growth-hacker', 'Growth Hacker', '`marketing/marketing-growth-hacker.md`', ['campanha', 'aquisição', 'leads', 'growth']),
  profile('agents-orchestrator', 'Agents Orchestrator', '`specialized/agents-orchestrator.md`', ['orquestração', 'equipes', 'planejamento']),
];

const runbooks: PlannerRunbook[] = [
  { slug: 'incident-response', title: 'Incident Response', mode: 'NEXUS-Micro', duration: 'P0-P3', summary: 'Incidente em produção', doc: 'incident.md', roster: [{ group: 'Resposta crítica', activation: 'always', agents: ['engineering-backend-architect'] }] },
  { slug: 'marketing-campaign', title: 'Marketing Campaign', mode: 'NEXUS-Sprint', duration: '4 semanas', summary: 'Campanha multicanal', doc: 'marketing.md', roster: [{ group: 'Campaign Core', activation: 'always', agents: ['marketing-growth-hacker'] }] },
  { slug: 'startup-mvp', title: 'Startup MVP', mode: 'NEXUS-Sprint', duration: '6 semanas', summary: 'Construção de MVP', doc: 'mvp.md', roster: [{ group: 'Core Team', activation: 'always', agents: ['agents-orchestrator'] }] },
  { slug: 'enterprise-feature', title: 'Enterprise Feature', mode: 'NEXUS-Sprint', duration: '8 semanas', summary: 'Feature enterprise', doc: 'feature.md', roster: [{ group: 'Core Team', activation: 'always', agents: ['engineering-backend-architect'] }] },
];

const incident = recommendTeamComposition('Responder a incidente de indisponibilidade em produção', profiles, runbooks);
assert.equal(incident.runbook?.slug, 'incident-response');
assert.equal(incident.recommendations[0]?.profile.code, 'backend-architect');
assert.equal(incident.recommendations[0]?.group, 'Resposta crítica');

const marketing = recommendTeamComposition('Planejar campanha de marketing e aquisição de leads', profiles, runbooks);
assert.equal(marketing.runbook?.slug, 'marketing-campaign');
assert.equal(marketing.recommendations[0]?.profile.code, 'growth-hacker');

const startup = recommendTeamComposition('Construir um novo produto SaaS MVP e protótipo', profiles, runbooks);
assert.equal(startup.runbook?.slug, 'startup-mvp');
assert.equal(startup.recommendations[0]?.profile.code, 'agents-orchestrator');

const enterprise = recommendTeamComposition('Desenvolver funcionalidade com integração e compliance em plataforma existente', profiles, runbooks);
assert.equal(enterprise.runbook?.slug, 'enterprise-feature');


const sourceOnlyProfile = profile('spatial-specialist', 'Spatial Specialist', '`gis/spatial-specialist.md`', ['cartografia']);
const sourceOnly = recommendTeamComposition(
  'Construir visualização geoespacial com LiDAR e Cesium',
  [sourceOnlyProfile],
  [],
  { 'spatial-specialist': 'lidar cesium pointcloud geospatial 3dtiles terrain' },
);
assert.equal(sourceOnly.recommendations[0]?.profile.code, 'spatial-specialist');
assert.ok(sourceOnly.recommendations[0]?.matches.includes('lidar'));

const empty = recommendTeamComposition('', profiles, runbooks);
assert.equal(empty.runbook, null);
assert.equal(empty.recommendations.length, 0);

console.log('OK: cenários de runbook e busca no conteúdo original passaram.');
