Ext.define('MyApp.store.DeliveryMethodDataStore', {
    extend: 'Ext.data.Store',
    customurl: constants.REST_BASE_URL +'deliverymethods/json',
    requires: ['MyApp.model.DeliveryMethodData'],

    constructor: function (cfg) {
        var me = this;
        cfg = cfg || {};
        me.callParent([Ext.apply({
            model: 'MyApp.model.DeliveryMethodData',
            storeId: 'DeliveryMethodDataStore',
            pageSize: 1000,
            proxy: {
                type: 'ajax',
                url: constants.REST_BASE_URL + 'customers/json',
                headers: {
                    accept: 'application/json'
                },
                reader: {
                    type: 'json',
                    root: 'data'
                },
                api: {
                    read: this.customurl,
                    update: constants.REST_BASE_URL + 'deliverymethods/udpate',
                    destroy: this.customurl,
                    create: constants.REST_BASE_URL + 'deliverymethods/create'
                },
                writer: {
                    type: 'json',
                    allowSingle: true,
                    root: 'data'
                }
            }
        }, cfg)]);
    }
});