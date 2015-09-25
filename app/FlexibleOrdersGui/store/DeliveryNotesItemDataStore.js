Ext.define('MyApp.store.DeliveryNotesItemDataStore', {
    extend: 'MyApp.store.ItemDataStore',
    alias: 'widget.DeliveryNotesItemDataStore',
    customurl: constants.REST_BASE_URL + 'reportitems/listAllToBeProcessed',
    customstoreid: 'DeliveryNotesItemDataStore',
    groupField: 'documentNumber',
});