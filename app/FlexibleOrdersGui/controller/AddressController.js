Ext.define('MyApp.controller.AddressController', {
    extend: 'Ext.app.Controller',
    models: ['AddressData'],
    restUrl : constants.REST_BASE_URL + 'reports/shippingAddress',

    getDocumentNumbers : function(){
        var store = this.getStore(this.stores[1]);
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
        var store = this.getStore(this.stores[0]);
        store.load({
            params: documentNumbers,
            scope: this,
            callback: function (records, operation, success) {
                if (success) {
                    var form = Ext.getCmp(this.views[0]).down('form').getForm();
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

        var csaw = this.getView(this.views[0]).create({
            store: store
        });

        csaw.show();
    },

    changeAddress: function (event, record, store) {
        var values = Ext.getCmp(this.views[0]).down('form').getForm().getValues();
        var store = MyApp.getApplication().getStore(this.stores[0]);
        var me = this;

        var documentNumbers = [];
        store.data.items.forEach(function(entry){
           documentNumbers.push(entry.data.documentNumber);
        });

        Ext.Ajax.request({
            url: me.restUrl,
            method: 'POST',
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
                Ext.getCmp(me.views[0]).close();
            },
            failure: function(response) {
                var responseText =  Ext.JSON.decode(response.responseText);
                Ext.Object.each(responseText.errors, function(field, errorText){
                    var field = form.findField(field);
                    field.markInvalid(errorText);
                    field.addCls('custom-invalid');
                });
            }
        });

    }
});
