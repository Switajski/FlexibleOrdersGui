Ext.define('MyApp.store.CreateInvoiceItemDataStore', {
    extend: 'MyApp.store.ItemDataStore',
    alias: 'widget.CreateInvoiceItemDataStore',
    customurl: constants.REST_BASE_URL +'reportitems/listAllToBeProcessed',
    groupField: 'documentNumber'
});