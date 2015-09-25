Ext.define('MyApp.store.AgreementItemDataStore', {
    extend: 'MyApp.store.ItemDataStore',
    alias: 'widget.AgreementItemDataStore',
    customurl: constants.REST_BASE_URL + 'reportitems/listAllToBeProcessed',
    customstoreid: 'AgreementItemDataStore',
    groupField: 'documentNumber'
});