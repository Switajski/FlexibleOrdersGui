Ext.define('MyApp.store.ShippingAddressDataStore', {
    extend: 'Ext.data.Store',
    requires: ['MyApp.model.AddressData'],
    constructor: function (cfg) {
        var me = this;
        cfg = cfg || {};
        me.callParent([Ext.apply({
            model: 'MyApp.model.AddressData',
            storeId: 'AddressDataStore',
            pageSize: 100,
            proxy: {
                type: 'ajax',
                url: constants.REST_BASE_URL + 'reports/shippingAddress',
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