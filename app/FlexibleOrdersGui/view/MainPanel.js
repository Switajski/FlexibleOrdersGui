Ext.define('MyApp.view.MainPanel', {
    id : 'MainPanel',
    extend: 'Ext.panel.Panel',
    frame: false,
    layout: {
        align: 'stretch',
        type: 'vbox'
    },
    bodyPadding: 7,
    title: 'Stand der Bestellungen',
    requires: ['MyApp.store.ItemDataStore'],
    dockedItems: [{
        xtype: 'toolbar',
        dock: 'top',
        items: [{
            id: 'ErstelleBestellungButton',
            icon: constants.RESOURCES_BASE_URL + 'images/add.png',
            text: 'erstelle Bestellung',
            scope: this
        }, {
            id: 'CreateCustomerButton',
            icon: constants.RESOURCES_BASE_URL + 'images/add.png',
            text: 'erstelle Kunden',
            scope: this
        }, {
            id: 'UpdateCustomerButton',
            icon: constants.RESOURCES_BASE_URL + 'images/update.png',
            text: 'Kunden bearbeiten',
            scope: this
        }, {
            id: 'ShowSums',
            icon: constants.RESOURCES_BASE_URL + 'images/update.png',
            text: 'Offene Betr&auml;ge anzeigen',
            scope: this
        }]

    }],

    initComponent: function () {
        var me = this;
        border = 10;

        Ext.applyIf(me, {
            items: [{
                xtype: 'fieldcontainer',
                items: [{
                    xtype: 'customercombobox',
                    id: 'mainCustomerComboBox',
                    fieldLabel: 'Kunde',
                    enableKeyEvents: true
                }, {
                    xtype: 'OrderItemGrid',
                    store: 'ItemDataStore',
                    customurl: constants.REST_BASE_URL + 'customers/json/getItems'
                }, {
                    xtype: 'splitter'
                }, {
                    xtype: 'ShippingItemGrid',
                    store: 'ShippingItemDataStore'
                }, {
                    xtype: 'splitter'
                }, {
                    xtype: 'DeliveryNotesItemGrid',
                    store: 'DeliveryNotesItemDataStore'
                }, {
                    xtype: 'splitter'
                }, {
                    xtype: 'InvoiceItemGrid',
                    store: 'InvoiceItemDataStore'
                }]
            }]

        });
        me.callParent(arguments);
    }
});