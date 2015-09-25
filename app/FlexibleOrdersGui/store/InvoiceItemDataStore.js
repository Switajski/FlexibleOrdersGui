Ext.define('MyApp.store.InvoiceItemDataStore', {
    extend: 'MyApp.store.ItemDataStore',
    alias: 'widget.InvoiceItemDataStore',
    customurl: constants.REST_BASE_URL +'reportitems/listAllToBeProcessed',
    customstoreid: 'InvoiceItemDataStore',
    groupField: 'documentNumber'
});