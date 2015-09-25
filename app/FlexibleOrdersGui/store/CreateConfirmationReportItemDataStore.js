Ext.define('MyApp.store.CreateConfirmationReportItemDataStore', {
    extend: 'MyApp.store.ItemDataStore',
    alias: 'widget.CreateConfirmationReportItemDataStore',
    customurl: constants.REST_BASE_URL +'reportitems/ordered',
    groupField: 'orderNumber'
});