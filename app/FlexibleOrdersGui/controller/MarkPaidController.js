Ext.define('MyApp.controller.MarkPaidController', {
	debug : true,
	extend : 'Ext.app.Controller',

	id : 'MarkPaidController',
	models : [ 'ItemData' ],

	init : function(application) {
		this.control({});
	},

	markPaid : function(event, anr, record) {
		var docNo = record.data.documentNumber;
		var source = MyApp.getApplication().getStore('InvoiceItemDataStore');
        var markPaidStore = source.filterAndCollectToNewStore(
			function(item){
				if (item.data.documentNumber == docNo)
					return true;
				return false;
			}, source

		);

		if (event == "ok") {
			Ext.Ajax.request({
				url : constants.REST_BASE_URL + 'transitions/markPaid',
				jsonData : {
					invoiceNumber : record.data.invoiceNumber,
					items: Ext.pluck(markPaidStore.data.items, 'data')
				},
				success : function(response) {
					var completed = Ext.JSON.decode(response.responseText).data.COMPLETED;
					var from = MyApp.getApplication().getStore('InvoiceItemDataStore');
					for (var i = 0; i < completed.length; i++) {
						from.remove(from.getById(completed[i].id));
					}
				}
			});

		}
	}

});