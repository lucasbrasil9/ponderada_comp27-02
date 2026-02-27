# Documento de Requisitos como Ativo de Software

## Atividade Ponderada - Requisitos como Codigo

Este documento atende a atividade avaliativa separada do projeto principal e usa o dominio ASIS como contexto.

### Objetivo da entrega

1. Documentar regras de negocio em codigo executavel.
2. Aferir a qualidade dos requisitos por testes automatizados.
3. Evidenciar PASS/FAIL/NA por requisito com rastreabilidade.

## 1. Mapa de Business Drivers

### Driver 1 - Confiabilidade da Jornada

Assegurar que a jornada `upload -> processo -> resultado` funcione de forma consistente, incluindo tratamento controlado de erros.

### Driver 2 - Rastreabilidade e Integridade

Garantir que os identificadores da jornada (`arquivoId`, `processoId`) sejam correlacionados sem ruptura em todas as etapas observadas.

## 2. Mapa de Requisitos (escopo minimo da atividade)

### RF

1. `RF1 - Ingestao valida com protocolo`: upload valido deve retornar `processoId`, `arquivoId` e `status` inicial consistente.

### RNF

1. `RNF1 - Integridade da trilha`: correlacao entre IDs deve permanecer integra no ciclo completo.
2. `RNF2 - Tratamento de erro previsivel`: entradas invalidas devem retornar erros conhecidos, sem estado inconsistente.

## 3. Estrategia e Massa de Testes

### Estrategia

1. Blue Team: valida caminho feliz e contrato minimo esperado.
2. Red Team: provoca erros controlados e comportamento adverso.

### Massa

1. Arquivo valido: `SPED-EFD.txt` (emulado em fixture).
2. Arquivo vazio: `arquivo_vazio.txt` (emulado).
3. Arquivo com estrutura invalida: `arquivo_estrutura_invalida.txt` (emulado).
4. Arquivo corrompido: `arquivo_corrompido.bin` (emulado).

## 4. Codificacao como Documentacao de Testes

### Estrutura implementada

1. `src/simulator/asisSimulator.js`
2. `utils/evidence.js`
3. `tests/requirements/rf1-upload.test.js`
4. `tests/requirements/rnf1-rastreabilidade.test.js`
5. `tests/requirements/rnf2-erros-controlados.test.js`

### Convencao de evidencia

Cada teste grava um JSON em `reports/evidence/requirements/` com:

1. `id` do requisito.
2. Driver relacionado.
3. Time (`Blue`, `Red` ou `Blue/Red`).
4. Criterio esperado.
5. `status` final.
6. Dados resumidos da execucao.

## 5. Matriz de Rastreabilidade

| ID | Tipo | Driver | Teste | Massa | Evidencia | Status | Conclusao |
| --- | --- | --- | --- | --- | --- | --- | --- |
| RF1 | Funcional | Confiabilidade | `tests/requirements/rf1-upload.test.js` | Valida | `reports/evidence/requirements/rf1-*.json` | PASS/FAIL/NA | Validar protocolo inicial de ingestao |
| RNF1 | Nao Funcional | Rastreabilidade | `tests/requirements/rnf1-rastreabilidade.test.js` | Valida | `reports/evidence/requirements/rnf1-*.json` | PASS/FAIL/NA | Confirmar integridade da trilha |
| RNF2 | Nao Funcional | Confiabilidade | `tests/requirements/rnf2-erros-controlados.test.js` | Invalida/Corrompida | `reports/evidence/requirements/rnf2-*.json` | PASS/FAIL/NA | Confirmar erro controlado |

## 6. Execucao

1. Instalar dependencias:

```bash
npm install
```

2. Executar apenas a atividade:

```bash
npm run test:requirements
```

3. Resultado esperado:

- Testes em `PASS` quando criterios forem atendidos.
- Evidencias JSON geradas em `reports/evidence/requirements/`.
