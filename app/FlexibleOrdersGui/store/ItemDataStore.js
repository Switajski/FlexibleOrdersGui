Ext.define('MyApp.store.ItemDataStore', {
    extend: 'Ext.data.Store',
    customurl: constants.REST_BASE_URL +'reportitems/ordered',
    custommodel: 'MyApp.model.ItemData',
    customstoreid: 'ItemDataStore',
    requires: ['MyApp.model.ItemData'],
    alias: 'widget.ItemDataStore',
    groupField: 'orderNumber',
    constructor: function (cfg) {
        var me = this;
        cfg = cfg || {};
        me.callParent([Ext.apply({
            model: this.custommodel,
            storeId: this.customstoreid,
            autoLoad: false,
            pageSize: 100,
            remoteFilter: true,
            proxy: {
                type: 'ajax',
                actionMethods: {
                    read: 'GET',
                    update: 'PUT',
                    destroy: 'POST',
                    create: 'POST'
                },
                api: {
                    read: this.customurl,
                    update: this.customurl,
                    destroy: constants.REST_BASE_URL +'transitions/deleteOrder',
                    create: this.customurl
                },
                headers: {
                    Accept: 'application/json'
                },
                reader: {
                    type: 'json',
                    successProperty: 'success',
                    root: 'data',
                    messageProperty: 'message'
                },
                writer: {
                    allowSingle: false
                }
            }
        }, cfg)]);
    }
});