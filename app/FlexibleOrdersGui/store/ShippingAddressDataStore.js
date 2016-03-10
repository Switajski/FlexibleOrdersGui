Ext.define('MyApp.store.ShippingAddressDataStore', {
    extend: 'MyApp.store.AddressDataStore',
    requires: ['MyApp.model.AddressData'],
    urlEndpoint: constants.REST_BASE_URL + 'reports/shippingAddress'
});