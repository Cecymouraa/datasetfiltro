# Dataset: Contas Contábeis (Protheus)


**ERP Integrado:** TOTVS Protheus (Tabela CT1)

---

## 📌 Contexto e Motivação
Por padrão, a integração ou consulta direta ao plano de contas do Protheus retorna **todas** as contas contábeis registradas na tabela `CT1` (incluindo contas sintéticas, contas bloqueadas e contas de uso exclusivo da controladoria). 

Para melhorar a usabilidade e evitar erros de preenchimento nos formulários do Fluig, o usuário/área de negócio solicitou que a listagem de contas fosse restrita, exibindo apenas as opções válidas para o processo atual. 

Por esse motivo, este dataset customizado foi criado para atuar como uma camada de filtro (Middleware) entre o Fluig e o Protheus.

##  Objetivo
Disponibilizar a listagem de Contas Contábeis de forma filtrada, garantindo que o usuário final visualize apenas as contas passíveis de movimentação.

## ⚙️ Regras de Negócio (Filtros Aplicados)
O dataset filtra as contas contábeis vindas do Protheus baseando-se nas seguintes regras:

1. **Apenas Contas Analíticas:** Filtra o campo `CT1_CLASSE` (Ex: Considera apenas classe '2' - Analítica), ocultando as contas sintéticas/totalizadoras.
2. **Apenas Contas Ativas:** Filtra o campo `CT1_BLOQ` (Ex: Considera apenas contas onde o bloqueio é '2' - Não).
3. **[Adicione outro filtro se houver]:** Exemplo: Contas restritas a um grupo específico (Ex: Despesas).

## 🛠️ Detalhes Técnicos
* **Tipo de Dataset:** Script Customizado
* **Campos Retornados:**
  * `COD_CONTA` (Código da Conta Contábil)
  * `DESC_CONTA` (Descrição da Conta)
  * `NATUREZA` (Natureza da Conta)
  * `CLASSE` (Analítica/Sintética)

