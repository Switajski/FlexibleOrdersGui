Ext.define('MyApp.store.AddressDataStore', {
    extend: 'Ext.data.Store',
    requires: ['MyApp.model.AddressData'],
    urlEndpoint : constants.REST_BASE_URL + 'reports/shippingAddress',
    constructor: function (cfg) {
        var me = this;
        cfg = cfg || {};
        me.callParent([Ext.apply({
            model: 'MyApp.model.AddressData',
            storeId: 'AddressDataStore',
            pageSize: 100,
            proxy: {
                type: 'ajax',
                url: me.urlEndpoint,
                headers: {
                    accept: 'application/json'
                },
                reader: {
                    type: 'json',
                    root: 'data',
                    successProperty: 'success'
                }
            }
        }, cfg)]);
    }
});