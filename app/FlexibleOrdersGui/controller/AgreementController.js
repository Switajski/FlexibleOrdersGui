Ext.define('MyApp.controller.AgreementController', {
    debug: true,
    extend: 'Ext.app.Controller',

    id: 'AgreementController',
    models: ['ItemData'],
    stores: ['CreateAgreementItemDataStore'],
    views: ['AgreementWindow'],

    init: function (application) {
        this.control({});
    },

    onAgree: function (event, record) {
        var documentNumber = record.data.documentNumber;
        var agreementNumber = documentNumber.replace(/AB/g, "AU");

        record.data.agreementNumber = documentNumber;

        var itemsToBeAgreedStore = MyApp.fillStore(
			'ItemDataStore',
			'CreateAgreementItemDataStore',
			record.data.customerNumber);
        
        var agreementWindow = Ext.create('MyApp.view.AgreementWindow', {
            id: "AgreementWindow",
            onSave: function () {
                MyApp
                    .getApplication()
                    .getController('AgreementController')
                    .agree("ok", kunde, itemsToBeAgreedStore);
            }
        });
        kunde = Ext.getStore('KundeDataStore').findRecord("customerNumber",
            record.data.customerNumber);
        kundeId = kunde.data.id;
        email = kunde.data.email;

        agreementWindow.show();
        agreementWindow.down('form').getForm().setValues({
            customerNumber: kunde.data.customerNumber,
            lastName: kunde.data.lastName,
            expectedDelivery: record.data.expectedDelivery,
            orderConfirmationNumber: documentNumber,
            orderAgreementNumber: agreementNumber
        });
        agreementWindow.down('form').getForm().baseParams = {orderConfirmationNumber: documentNumber};
    },

    agree: function (event, record, createAgreementStore) {
        var form = Ext.getCmp('AgreementWindow').down('form').getForm();
        if (event == "ok") {

            var request = Ext.Ajax.request({
                url: constants.REST_BASE_URL + 'transitions/agree',
                params: {
                    orderAgreementNumber: form.getValues().orderAgreementNumber,
                    orderConfirmationNumber: form.baseParams.orderConfirmationNumber
                },
                success: function (response) {
                    var documentNumber = Ext.decode(response.responseText).data.documentNumber;
                    var store = MyApp.getApplication().getStore('ShippingItemDataStore');
                    var items = store.data.items;
                    for (var i = 0; i < items.length; i++) {
                        if (items[i].data.documentNumber == documentNumber) {
                            items[i].data.agreed = true;
                        }
                    }

                    Ext.getCmp("AgreementWindow").close();
                }
            });
        }
    }


});