-- ====================================================================
-- NOS-OS — Correção de constraints e remoção de duplicatas (v2)
-- Domínios 01 e 07
-- ====================================================================

DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'roles_company_code_unique') THEN
        ALTER TABLE roles ADD CONSTRAINT roles_company_code_unique UNIQUE (company_id, code);
    END IF;
EXCEPTION WHEN OTHERS THEN NULL;
END $$;

DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'secret_references_company_name_unique') THEN
        ALTER TABLE secret_references ADD CONSTRAINT secret_references_company_name_unique UNIQUE (company_id, name);
    END IF;
EXCEPTION WHEN OTHERS THEN NULL;
END $$;

DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'role_permissions_unique') THEN
        ALTER TABLE role_permissions ADD CONSTRAINT role_permissions_unique UNIQUE (role_id, resource, action);
    END IF;
EXCEPTION WHEN OTHERS THEN NULL;
END $$;

-- Remover duplicatas de departamentos
DELETE FROM departments d
USING departments d2
WHERE d.id > d2.id AND d.company_id = d2.company_id AND d.code = d2.code;

-- Remover duplicatas de posições
DELETE FROM positions p
USING positions p2
WHERE p.id > p2.id AND p.company_id = p2.company_id AND p.code = p2.code;

-- Remover duplicatas de funções
DELETE FROM functions f
USING functions f2
WHERE f.id > f2.id AND f.company_id = f2.company_id AND f.code = f2.code;

-- Remover duplicatas de roles
DELETE FROM roles r
USING roles r2
WHERE r.id > r2.id AND r.company_id = r2.company_id AND r.code = r2.code;

-- Remover duplicatas de role_permissions
DELETE FROM role_permissions rp
USING role_permissions rp2
WHERE rp.id > rp2.id AND rp.role_id = rp2.role_id AND rp.resource = rp2.resource AND rp.action = rp2.action;

-- Inserir referências de segredos
INSERT INTO secret_references (company_id, name, description, provider, secret_path, status)
SELECT c.id, 'SUPABASE_PASSWORD', 'Senha de acesso ao PostgreSQL do Supabase', 'environment_variable', 'SUPABASE_PASSWORD', 'active'
FROM companies c WHERE c.issue_prefix = 'NET'
ON CONFLICT (company_id, name) DO NOTHING;

INSERT INTO secret_references (company_id, name, description, provider, secret_path, status)
SELECT c.id, 'SUPABASE_ANON_KEY', 'Chave anon do Supabase para acesso via API', 'environment_variable', 'SUPABASE_ANON_KEY', 'active'
FROM companies c WHERE c.issue_prefix = 'NET'
ON CONFLICT (company_id, name) DO NOTHING;

-- Relatório final após correção
SELECT 'DEPARTAMENTOS' as entidade, COUNT(*) as total FROM departments
UNION ALL SELECT 'POSICOES', COUNT(*) FROM positions
UNION ALL SELECT 'FUNCOES', COUNT(*) FROM functions
UNION ALL SELECT 'ATRIBUICOES', COUNT(*) FROM function_assignments
UNION ALL SELECT 'ROLES', COUNT(*) FROM roles
UNION ALL SELECT 'PERMISSOES', COUNT(*) FROM role_permissions
UNION ALL SELECT 'SEGREDOS', COUNT(*) FROM secret_references;
