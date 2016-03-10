Ext.define('MyApp.controller.InvoicingAddressController', {
    extend: 'MyApp.controller.AddressController',
    id: 'InvoicingAddressController',
    models: ['AddressData'],
    stores: ['InvoicingAddressDataStore', 'CreateInvoiceItemDataStore'],
    views: ['ChangeInvoicingAddressWindow'],
    restUrl : constants.REST_BASE_URL + 'reports/invoicingAddress',

    init: function (application) {
        this.control({
            '#ChangeInvoicingAddressWindow button[action=changeAddress]': {
                click: this.changeAddress
            }
        });
    },
});
