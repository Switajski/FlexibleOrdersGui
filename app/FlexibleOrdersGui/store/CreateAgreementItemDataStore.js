Ext.define('MyApp.store.CreateAgreementItemDataStore', {
    extend: 'MyApp.store.ItemDataStore',
    alias: 'widget.CreateAgreementItemDataStore',
    customurl: constants.REST_BASE_URL + 'reportitems/listAllToBeProcessed',
    groupField: 'documentNumber'
});