Ext.define('MyApp.controller.InvoiceController', {
    debug: true,
    extend: 'Ext.app.Controller',

    id: 'InvoiceController',
    models: ['ItemData'],
    stores: ['CreateInvoiceItemDataStore'],
    views: ['InvoiceWindow'],

    init: function (application) {
        this.control({});
    },

    invoice: function (event, record) {
        var deliveryNotesNumber = record.data.deliveryNotesNumber.replace(/L/g, "R");
        var customerNumber = record.data.customerNumber;
        
        var storeForTrans = MyApp.fillStore('DeliveryNotesItemDataStore', 'CreateInvoiceItemDataStore', customerNumber);

        var invoiceWindow = Ext.create('MyApp.view.InvoiceWindow', {
            id: "InvoiceWindow",
            onSave: function () {
                MyApp.getApplication().getController('InvoiceController')
                    .invoice2("ok", kunde, storeForTrans);
            }
        });

        kunde = Ext.getStore('KundeDataStore').findRecord("customerNumber",
            customerNumber);
        kundeId = kunde.data.customerNumber;
        email = kunde.data.email;

        invoiceWindow.show();
        invoiceWindow.down('form').getForm().setValues({
            name1: kunde.data.name1,
            name2: kunde.data.name2,
            city: kunde.data.city,
            country: kunde.data.country,
            email: kunde.data.email,
            firstName: kunde.data.firstName,
            id: kunde.data.id,
            lastName: kunde.data.lastName,
            phone: kunde.data.phone,
            postalCode: kunde.data.postalCode,
            customerNumber: kunde.data.customerNumber,
            street: kunde.data.street,
            paymentConditions: kunde.data.paymentConditions,
            created: record.data.created
        });
        // somehow the id is deleted onShow
        Ext.getCmp('invoiceNumber').setValue(deliveryNotesNumber);
        Ext.getStore('KundeDataStore').findRecord("email", email).data.id = kundeId;
    },

    invoice2: function (event, record, createInvoiceStore) {
        createInvoiceStore = MyApp.getApplication().getStore('CreateInvoiceItemDataStore');
        var form = Ext.getCmp('InvoiceWindow').down('form').getForm();
        if (event == "ok") {
            var request = Ext.Ajax.request({
                url: constants.REST_BASE_URL + 'transitions/invoice',
                jsonData: {
                    customerId: form.getValues().id,
                    billing: form.getValues().billing,
                    created: form.getValues().created,
                    name1: form.getValues().name1,
                    name2: form.getValues().name2,
                    street: form.getValues().street,
                    postalCode: form.getValues().postalCode,
                    city: form.getValues().city,
                    country: form.getValues().country,
                    invoiceNumber: form.getValues().invoiceNumber,
                    paymentConditions: form.getValues().paymentConditions,
                    discountRate: form.getValues().discountRate,
                    discountText: form.getValues().discountText,
                    items: Ext.pluck(createInvoiceStore.data.items,
                        'data')
                },
                success: function (response) {
                    var transition = Ext.JSON.decode(response.responseText).data;
                    MyApp.updateGridsByResponse(transition, 'DeliveryNotesItemDataStore', 'InvoiceItemDataStore');
                    Ext.getCmp("InvoiceWindow").close();
                },
                failure: function (response) {
                    var responseText = Ext.JSON.decode(response.responseText);
                    if (responseText.message.indexOf('#CAE') != -1) {
                        var controller = MyApp.getApplication().getController('InvoicingAddressController');
                        controller.onChangeShippingAddress(controller.getDocumentNumbers());
                    } else {
                        Ext.Object.each(responseText.errors, function (field, errorText) {
                            var field = form.findField(field);
                            field.markInvalid(errorText);
                            field.addCls('custom-invalid');
                        });
                    }
                }

            });
        }
    }


});