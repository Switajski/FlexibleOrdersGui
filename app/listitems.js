// @require @packageOverrides
Ext.Loader.setConfig({
    enabled: true,
    // removes the "?ds=2354134" out of "http://...../listitems.js?ds=234235"
    // neccessary for modifying and saving code in browser
    disableCaching:false
});

Ext.define('constants', {
    singleton: true,
    REST_BASE_URL: '',
    RESOURCES_BASE_URL: 'FlexibleOrdersGui/'
});

Ext.application({
    appFolder: 'FlexibleOrdersGui',
    models: ['BestellungData', 'ItemData', 'ArtikelData', 'KundeData'],
    stores: ['ArtikelDataStore', 'ArchiveItemDataStore',
        'BestellungDataStore', 'ItemDataStore', 'InvoiceItemDataStore',
        'KundeDataStore', 'ShippingItemDataStore'],
    views: ['MainPanel', 'TransitionWindow', 'ConfirmWindow', 'IssueWindow',
        'DeliverWindow', 'PositionGridPanel',
        'OrderItemGridPanel', 'ShippingItemGridPanel',
        'InvoiceItemGridPanel', 'ArchiveItemGridPanel', 'CustomerComboBox'],
    autoCreateViewport: false,
    controllers: ['MyController', 'AgreementController',
        'CustomerController',
        'IssueController', // FIXME: removing that useless line of code
        // makes the extjs application not starting
        'ConfirmController', 'DeliverController', 'InvoiceController',
        'MarkPaidController', 'OrderController', 'SecurityController',
        'InvoicingAddressController', 'ShippingAddressController'
    ],
    name: 'MyApp',
    // autoCreateViewport:true,
    launch: function () {
        Ext.create('MyApp.view.MainPanel', {
            layout: 'fit',
            renderTo: Ext.get('extjs_listitems')
        });
        MyApp.constants = {};

        Ext.apply(MyApp.constants, {
            FILTER_ON_CUSTOMER: 'customerNumber',
            FILTER_ON_STATUS: 'status',
            FILTER_STATUS_STATES: {
                ORDERED: 'ordered',
                CONFIRMED: 'confirmed',
                AGREED: 'agreed',
                SHIPPED: 'shipped',
                INVOICED: 'invoiced'
            }
        });
    }
});
