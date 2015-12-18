Ext.define('MyApp.controller.ShippingAddressController', {
    extend: 'Ext.app.Controller',
    id: 'ShippingAddressController',
    models: ['AddressData'],
    stores: ['ShippingAddressDataStore'],
    views: ['ChangeShippingAddressWindow'],

    init: function (application) {
        this.control({
            'button[action=changeShippingAddress]': {
                click: this.changeShippingAddress
            }
        });
    },

    getDocumentNumbers : function(){
        var store = Ext.getStore('CreateDeliveryNotesItemDataStore');
        var documentNumbers = [];
        var items = store.data.items;
        for (var i = 0; i < items.length; i++) {
            var docNo = items[i].data.documentNumber;
            if (Ext.Array.indexOf(documentNumbers, docNo) == -1)
                documentNumbers.push(docNo);
        }
        return documentNumbers;
    },

    onChangeShippingAddress: function (documentNumbers) {
        var store = MyApp.getApplication().getStore('ShippingAddressDataStore');
        store.load({
            params: documentNumbers,
            scope: this,
            callback: function (records, operation, success) {
                if (success) {
                    console.log('success');
                    var form = Ext.getCmp('ChangeShippingAddressWindow').down('form').getForm();
                    var record = records[0].data;
                    form.setValues({
                        name1: record.name1,
                        name2: record.name2,
                        street: record.street,
                        postalCode: record.postalCode,
                        city: record.city,
                        country: record.country
                    });
                }
                else{
                    csaw.destroy();
                    Ext.MessageBox.alert('Konnte Lieferadressen der ABs nicht lesen');
                }
            }
        });

        var csaw = Ext.create('MyApp.view.ChangeShippingAddressWindow', {
            store: store
        });
        csaw.show();
    },

    changeShippingAddress: function (event, record, store) {
        var values = Ext.getCmp('ChangeShippingAddressWindow').down('form').getForm().getValues();
        var store = MyApp.getApplication().getStore('ShippingAddressDataStore');

        var documentNumbers = [];
        store.data.items.forEach(function(entry){
           documentNumbers.push(entry.data.documentNumber);
        });

        Ext.Ajax.request({
            url: constants.REST_BASE_URL + 'reports/shippingAddress',
            method: 'POST',
            // headers: { 'Content-Type': 'application/json' },
            jsonData: {
                name1: values.name1,
                name2: values.name2,
                street: values.street,
                postalCode: values.postalCode,
                city: values.city,
                country: values.country,
                documentNumbers: documentNumbers
            },
            success: function (response) {
                var text = response.responseText;
                // Sync
                MyApp.getApplication().getController('MyController').sleep(500);
                var allGrids = Ext.ComponentQuery.query('PositionGrid');
                allGrids.forEach(function (grid) {
                    grid.getStore().load();
                });
                Ext.getCmp("ChangeShippingAddressWindow").close();
            },
            failure: function(response) {
                var responseText =  Ext.JSON.decode(response.responseText);
                Ext.Object.each(responseText.errors, function(field, errorText){
                    var field = form.down("[name=" + field + "]");
                    field.markInvalid(errorText);
                    field.addCls('custom-invalid');
                });
            }
        });

    }
});
