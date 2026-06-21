/**
 *

 * 
 * Ascendra - Cecilia
 * 06/2026
 * 
 * DATASET PARA FILTRAR  CONTA CONTABIL - PROTHEUS
 */

var init = {
    datasetName: 'ds_contaContabil',
    fluigService: 'REST_PROTHEUS',
    endpoint: '',
    method: 'post',
    primaryKey: [
        'CODCONTA',
    ],
    Index: [
        ['CODDESCCTA']],
    columns: [
        'CODCONTA',
        'DESCCONTA',
        'CODDESCCTA'
    ],
    params: {
        chave: "",
        execquery: ""
    }
}

function defineStructure() {

    for (var currentColumn = 0; currentColumn < init.columns.length; currentColumn++) {

        addColumn(init.columns[currentColumn], DatasetFieldType.STRING)

    }

    setKey(init.primaryKey)

    for (var currentiNDEX = 0; currentiNDEX < init.Index.length; currentiNDEX++) {

        addIndex(init.Index[currentiNDEX])

    }


}

function createStructure() {

    var dataset = DatasetBuilder.newDataset()
    for (var index = 0; index < init.columns.length; index++) {

        dataset.addColumn(init.columns[index])

    }

    return dataset
}

function createErrorStructure() {

    var dataset = DatasetBuilder.newDataset()
    dataset.addColumn('error')

    return dataset
}

function onSync(lastSyncDate) {

    var dataset = createStructure()

    var query = createDataset()

    if (!query.values) {

        return query
    }

    var primaryKeyCodes = []

    for (var currentRow = 0; currentRow < query.values.length; currentRow++) {

        var primaryKey = ''

        for (var index = 0; index < init.primaryKey.length; index++) {

            primaryKey += query.getValue(currentRow, init.primaryKey[index])
        }

        primaryKeyCodes[primaryKey] = true

        var row = new Array()

        for (var currentColumn = 0; currentColumn < init.columns.length; currentColumn++) {

            var value = query.getValue(currentRow, init.columns[currentColumn])

            row.push((value) ? value : '')
        }

        dataset.addOrUpdateRow(row)

    }

    /**
     * Getting current rows from API
     */

    query = DatasetFactory.getDataset(init.datasetName, null, null, null)

    if (query && query.values) {

        for (var currentRow = 0; currentRow < query.values.length; currentRow++) {

            var primaryKey = ''
            for (var index = 0; index < init.primaryKey.length; index++) {
                primaryKey += query.getValue(currentRow, init.primaryKey[index])
            }

            if (primaryKeyCodes[primaryKey] === undefined) {

                var row = new Array()

                for (var currentColumn = 0; currentColumn < init.columns.length; currentColumn++) {
                    row.push(query.getValue(currentRow, init.columns[currentColumn]))
                }

                dataset.deleteRow(row)
            }
        }
    }

    return dataset

}

function onMobileSync(user) {

    var result = {
        'fields': init.columns,
        'constraints': new Array(),
        'sortFields': ['CODCONTA']
    }
    return result
}

function createDataset(fields, constraints, sortFields) {

    var dataset = createStructure()

    try {

        var cnsquery = " "
            + " SELECT CODCONTA = CT1_CONTA "
            + " , DESCCONTA = CT1_DESC01 "
            + " , CODDESCCTA = CT1_CONTA +' - '+ CT1_DESC01 "
            + " FROM CT1010 "
            + " WHERE D_E_L_E_T_ = '' "
            + " AND CT1_CLASSE = '2' "
            + " AND CT1_BLOQ <> '1' "
            + " AND ( LEFT(CT1_CONTA,1) = '3' OR LEFT(CT1_CONTA,9) IN ('102030101','102050101') ) "
            + " ORDER BY CT1_CONTA "


        init.params.execquery = cnsquery;

        var service = fluigAPI.getAuthorizeClientService()
        var options = {
            companyId: getValue('WKCompany') + '',
            serviceCode: init.fluigService,
            endpoint: init.endpoint,
            method: init.method,
            params: init.params,
            timeoutService: '100',
        }

        var response = service.invoke(new org.json.JSONObject(options).toString())
        var data = JSON.parse(response.getResult())

        if (data) {

            if (data.Code == 200) {

                for (var j = 0; j < data.result.length; j++) {

                    var row = new Array()

                    for (var currentColumn = 0; currentColumn < init.columns.length; currentColumn++) {

                        var value = data.result[j][init.columns[currentColumn]]
                        row.push(value)
                    }

                    dataset.addRow(row)
                }

            } else {

                var row = new Array()
                row.push('Error to execute dataset "' + init.datasetName + '": ' + new org.json.JSONObject(response.getResult()).toString())

                dataset = createErrorStructure()
                dataset.addRow(row)

            }

        }
        else {

            var row = new Array()
            row.push('Error to execute dataset "' + init.datasetName + '": ' + new org.json.JSONObject(response.getResult()).toString())

            dataset = createErrorStructure()
            dataset.addRow(row)
        }
    }
    catch (exception) {

        var row = new Array()
        row.push('Error to execute dataset "' + init.datasetName + '": ' + exception.message)

        dataset = createErrorStructure()
        dataset.addRow(row)

        log.info('Error to execute dataset "' + init.datasetName + '": ' + exception.message)
    }
    return dataset
}
