# Dataset: Contas Contábeis Filtradas (Protheus)

**Nome do Dataset:** `ds_contaContabil`  
**Autor:** Ascendra - Cecilia  
**Data:** 06/2026  
**ERP Integrado:** TOTVS Protheus (Tabela CT1010 via API REST)  

---

##  Contexto e Motivação
Por padrão, a integração direta ao plano de contas do Protheus retorna **todas** as contas contábeis registradas na tabela `CT1`. Para melhorar a usabilidade, evitar erros de preenchimento nos formulários do Fluig e atender às solicitações das áreas de negócio, este dataset customizado foi criado. 

Ele executa uma consulta (query) customizada via API REST (`REST_PROTHEUS`), retornando apenas as contas passíveis de movimentação conforme os filtros contábeis estabelecidos.

## 🎯 Objetivo
Disponibilizar a listagem de Contas Contábeis de forma filtrada e concatenada, garantindo que o usuário final visualize apenas as contas ativas, analíticas e pertinentes aos processos de despesas/específicos.

## ⚙️ Regras de Negócio (Filtros SQL Aplicados)
O dataset filtra as contas contábeis vindas do Protheus baseando-se na seguinte cláusula técnica:

1. **Registros Ativos no Protheus:** `D_E_L_E_T_ = ''` (Ignora registros deletados na base).
2. **Apenas Contas Analíticas:** `CT1_CLASSE = '2'` (Oculta contas sintéticas/totalizadoras).
3. **Contas Desbloqueadas:** `CT1_BLOQ <> '1'` (Filtra apenas contas que não estão com status de bloqueio ativo).
4. **Regra de Grupo de Contas (Específica do Negócio):** `AND ( LEFT(CT1_CONTA,1) = '3' OR LEFT(CT1_CONTA,9) IN ('102030101','102050101') )`
   * Traz todas as contas que iniciam com o dígito **3** (geralmente contas de Despesas/Custos/Resultado).
   * **OU** traz especificamente as contas que iniciam com as raízes **102030101** ou **102050101** (exceções mapeadas).

## 🛠️ Detalhes Técnicos e Retorno
* **Tipo de Dataset:** Customizado (Script) Sincronizado (possui rotina `onSync` para uso off-line no Fluig Mobile).
* **Campos Retornados:**
  * `CODCONTA` (Código da Conta Contábil)
  * `DESCCONTA` (Descrição da Conta)
  * `CODDESCCTA` (Campo de apoio concatenado: *Código - Descrição*)

## 💻 Exemplo de Uso no Formulário (Zoom)
Para utilizar este dataset em um componente de Zoom no formulário HTML do Fluig, utilizando a coluna concatenada, utilize a estrutura abaixo:

```html
<label>Conta Contábil</label>
<input type="zoom" id="codContaContabil" name="codContaContabil"
    data-zoom="{
        'displayKey':'CODDESCCTA',
        'datasetId':'ds_contaContabil',
        'placeholder':'Selecione a conta',
        'fields':[
            {
                'field':'CODCONTA',
                'label':'Código'
            },{
                'field':'DESCCONTA',
                'label':'Descrição'
            }
        ]
    }" 
/>
