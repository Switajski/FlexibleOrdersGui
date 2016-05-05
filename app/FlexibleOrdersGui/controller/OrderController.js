Ext.define('MyApp.controller.OrderController', {
	debug : true,
	extend : 'Ext.app.Controller',

	id : 'OrderController',
	models : [ 'ItemData' ],
	stores : [ 'CreateOrderDataStore' ],
	views : [ 'OrderWindow' ],

	init : function(application) {
		this.control({
			'#ErstelleBestellungButton' : {
				click : this.onOrder
			}
		});
	},

	order : function(button, event, option) {
		var form = Ext.getCmp('OrderWindow').down('form').getForm();
		var record = form.getRecord();

		var items = Ext.pluck(
				Ext.getCmp('CreateOrderGrid').getStore().data.items,
				'data');
		items.forEach(function(entry) {
			entry.quantity = entry.quantityLeft;
		});

		Ext.Ajax.request({
			url : constants.REST_BASE_URL + 'transitions/order',
			jsonData : {
				orderNumber : form.getValues().order,
				created : form.getValues().created,
				invoiceNumber : form.getValues().invoiceNumber,
				packageNumber : form.getValues().packageNumber,
				trackNumber : form.getValues().trackNumber,
				customerNumber : record.data.customerNumber,
				name1 : record.data.name1,
				name2 : record.data.name2,
				street : record.data.street,
				postalCode : record.data.postalCode,
				city : record.data.city,
				country : record.data.country,
				items : items
			},
			success : function(response) {
				// Sync
				var transition = Ext.JSON.decode(response.responseText).data;
                var created = transition.CREATED;

                var store = MyApp.getApplication().getStore('ItemDataStore');
                for (var i = 0; i < created.length; i++) {
                    store.add(created[i]);
                }

                Ext.getCmp('CreateOrderGrid').getStore().removeAll();
				Ext.getCmp('OrderWindow').close();
			}
		});
	},

	onOrder : function(button, event, option) {
		// check customer is chosen
		var customer = MyApp.getApplication().getController('MyController')
				.retrieveChosenCustomerSavely();
		if (customer == null)
			return;

		var orderWindow = Ext.create('MyApp.view.OrderWindow', {
			id : "OrderWindow",
			record : customer,
			onShow : function() {
				this.down('form').getForm().loadRecord(customer);
			}
		});
		orderWindow.show();
		orderWindow.focus();

		Ext.Ajax.request({
			url : constants.REST_BASE_URL + 'order/generateNumber',
			success : function(response) {
				Ext.getCmp('OrderWindow').down('ordernumbercombobox').setValue(
						Ext.decode(response.responseText).data);
			}
		});
	},

	deleteOrder : function(orderNumber) {
		var request = Ext.Ajax.request({
			url : constants.REST_BASE_URL + 'transitions/deleteOrder',
			params : {
				orderNumber : orderNumber
			},
			success : function(response) {
				controller = MyApp.getApplication().getController(
						'MyController');
				controller.sleep(500);
				controller.syncAll();
			}
		});
	},
    
    onEdit : function(orderNumber, customerNumber){
		customerStore = MyApp.getApplication().getStore('KundeDataStore');
		customer = customerStore.getAt(customerStore.find('customerNumber', customerNumber));

        var sourceStore = MyApp.getApplication().getStore('ItemDataStore');
        var sourceItems = sourceStore.data.items;
        var storeForTrans = MyApp.getApplication().getStore('CreateOrderDataStore');

        storeForTrans.removeAll();
        for (var i = 0; i < sourceItems.length; i++) {
            if (sourceItems[i].data.documentNumber == orderNumber) {
                storeForTrans.add(sourceItems[i]);
            }
        }

		var orderWindow = Ext.create('MyApp.view.OrderWindow', {
			id : "OrderWindow",
            modal:true,
			record : customer,
            title : 'Bestellung ' + orderNumber + ' &auml;ndern',
            onSave : function edit(button,event, option){
                MyApp.getApplication().getController('OrderController')
                    .edit(button,event, option);
            },
			onShow : function() {
                var oNoBox = this.down('ordernumbercombobox');
                oNoBox.setValue(orderNumber);
                oNoBox.disable();

				this.down('datefield').setValue(sourceItems[0].data.created);
                var form = this.down('form').getForm();
                form.loadRecord(customer);
                form.getValues().orderNumber = orderNumber;
			}
		});
		orderWindow.show();
		orderWindow.focus();
    },

    edit : function(a,b,c){
        Ext.Msg.alert("Noch nicht implementiert!");
    }

});
