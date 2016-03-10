Ext.define('MyApp.store.InvoicingAddressDataStore', {
    extend: 'MyApp.store.AddressDataStore',
    requires: ['MyApp.model.AddressData'],
    urlEndpoint: constants.REST_BASE_URL + 'reports/invoicingAddress'
});