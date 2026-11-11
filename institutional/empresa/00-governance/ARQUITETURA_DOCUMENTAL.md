# ARQUITETURA DOCUMENTAL — NETTOSCORP

Versao: 1.0 (proposta, em definicao, NAO aprovada)
Data: 7 de novembro de 2026
Local: /home/lg/workspace/NettosCorp/empresa/00-governance/ARQUITETURA_DOCUMENTAL.md
Status: PROPOSTA INSTITUCIONAL — sujeita a revisao e aprovacao pela lideranca fundadora (Netto Farias).

---

## 1. Premissa

Este documento estabelece a arquitetura documental da NettosCorp, ou seja, como os documentos institucionais sao organizados, classificados, identificados, versionados, mantidos e relacionados. E uma proposta para aprovacao da lideranca. Nenhum documento e tratado como norma obrigatoria ate ser aprovado.

---

## 2. Raiz do repositorio documental

Todos os documentos institucionais da NettosCorp ficam em:

/home/lg/workspace/NettosCorp/empresa/

Nenhuma documentacao institucional deve ser criada fora desse caminho.

---

## 3. Hierarquia documental (estrutura de pastas existente)

| Pasta | Conteudo | Responsavel sugerido |
|-------|----------|----------------------|
| 00-governance/ | Governanca, memoria institucional, estrutura de autoridade, documentos oficiais de fundacao, arquitetura documental, protocolos | Chefe de Gabinete Executivo |
| 01-strategy/ | Visao empresarial, objetivos, prioridades, direcionamentos da lideranca fundadora, identidade e estrategia, roadmap | Lideranca fundadora / Chefe de Gabinete Executivo |
| 02-organization/ | Organograma conceitual, modelo operacional, diretorias, departamentos, papeis e responsabilidades | Chefe de Gabinete Executivo (proposta) |
| 03-management-system/ | Sistema de Gestao Corporativa, metodologias, politicas e procedimentos | Chefe de Gabinete Executivo (proposta) |
| 04-portfolio/ | Reconhecimento e catalogo de projetos existentes, portifolio de software | Chefe de Gabinete Executivo com supervisores locais |
| 05-technology/ | Arquitetura empresarial, pilha de tecnologia, padroes tecnicos | Chefe de Gabinete Executivo (proposta) |
| 06-operations/ | Operacao, servicos, suporte, processos de execucao e acompanhamento | Chefe de Gabinete Executivo (proposta) |
| 07-departments/ | Documentacao especifica de cada departamento especializado | Departamentos (quando criados) |
| 08-decisions/ | Historico de decisoes, registro de alteracoes, versoes de documentos | Chefe de Gabinete Executivo |
| 09-reports/ | Relatorios de acompanhamento, evidencias de execucao, registro de riscos e pendencias | Chefe de Gabinete Executivo |

---

## 4. Classificacao dos documentos

| Classe | Descricao | Exemplo |
|--------|-----------|---------|
| Institucional | Documentos de fundacao, memoria, governanca, autoridade | MEMORIA_INSTITUCIONAL_NETTOSCORP.md |
| Estrategico | Visao, missão, objetivos, roadmap, identificacao | IDENTIDADE_ESTRATEGIA_EMPRESARIAL.md |
| Organizacional | Estrutura, papeis, diretorias, departamentos | (a criar) |
| Gestao | Sistema de gestao, politicas, procedimentos | SISTEMA_GESTAO_CORPORATIVA.md |
| Operacional | Protocolos, rotinas, evidencias, relatorios | (a criar) |
| Decisao | Registro de decisoes, alteracoes, versoes | (a criar em 08-decisions/) |
| Risco | Registro de riscos e pendencias | (a criar em 09-reports/) |

---

## 5. Identificacao e nomenclatura

Padrao proposto para nomes de arquivos:

[AA]-[DESCRITOR]_[DD]M[AAAA].md

Onde:
- [AA] = numero de dois digitos da pasta destino (00 a 09).
- [DESCRITOR] = nome descritivo em maiusculas, sem espacos, usando underline.
- [DD]M[AAAA] = dia, mes abreviado e ano (ex: 07N2026).

Exemplos:
- 00-MEMORIA_INSTITUCIONAL_NETTOSCORP_07N2026.md
- 01-ROADMAP_CORPORATIVO_07N2026.md
- 08-DECISAO_001_APROVACAO_ESTRUTURA_07N2026.md

**Observacao:** Os documentos ja criados (MEMORIA_INSTITUCIONAL_NETTOSCORP.md, ROADMAP_CORPORATIVO.md, etc.) mantem seus nomes atuais para evitar quebra de referencias. O padrao acima se aplica a novos documentos a partir desta versao.

---

## 6. Versionamento

- Todo documento institucional deve ter versao (ex: Versao: 1.0).
- Alteracoes incrementam a versao (1.0 -> 1.1 para revisoes menores; 1.0 -> 2.0 para revisoes maiores).
- A data da versao deve ser registrada.
- O status do documento (proposta, em definicao, aprovado, obsoleto) deve ser declarado no cabecalho.
- Historico de versoes deve ser mantido no final do documento ou em 08-decisions/.

