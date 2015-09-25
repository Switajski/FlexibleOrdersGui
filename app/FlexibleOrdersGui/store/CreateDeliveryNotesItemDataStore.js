Ext.define('MyApp.store.CreateDeliveryNotesItemDataStore', {
    extend: 'MyApp.store.ItemDataStore',
    alias: 'widget.CreateDeliveryNotesItemDataStore',
    customurl: constants.REST_BASE_URL +'reportitems/listAllToBeProcessed',
    groupField: 'documentNumber'
});