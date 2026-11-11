-- ====================================================================
-- NOS-OS — Remoção de duplicatas (v3)
-- Mantém o registro com menor ID por código
-- ====================================================================

-- Departamentos
DELETE FROM departments d
USING departments d2
WHERE d.code = d2.code
AND d.id > d2.id;

-- Posições
DELETE FROM positions p
USING positions p2
WHERE p.code = p2.code
AND p.id > p2.id;

-- Funções
DELETE FROM functions f
USING functions f2
WHERE f.code = f2.code
AND f.id > f2.id;

-- Atribuições de função (manter por function_id + agent_id)
DELETE FROM function_assignments fa
USING function_assignments fa2
WHERE fa.function_id = fa2.function_id
AND fa.agent_id = fa2.agent_id
AND fa.id > fa2.id;

-- Roles
DELETE FROM roles r
USING roles r2
WHERE r.code = r2.code
AND r.id > r2.id;

-- Role permissions
DELETE FROM role_permissions rp
USING role_permissions rp2
WHERE rp.role_id = rp2.role_id
AND rp.resource = rp2.resource
AND rp.action = rp2.action
AND rp.id > rp2.id;

-- Secret references
DELETE FROM secret_references sr
USING secret_references sr2
WHERE sr.name = sr2.name
AND sr.id > sr2.id;

-- Relatório final
SELECT 'DEPARTAMENTOS' as entidade, COUNT(*) as total FROM departments
UNION ALL SELECT 'POSICOES', COUNT(*) FROM positions
UNION ALL SELECT 'FUNCOES', COUNT(*) FROM functions
UNION ALL SELECT 'ATRIBUICOES', COUNT(*) FROM function_assignments
UNION ALL SELECT 'ROLES', COUNT(*) FROM roles
UNION ALL SELECT 'PERMISSOES', COUNT(*) FROM role_permissions
UNION ALL SELECT 'SEGREDOS', COUNT(*) FROM secret_references;
