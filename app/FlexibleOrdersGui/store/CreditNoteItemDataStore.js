Ext.define('MyApp.store.CreditNoteItemDataStore', {
    extend: 'MyApp.store.ItemDataStore',
    alias: 'widget.CreditNoteItemDataStore',
    customurl: constants.REST_BASE_URL +'reportitems/listAllToBeProcessed',
    customstoreid: 'CreditNoteItemDataStore',
    groupField: 'documentNumber'
});