---

## 7. Responsáveis

- Cada documento deve ter um responsavel declarado no cabecalho.
- O responsavel pela atualizacao e manutencao e o Chefe de Gabinete Executivo, salvo consenso em contrario.
- Documentos de estrategia podem ter a lideranca fundadora como responsavel.

---

## 8. Fonte oficial de verdade

- Para cada assunto relevante, existe exatamente um documento considerado fonte oficial de verdade.
- O caminho absoluto do documento fonte deve ser citado em qualquer referencia cruzada.
- Nenhuma informacao relevante deve viver apenas na memoria de uma conversa.

---

## 9. Relacoes entre documentos

- Documentos podem referenciar outros documentos por caminho absoluto.
- Relacao de dependencia: um documento pode depender da aprovacao de outro (ex: Sistema de Gestao depende da aprovacao da Governanca).
- Relacao de substituicao: versoes posteriores substituem versoes anteriores; a versao anterior e mantida para historico.

---

## 10. Controle de documentos obsoletos

- Documentos obsoletos nao sao excluidos; sao movidos para uma subpasta de historico ou marcados como OBSOLETO no cabecalho.
- A versao obsoleta e mantida para auditoria e rastreabilidade.
- O documento vigente deve indicar claramente que versoes anteriores estao obsoletas.

---

## 11. Registro de decisoes

- Todas as decisoes relevantes da NettosCorp devem ser registradas em 08-decisions/.
- O registro oficial de deliberacoes é o documento `empresa/08-decisions/REGISTRO_DE_DELIBERACOES.md`, que serve como fonte institucional de verdade para todas as decisoes relevantes.
- Cada registro de decisao deve conter: identificador unico (formato DEC-YYYYMMDD-NNN), data, assunto, contexto, autoridade responsavel, deliberacao e justificativa, aprovacoes e ressalvas, acoes autorizadas, responsaveis, status e evidencias.
- Cada registro deve ser classificado conforme a autoridade decisoria: APROVADA PELO CONSELHEIRO, APROVADA PELO FUNDADOR, RECOMENDADA, PENDENTE DO FUNDADOR, EXECUTADA ou REVOGADA.
- Deliberacoes e ordens de trabalho recebidas do Conselheiro e do fundador sao arquivadas individualmente em `empresa/08-decisions/deliberacoes/AAAA/MM/` com padrao de nome `DELIB-NNN-AAAA-MM-DD-assunto.md`.
- Formato sugerido para registros de decisao: DEC-001, DEC-002, etc.

---

## 12. Evidências e relatórios

- Evidencias de execucao de atividades devem ser mantidas em 09-reports/.
- Relatorios de acompanhamento periodicos devem ser produzidos conforme protocolo de execucao e prestacao de contas.
- Registro de riscos e pendencias deve ser mantido em 09-reports/.

---

## 13. Modelos reutilizáveis

Os modelos abaixo devem ser criados como arquivos separados em 00-governance/ (ou subpastas) para reuso:

| Modelo | Local sugerido | Descricao |
|--------|---------------|-----------|
| Modelo de documento institucional | 00-governance/MODELO_DOCUMENTO.md | Estrutura padrao para documentos oficiais |
| Modelo de decisao | 08-decisions/MODELO_DECISAO.md | Estrutura padrao para registro de decisoes |
| Modelo de politica | 03-management-system/MODELO_POLITICA.md | Estrutura padrao para politicas |
| Modelo de procedimento | 03-management-system/MODELO_PROCEDIMENTO.md | Estrutura padrao para procedimentos |
| Modelo de relatorio | 09-reports/MODELO_RELATORIO.md | Estrutura padrao para relatorios de acompanhamento |
| Modelo de plano de fase | 01-strategy/MODELO_PLANO_FASE.md | Estrutura padrao para planos de fase do roadmap |
| Modelo de plano de subfase | 01-strategy/MODELO_PLANO_SUBFASE.md | Estrutura padrao para planos de subfase |

---

## 14. Exemplo de cabecalho padrao

Todo documento institucional deve conter, no minimo:

```
# TITULO DO DOCUMENTO — NETTOSCORP

Versao: X.Y (status)
Data: DD de mes de AAAA
Local: /home/lg/workspace/NettosCorp/empresa/XX-pasta/NOME_DO_ARQUIVO.md
Status: PROPOSTA / EM DEFINICAO / APROVADO / OBSOLETO
Responsavel: Nome ou cargo
```

---

## 15. Recuperacao

Documento completo: /home/lg/workspace/NettosCorp/empresa/00-governance/ARQUITETURA_DOCUMENTAL.md

Recuperar em novas sessoes com:

read_file(path="/home/lg/workspace/NettosCorp/empresa/00-governance/ARQUITETURA_DOCUMENTAL.md")

---

Nenhum codigo de projeto foi alterado. Nenhuma estrutura de organograma foi implantada. Este e apenas uma proposta de arquitetura documental para avaliacao da lideranca.