var filters = {
    ftype: 'filters',
    // encode and local configuration options defined previously for easier
    // reuse
    encode: true, // json encode the filter query
    local: false, // defaults to false (remote filtering)

    // Filters are most naturally placed in the column definition, but can also
    // be added here.
    filters: [{
        type: 'string',
        dataIndex: 'visible'
    }]
};

var grouping = {
    ftype: 'grouping',
    groupHeaderTpl: 'Dok.nr.: {name} ({rows.length} Position{[values.rows.length > 1 ? "en" : ""]}) {[values.rows[0].created]}',
    hideGroupedHeader: false,
    startCollapsed: true
};

Ext.define('MyApp.view.PositionGridPanel', {
    extend: 'Ext.grid.Panel',
    alias: 'widget.PositionGrid',
    title: "Abstrakte Positionen - (abstract items)",
    customIsFirstPanel: true,
    customicon: constants.RESOURCES_BASE_URL + 'images/arrow-down.png',
    initComponent: function () {
        var me = this;
        this.editing = Ext.create('Ext.grid.plugin.CellEditing');

        Ext.applyIf(me, {
            listeners: {
                itemdblclick: this.onitemdblclick
            },
            viewConfig: {
                stripeRows: false,
                getRowClass: function (record) {
                    if (record.get('agreed') === false)
                        return 'warning-row';
                    if (record.get('shareHistory') === true)
                        return 'emphasized-row'
                    else return 'normal-row';
                }
            },
            features: [grouping],

            columns: [{
                xtype: 'gridcolumn',
                dataIndex: 'product',
                text: 'Artikel',
                width: 75,
                displayField: 'name',
                valueField: 'productNumber'
            }, {
                xtype: 'gridcolumn',
                dataIndex: 'productName',
                flex: 1,
                text: 'Artikel Name'
            }, {
                xtype: 'gridcolumn',
                dataIndex: 'expectedDelivery',
                width: 90,
                text: 'Lieferdatum',
                format: 'd/m/Y'
            }, {
                xtype: 'gridcolumn',
                dataIndex: 'created',
                width: 75,
                text: 'erstellt',
                format: 'd/m/Y'
            }, {
                xtype: 'gridcolumn',
                dataIndex: 'quantity',
                width: 35,
                text: 'Anz.'
            }, {
                xtype: 'numbercolumn',
                dataIndex: 'priceNet',
                width: 45,
                text: 'Preis',
                renderer: Ext.util.Format.euMoney
            }, {
                xtype: 'gridcolumn',
                dataIndex: 'customerNumber',
                width: 35,
                text: 'KNr'
            }, {
                xtype: 'gridcolumn',
                dataIndex: 'customerName',
                width: 120,
                text: 'Name'
            }, {
                xtype: 'actioncolumn',
                width: 30,
                sortable: false,
                items: [{
                    icon: this.customicon,
                    tooltip: 'Position in den naechten Schritt bringen',
                    scope: this,
                    handler: this.onActionClick
                }]
            }, {
                xtype: 'actioncolumn',
                width: 30,
                sortable: false,
                items: [{
                    icon: constants.RESOURCES_BASE_URL + 'images/pdf_button.png',
                    tooltip: 'Pdf anzeigen',
                    scope: this,
                    handler: this.onPdfClick
                }]
            }, {
                xtype: 'actioncolumn',
                width: 30,
                sortable: false,
                items: [{
                    icon: constants.RESOURCES_BASE_URL + 'images/edit.png',
                    tooltip: 'Pdf anzeigen',
                    scope: this,
                    handler: this.onEditClick
                }]
            }, {
                xtype: 'actioncolumn',
                width: 30,
                sortable: false,
                menuDisabled: true,
                items: [{
                    icon: constants.RESOURCES_BASE_URL + 'images/delete.png',
                    tooltip: 'Dokument l&ouml;schen',
                    scope: this,
                    handler: this.onRemoveClick
                }]
            }

            ],
            dockedItems: [{
                xtype: 'pagingtoolbar',
                dock: 'bottom',
                width: 360,
                displayInfo: true,
                store: this.store
            }]
        });
        me.callParent(arguments);

    },

    onPdfClick: function (view, a, b, column, event, record, f) {
        MyApp.getApplication().getController('MyController').onShowPdfClick(record.data.documentNumber);
    },

    onSync: function () {
        this.store.sync();
    },

    onActionClick: function () {
        console.error('not overidden');
    },
    onitemdblclick: function (grid, record) {
        this.onDeliveryHistoryClick(null, null, null, null, null, record);
    },
    onRemoveClick: function (view, a, b, column, event, record, f) {
        var documentNumber = record.data.documentNumber;
        Ext.MessageBox.confirm('Best&auml;tigung', 'Wollen Sie das Dokument '
            + documentNumber + ' l&ouml;schen?',
            function(btn){
                if (btn == 'yes')
                MyApp.getApplication().getController('MyController')
                    .deleteReport(documentNumber);
            });
    },
    onDeliveryHistoryClick: function (view, a, b, column, event, record, f) {
        // TODO: this is hacking
        var dhPanel = Ext.create('MyApp.view.DeliveryHistoryPanel', {});
        store = dhPanel.items.items[0].getStore();
        store.getProxy().url = constants.REST_BASE_URL + 'deliveryHistory/byReportItemId/'
            + record.data.id;
        store.reload();
        dhPanel.show();
    }

});