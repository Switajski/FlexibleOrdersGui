var filters = {
    ftype: 'filters',
    // encode and local configuration options defined previously for easier
    // reuse
    encode: true, // json encode the filter query
    local: false, // defaults to false (remote filtering)

    // Filters are most naturally placed in the column definition, but can also
    // be
    // added here.
    filters: [{
        type: 'string',
        dataIndex: 'visible'
    }]
};

Ext.define('MyApp.view.CreateOrderItemGridPanel', {
    extend: 'Ext.grid.Panel',
    alias: 'widget.CreateOrderItemGrid',
    width: 200,
    // height: 300,
    requires: ['MyApp.model.ArtikelData',
        'MyApp.store.CreateOrderDataStore',
        'Ext.grid.plugin.CellEditing',
        'Ext.ux.grid.FiltersFeature',
        'Ext.form.field.Text', 'Ext.toolbar.TextItem'],
    initComponent: function () {
        var me = this;
        this.editing = Ext.create('Ext.grid.plugin.CellEditing');

        Ext.applyIf(me, {
            plugins: [this.editing],
            tbar: ['Bestellposition',
                {
                    itemid: 'add',
                    dock: 'top',
                    icon: constants.RESOURCES_BASE_URL + 'images/add.png',
                    text: 'hinzuf&uuml;gen',
                    scope: this,
                    handler: this.onAddClick
                }, {
                    itemid: 'delete',
                    icon: constants.RESOURCES_BASE_URL + 'images/delete.png',
                    text: 'l&ouml;schen',
                    scope: this,
                    handler: this.onDeleteClick
                }],
            dockedItems: [{
                xtype: 'toolbar',
                dock: 'bottom',
                text: 'sync',
                scope: this
            }],
            selModel: {
                columns: [
                    {xtype : 'checkcolumn', text : 'Active', dataIndex : 'id'}
                ],
                listeners:{
                    selectionchange: me.onOrderSumChange
                }
            },
            columns: [{
                xtype: 'gridcolumn',
                dataIndex: 'product',
                text: 'Artikel',
                width: 250,
                renderer: function (value, metaData, record, row, col, store,
                                    gridView) {
                    return (value + ' - ' + record.data.productName);
                },
                editor: {
                    id: 'ArtikelComboBox',
                    xtype: 'combobox',
                    displayField: 'name',
                    valueField: 'productNumber',
                    enableRegEx: true,
                    allowBlank: false,
                    forceSelection: true,
                    loadingText: 'Sende Anfrage an Magento...',
                    queryMode: 'remote',
                    store: 'ArtikelDataStore',
                    tpl: Ext
                        .create(
                            'Ext.XTemplate',
                            '<tpl for="."><div class="x-boundlist-item" >{productNumber} - {name}</div></tpl>'),
                    displayTpl: Ext.create('Ext.XTemplate', '<tpl for=".">',
                        '{productNumber} - {name}', '</tpl>'),
                    listeners: {
                        'blur': function (xObject, state, eOpts) {
                            rowPos = Ext.getCmp('CreateOrderGrid')
                                .getSelectionModel().getCurrentPosition().row;
                            data = Ext.getStore('ArtikelDataStore').query(
                                'productNumber', xObject.value).getAt(0).data;

                            createOrderStore = Ext.data.StoreMgr
                                .lookup('CreateOrderDataStore');
                            record = createOrderStore.getAt(rowPos);
                            if (data.recommendedPriceNet != null)
                                record.set('priceNet', data.recommendedPriceNet.value);
                            record.set('productName', data.name);
                            me.onOrderSumChange();
                        }
                    }
                }
            }, {
                xtype: 'gridcolumn',
                dataIndex: 'productName',
                flex: 1,
                text: 'Artikelname',
                filter: {
                    type: 'string'
                    // , disabled: true
                },
                editor: {
                    xtype: 'textfield',
                    allowBlank: false
                }
            }, {
                xtype: 'gridcolumn',
                dataIndex: 'additionalInfo',
                flex: 1,
                text: 'zus&auml;tzliche Info',
                filter: {
                    type: 'string'
                },
                editor: {
                    xtype: 'textfield',
                    allowBlank: true
                }
            }, {
                xtype: 'gridcolumn',
                dataIndex: 'quantityLeft',
                width: 75,
                text: 'Menge',
                value: 1,
                minValue: 1,
                editor: {
                    xtype: 'numberfield',
                    allowBlank: false,
                    minValue: 1,
                    listeners : {
                        blur: me.onOrderSumChange
                    }
                }
            }, {
                xtype: 'numbercolumn',
                dataIndex: 'priceNet',
                width: 100,
                text: 'Preis Netto',
                renderer: Ext.util.Format.euMoney,
                editor: {
                    xtype: 'numberfield',
                    allowBlank: false,
                    listeners : {
                        blur: me.onOrderSumChange
                    }
                }
            }]
        });
        me.callParent(arguments);

    },

    onAddClick: function () {
        var bestellnr = this.getOrderNumber();
        customer = Ext.getCmp('mainCustomerComboBox').getValue();
        if (bestellnr == null || bestellnr == 0 || bestellnr == "") {
            Ext.MessageBox.show({
                title: 'Bestellnummer leer',
                msg: 'Bitte eine Bestellnummer eingeben',
                icon: Ext.MessageBox.ERROR,
                buttons: Ext.Msg.OK
            });
        } else if (customer == null || customer == 0 || customer == "") {
            Ext.MessageBox.show({
                title: 'Keinen Kunden ausgewaehlt',
                msg: 'Bitte einen Kunden auswaehlen',
                icon: Ext.MessageBox.ERROR,
                buttons: Ext.Msg.OK
            });
        } else {
            var rec = new MyApp.model.ItemData({
                status: 'ORDERED'
            }), edit = this.editing;
            rec.data.customer = customer;
            rec.data.quantityLeft = 1;
            var lastIndex = this.store.data.items.length;
            this.store.insert(lastIndex, rec);
            this.selModel.select(this.store.data.items[lastIndex]);
        }
    },
    onDeleteClick: function () {
        var selection = this.getView().getSelectionModel().getSelection()[0];
        if (selection) {
            this.store.remove(selection);
        }
    },
    getOrderNumber: function () {
        return Ext.ComponentQuery.query('combobox[xtype=ordernumbercombobox]')[0].rawValue;
    },
    onOrderSumChange: function () {
        var sum = 0;
        var items = Ext.getCmp('CreateOrderGrid').getStore().data.items;
        for (var i in items) {
            var data = items[i].data;
            sum = sum + data.priceNet * data.quantityLeft;
        }
        var sumField = Ext.getCmp('sumOfPositionGrid');
        sumField.setText(sum);
        return data;
    }

});