Ext.define('MyApp.view.DeliverWindow', {
    extend: 'MyApp.view.TransitionWindow',
    title: 'Auftrag liefern',
    itemid: 'DeliverWindow',
    alias: 'widget.DeliverWindow',
    layout: 'fit',
    defaultInvoiceNumber: 0,
    width: 800,
    record: null,
    closeAction: 'destroy',
    bottomGrid: {
        xtype: 'PositionGrid',
        dock: 'bottom',
        id: 'CreateDeliveryNotesItemGrid',
        flex: 1,
        store: 'CreateDeliveryNotesItemDataStore',
        title: "Lieferscheinpositionen",
        selType: 'cellmodel',
        plugins: [Ext.create('Ext.grid.plugin.CellEditing', {
            clicksToEdit: 1
        })],
        features: [{
            ftype: 'grouping',
            groupHeaderTpl: '{columnName}: {name} ({rows.length} Position{[values.rows.length > 1 ? "en" : ""]}) {[values.rows[0].created]}',
            hideGroupedHeader: false,
            startCollapsed: false
        }],
        columns: [
            {
                xtype: 'gridcolumn',
                dataIndex: 'product',
                text: 'Artikel',
                displayField: 'name',
                valueField: 'productNumber',
                width: 70
            },
            {
                xtype: 'gridcolumn',
                dataIndex: 'productName',
                flex: 1,
                text: 'Artikel Name'
            },
            {
                xtype: 'gridcolumn',
                dataIndex: 'expectedDelivery',
                width: 80,
                text: 'Liefertermin'
            },
            {
                xtype: 'gridcolumn',
                dataIndex: 'packageNumber',
                id: 'packageNumberColumn',
                width: 50,
                text: 'Paketnr.',
                editor: {
                    xtype: 'textfield',
                }
            },
            {
                xtype: 'gridcolumn',
                dataIndex: 'trackNumber',
                width: 130,
                text: 'Sendungsnr.',
                editor: {
                    xtype: 'textfield',
                }
            },
            {
                xtype: 'checkcolumn',
                id: 'pendingColumn',
                dataIndex: 'pending',
                width: 50,
                disabled: true,
                text: 'Ausst.'
            },
            {
                xtype: 'gridcolumn',
                dataIndex: 'quantity',
                width: 40,
                text: 'Ur.M.',
                align: 'right'
            },
            {
                xtype: 'gridcolumn',
                dataIndex: 'quantityLeft',
                width: 50,
                text: 'Menge',
                editor: {
                    xtype: 'numberfield',
                    allowBlank: false,
                    minValue: 1
                },
                align: 'right'
            },
            {
                xtype: 'actioncolumn',
                width: 30,
                sortable: false,
                menuDisabled: true,
                items: [{
                    icon: constants.RESOURCES_BASE_URL + 'images/split.png',
                    tooltip: 'Position teilen',
                    scope: this,
                    handler: function (grid, rowIndex) {
                        var store = Ext.getStore('CreateDeliveryNotesItemDataStore');

                        var srcRecord = store.getAt(rowIndex);
                        var copiedRec = srcRecord.copy(); // clone the record
                        //generate id
                        Ext.data.Model.id(copiedRec);

                        var quantityLeft = srcRecord.get('quantityLeft');
                        var div = Math.floor(quantityLeft / 2);
                        var rem = quantityLeft % 2;
                        srcRecord.set('quantityLeft', div);
                        copiedRec.set('quantityLeft', div + rem);
                        copiedRec.set('quantity', null);
                        store.insert(rowIndex + 1, copiedRec);
                    }
                }]
            },
            {
                xtype: 'actioncolumn',
                width: 30,
                sortable: false,
                menuDisabled: true,
                items: [{
                    icon: constants.RESOURCES_BASE_URL + 'images/pdf_button.png',
                    tooltip: 'Dokument ansehen',
                    scope: this,
                    handler: function (view, a, b, column, event, record) {
                        MyApp.getApplication().getController('MyController')
                            .onShowPdfClick(record.data.documentNumber);
                    }
                }]
            },
            {
                xtype: 'actioncolumn',
                width: 30,
                sortable: false,
                menuDisabled: true,
                items: [{
                    icon: constants.RESOURCES_BASE_URL + 'images/update.png',
                    tooltip: 'Dokument ansehen',
                    scope: this,
                    handler: function (view, a, b, column, event, record) {
                        var controller = MyApp.getApplication().getController('ShippingAddressController');
                        controller.onChangeShippingAddress(controller.getDocumentNumbers());
                    }
                }]
            }, {
                xtype: 'actioncolumn',
                width: 30,
                sortable: false,
                menuDisabled: true,
                items: [{
                    icon: constants.RESOURCES_BASE_URL + 'images/delete.png',
                    tooltip: 'Position l&ouml;schen',
                    scope: this,
                    handler: function (grid, rowIndex) {
                        Ext
                            .getStore(
                                'CreateDeliveryNotesItemDataStore')
                            .removeAt(rowIndex);
                    }
                }]
            }]
    },

    headerForm: {
        xtype: 'fieldset',
        title: 'Lieferschein',
        flex: 1,
        items: [
            {
                xtype: 'fieldcontainer',
                layout: 'hbox',
                defaults: {},
                items: [{
                    xtype: 'displayfield',
                    anchor: '100%',
                    name: 'customerNumber',
                    fieldLabel: 'Kundennummer'
                }, {
                    xtype: 'displayfield',
                    anchor: '100%',
                    name: 'firstName',
                    margins: '0 0 0 10',
                    fieldLabel: 'Name',
                    labelWidth: 35
                }, {
                    xtype: 'displayfield',
                    anchor: '100%',
                    name: 'lastName',
                    margins: '0 0 0 6',
                    hideLabel: 'true'
                }]
            },
            {
                xtype: 'fieldcontainer',
                layout: 'hbox',
                defaults: {
                    flex: 1
                },
                items: [
                    {
                        xtype: 'datefield',
                        format: 'd/m/Y',
                        allowBlank: true,
                        fieldLabel: 'Lieferscheindatum',
                        name: 'created'
                    },
                    {
                        xtype: 'checkbox',
                        fieldLabel: 'ignoriere abweich. Liefertermine',
                        labelWidth: 185,
                        margins: '0 0 0 6',
                        checked: false,
                        name: 'ignoreContradictoryExpectedDeliveryDates',
                        inputValue: true
                    }]
            }, {
                xtype: 'fieldcontainer',
                layout: 'hbox',
                defaults: {
                    flex: 1
                },
                items: [{
                    xtype: 'textfield',
                    fieldLabel: 'Lieferscheinnr.',
                    name: 'deliveryNotesNumber',
                    id: 'deliveryNotesNumber',
                    allowBlank: false
                }, {
                    xtype: 'numberfield',
                    fieldLabel: 'Versandkosten',
                    name: 'shipment',
                    disable: true,
                    allowBlank: true,
                    allowDecimals: true,
                    margins: '0 0 0 6',
                    minValue: 0

                }]
            }, {
                xtype: 'fieldcontainer',
                layout: 'hbox',
                defaults: {
                    flex: 1
                },
                items: [{
                    xtype: 'textfield',
                    fieldLabel: 'Paketnr.',
                    name: 'packageNumber',
                    id: 'packageNumber',
                    disabled: true,
                    allowBlank: true
                }, {
                    xtype: 'textfield',
                    fieldLabel: 'Sendungsnr.',
                    name: 'trackNumber',
                    disabled: true,
                    id: 'trackNumberField',
                    margins: '0 0 0 6',
                    allowBlank: true
                }]
            }, {
                xtype: 'checkbox',
                fieldLabel: 'Preise auf Lieferschein anzeigen',
                name: 'showPricesInDeliveryNotes',
                labelWidth: 185,
                margins: '0 0 0 6',
                checked: false,
                inputValue: 'true'
            }, {
                xtype: 'checkbox',
                fieldLabel: 'Einzelnen Lieferschein erstellen',
                name: 'singleDeliveryNotes',
                id: 'singleDeliveryNotesCheckBox',
                labelWidth: 185,
                margins: '0 0 0 6',
                checked: false,
                inputValue: 'true',
                //TODO: tried to move that to deliverController init control like myController - didn't work
                listeners: {
                    click: {
                        element: 'el',
                        fn: function (id) {
                            var singleDeliveryNotesCheckbox = Ext.getCmp('singleDeliveryNotesCheckBox');
                            var pendingColumn = Ext.getCmp('pendingColumn');
                            var packageNumber = Ext.getCmp('packageNumber');
                            var trackNumber = Ext.getCmp('trackNumberField');
                            if (singleDeliveryNotesCheckbox.value) {
                                pendingColumn.enable();
                                packageNumber.enable();
                                trackNumber.enable();
                            }
                            else {
                                pendingColumn.disable();
                                packageNumber.disable();
                                trackNumber.disable();
                            }
                        }
                    }
                }
            }]
    },

    initComponent: function () {
        var me = this;
        this.editing = Ext
            .create('Ext.grid.plugin.CellEditing');
        Ext.applyIf(me, {
            layout: 'anchor',
            items: [{
                xtype: 'form',
                id: 'DeliverForm',
                bodyPadding: 10,
                items: [this.headerForm],

                dockedItems: [{
                    xtype: 'toolbar',
                    dock: 'bottom',
                    ui: 'footer',
                    items: ['->', {
                        iconCls: 'icon-save',
                        itemId: 'save',
                        text: 'Speichern',
                        disabled: false,
                        scope: this,
                        handler: this.onSave
                    }]
                }, this.bottomGrid]
            }]
        });

        me.callParent(arguments);

    },
    /**
     * this method is to override by the using Component
     * (usually Panel)
     */
    updateRecord: function () {
        console.log('Override me!');
    },

    /**
     * this method listens to the save button and is usually
     * overridden by a panel. see {@Link MyController.deliver}
     */
    onSave: function () {
        var active = this.activeRecord, form = this.getForm();

        if (!active) {
            return;
        }
        if (form.isValid()) {
            form.updateRecord(active);
            this.onReset();
        }
    },

    onComboboxChange: function () {
        if (record != null) {
            var combobox = Ext.ComponentQuery.query('invoicenumbercombobox')[0];
            this.record.data.invoiceNumber = combobox.getValue();
        }
    }

});