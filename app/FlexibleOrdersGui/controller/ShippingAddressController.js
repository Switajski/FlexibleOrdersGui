Ext.define('MyApp.controller.ShippingAddressController', {
    extend: 'MyApp.controller.AddressController',
    id: 'ShippingAddressController',
    models: ['AddressData'],
    stores: ['ShippingAddressDataStore', 'CreateDeliveryNotesItemDataStore'],
    views: ['ChangeShippingAddressWindow'],
    restUrl : constants.REST_BASE_URL + 'reports/shippingAddress',

    init: function (application) {
        this.control({
            '#ChangeShippingAddressWindow button[action=changeAddress]': {
                click: this.changeAddress
            }
        });
    },
});
