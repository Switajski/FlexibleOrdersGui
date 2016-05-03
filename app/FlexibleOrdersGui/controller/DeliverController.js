Ext.define('MyApp.controller.DeliverController', {
    debug: true,
    extend: 'Ext.app.Controller',

    id: 'DeliverController',
    models: ['ItemData'],
    stores: ['CreateDeliveryNotesItemDataStore'],
    views: ['ConfirmWindow'],

    init: function (application) {
        this.control({});
    },

    onDeliver: function (event, record) {

        var store = MyApp.getApplication()
            .getStore('ShippingItemDataStore');

        var createDeliveryNotesStore = store
            .filterAndCollectToNewStore(store, function(item){
            if (item.data.customerNumber == record.data.customerNumber)
                return true;
            return false;
        });
        this.createDeliveryNotesStore = createDeliveryNotesStore;

        var deliverWindow = Ext.create('MyApp.view.DeliverWindow', {
            id: "DeliverWindow",
            store: createDeliveryNotesStore,
            onSave: function () {
                MyApp
                    .getApplication()
                    .getController('DeliverController')
                    .deliver("ok", kunde, createDeliveryNotesStore);
            }
        });
        kunde = Ext.getStore('KundeDataStore').findRecord("customerNumber",
            record.data.customerNumber);
        kundeId = kunde.data.id;
        email = kunde.data.email;

        deliverWindow.show();
        var tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        deliverWindow.down('form').getForm().setValues({
            name1: kunde.data.name1,
            name2: kunde.data.name2,
            city: kunde.data.city,
            created: tomorrow,
            country: kunde.data.country,
            email: kunde.data.email,
            firstName: kunde.data.firstName,
            id: kunde.data.id,
            lastName: kunde.data.lastName,
            phone: kunde.data.phone,
            postalCode: kunde.data.postalCode,
            customerNumber: kunde.data.customerNumber,
            street: kunde.data.street
        });


        Ext.Ajax.request({
            url: constants.REST_BASE_URL + 'deliveryNotes/generateNumber',
            method: 'GET',
            params: {
                orderConfirmationNumber: record.data.documentNumber
            },
            success: function (response) {
                var generatedNo = Ext.decode(response.responseText).data;
                Ext.getCmp('deliveryNotesNumber').setValue(generatedNo);
                record.data.deliveryNotesNumber = generatedNo;
            }
        });
        // somehow the id is deleted onShow
        Ext.getStore('KundeDataStore').findRecord("email", email).data.id = kundeId;
    },

    deliver: function (event, record, createDeliveryNotesStore) {
        var form = Ext.getCmp('DeliverWindow').down('form');
        if (event == "ok") {

            var values = form.getForm().getValues();
            var request = Ext.Ajax.request({
                url: constants.REST_BASE_URL + 'transitions/deliver',
                // headers: { 'Content-Type': 'application/json' },
                jsonData: {
                    orderConfirmationNumber: values.confirmationNumber,
                    customerId: values.id,
                    name1: values.name1,
                    name2: values.name2,
                    street: values.street,
                    postalCode: values.postalCode,
                    city: values.city,
                    country: values.country,
                    deliveryNotesNumber: values.deliveryNotesNumber,
                    shipment: values.shipment,
                    packageNumber: values.packageNumber,
                    trackNumber: values.trackNumber,
                    created: values.created,
                    showPricesInDeliveryNotes: values.showPricesInDeliveryNotes,
                    ignoreContradictoryExpectedDeliveryDates: values.ignoreContradictoryExpectedDeliveryDates,
                    items: Ext.pluck(createDeliveryNotesStore.data.items,
                        'data')
                },
                success: function (response) {
                    var transition = Ext.JSON.decode(response.responseText).data;
                    MyApp.updateGridsByResponse(transition, 'ShippingItemDataStore', 'DeliveryNotesItemDataStore');
                    Ext.getCmp("DeliverWindow").close();
                },
                failure: function (response) {
                    var responseText = Ext.JSON.decode(response.responseText);
                    if (responseText.message.indexOf('#CAE') != -1) {
                        var controller = MyApp.getApplication().getController('ShippingAddressController');
                        controller.onChangeShippingAddress(controller.getDocumentNumbers());
                    } else {
                        Ext.Object.each(responseText.errors, function (field, errorText) {
                            var field = form.down("[name=" + field + "]");
                            field.markInvalid(errorText);
                            field.addCls('custom-invalid');
                        });
                    }
                }
            });
        }
    },

});