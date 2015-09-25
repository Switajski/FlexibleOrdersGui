Ext.define('MyApp.store.KundeDataStore', {
    extend: 'Ext.data.Store',
    customurl: constants.REST_BASE_URL +'customers/json',
    requires: ['MyApp.model.KundeData'],

    constructor: function (cfg) {
        var me = this;
        cfg = cfg || {};
        me.callParent([Ext.apply({
            model: 'MyApp.model.KundeData',
            storeId: 'KundeDataStore',
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
                    update: constants.REST_BASE_URL + 'customers/udpate',
                    destroy: this.customurl,
                    create: constants.REST_BASE_URL + 'customers/create'
                },
                writer: {
                    type: 'json',
                    allowSingle: true,
                    root: 'data',
                    onProxyWrite: ( function () {
                        error("asdf");
                    })
                }
            }
        }, cfg)]);
    }
});