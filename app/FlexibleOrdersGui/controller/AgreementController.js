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
        agreementNumber = documentNumber.replace(/AB/g, "AU");

        record.data.agreementNumber = documentNumber;

        // create store with items from already loaded store
        var createAgreementStore = MyApp.getApplication().getStore('ShippingItemDataStore');
        var itemsToBeAgreedStore = createAgreementStore.filterAndCollectToNewStore(createAgreementStore, function filter(item) {
            if (item.data.documentNumber == documentNumber)
                return true;
            return false;
        });

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
        var documentNumber = record.data.documentNumber;
        var form = Ext.getCmp('AgreementWindow').down('form').getForm();
        if (event == "ok") {

            var request = Ext.Ajax.request({
                url: constants.REST_BASE_URL + 'transitions/agree',
                params: {
                    orderAgreementNumber: form.getValues().orderAgreementNumber,
                    orderConfirmationNumber: form.baseParams.orderConfirmationNumber
                },
                success: function (response) {
                    var text = response.responseText;
                    
                    var store = MyApp.getApplication().getStore('ShippingItemDataStore');
                    var itemsToBeAgreed = store.findBy(function (item) {
                        if (item.data.documentNumber == documentNumber)
                            return true;
                        return false; 
                    });
                    for (var i = 0; i < itemsToBeAgreed.length; i++) {
                        var item = store.getById(itemsToBeAgreed[i].data.id);
                        item.agreed = true;
                    }

                    Ext.getCmp("AgreementWindow").close();
                }
            });
        }
    }


});