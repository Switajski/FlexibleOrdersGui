Ext.define('MyApp.view.AddressGridPanel', {
    extend: 'Ext.grid.Panel',
    alias: 'widget.addressGrid',
    title: "Adressen",
    modal: true,
    initComponent: function () {
        var me = this;
        this.editing = Ext.create('Ext.grid.plugin.CellEditing');

        Ext.applyIf(me, {
            columns: [{
                xtype: 'gridcolumn',
                text: 'AB Nummer',
                width: 75,
                dataIndex: 'documentNumber'
            },{
                xtype: 'gridcolumn',
                text: 'Name',
                flex: 2,
                dataIndex: 'name1'
            }, {
                xtype: 'gridcolumn',
                text: 'Name 2',
                flex: 2,
                dataIndex: 'name2'
            }, {
                xtype: 'gridcolumn',
                text: 'Strasse',
                flex: 2,
                dataIndex: 'street'
            }, {
                xtype: 'gridcolumn',
                text: 'PLZ',
                flex: 1,
                dataIndex: 'postalCode'
            }, {
                xtype: 'gridcolumn',
                text: 'Stadt',
                flex: 2,
                dataIndex: 'city'
            }, {
                xtype: 'gridcolumn',
                text: 'Land',
                flex: 0.5,
                dataIndex: 'country'
            }],
            viewConfig: {
                stripeRows: false
            }
        });
        me.callParent(arguments);
    }
});
