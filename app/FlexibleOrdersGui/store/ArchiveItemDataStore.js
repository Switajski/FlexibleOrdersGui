Ext.define('MyApp.store.ArchiveItemDataStore', {
    extend: 'MyApp.store.ItemDataStore',
    alias: 'widget.ArchiveItemDataStore',
    customurl: constants.REST_BASE_URL + 'reportitems/listAllToBeProcessed',
    custommodel: 'MyApp.model.ItemData',
    customstoreid: 'ArchiveItemDataStore',
    groupField: 'documentNumber',
    requires: ['MyApp.model.ItemData']
});