Ext.define('MyApp.view.OrderWindow', {
    extend: 'MyApp.view.TransitionWindow',
    title: 'Bestellung aufgeben',
    width: 700,
    id: 'OrderWindow',

    headerForm: {
        xtype: 'fieldset',
        title: 'Bestellung',
        //flex: 1,
        items: [{
            xtype: 'fieldcontainer',
            layout: 'hbox',
            combineErrors: true,
            defaultType: 'textfield',
            defaults: {
                labelWidth: 70
            },
            items: [{
                xtype: 'displayfield',
                anchor: '100%',
                name: 'customerNumber',
                fieldLabel: 'Kundennr',
            }, {
                xtype: 'displayfield',
                anchor: '100%',
                margins: '0 0 0 6',
                name: 'firstName'
            }, {
                xtype: 'displayfield',
                anchor: '100%',
                margins: '0 0 0 6',
                name: 'lastName'
            }],
        }, {
            xtype: 'fieldcontainer',
            layout: 'hbox',
            combineErrors: true,
            defaultType: 'textfield',
            defaults: {
                labelWidth: 70
            },
            items: [{
                itemid: 'newOrderNumber',
                xtype: 'ordernumbercombobox',
                labelWidth: 60,
                fieldLabel: 'Bestellnr',
                listeners: {
                    // change : this.onOrderNumberChange,
                    specialkey: function (field, e) {
                        if (e.getKey() == e.ENTER) {
                            me.onOrderNumberChange(field, e);
                            Ext.ComponentQuery
                                .query('#ErstelleBestellungForm button[itemid=add]')[0]
                                .focus();
                        }
                    }
                }
            }, {
                xtype: 'datefield',
                format: 'd/m/Y',
                allowBlank: true,
                fieldLabel: 'Bestelldatum',
                margins: '0 0 0 10',
                name: 'created'
            }]
        }]
    },
    deliveryAddressForm: null,
    addressForm: null,
    bottomGrid: {
        xtype: 'CreateOrderItemGrid',
        plugins: [Ext.create('Ext.grid.plugin.CellEditing', {
            clicksToEdit: 1
        })],
        dock: 'bottom',
        id: 'CreateOrderGrid',
        flex: 1,
        store: 'CreateOrderDataStore',
        title: "Bestellpositionen",
        features: null,
    },
    onSave: function (button, event, option) {
        MyApp.getApplication().getController('OrderController').order(button,
            event, option);
    }
});