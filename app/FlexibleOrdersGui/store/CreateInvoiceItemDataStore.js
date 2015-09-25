Ext.define('MyApp.store.CreateCreditNoteItemDataStore', {
    extend: 'MyApp.store.ItemDataStore',
    alias: 'widget.CreateCreditNoteItemDataStore',
    customurl: constants.REST_BASE_URL +'reportitems/listAllToBeProcessed',
    groupField: 'documentNumber'
});