Ext.define('MyApp.view.ChangeShippingAddressWindow', {
    extend: 'Ext.window.Window',
    title: 'Lieferadresse &auml;ndern',
    alias: 'widget.changeShippingAddressWindow',
    id:'ChangeShippingAddressWindow',
    modal:true,
    layout: 'fit',
    record: null,
    closeAction: 'destroy',
    initComponent: function () {
        var me = this;
        Ext.applyIf(me, {
            layout: 'anchor',
            items: [{
                xtype: 'form',
                bodyPadding: 10,
                items: [{
                    xtype: 'addressFieldset',
                    title: 'Neue Lieferadresse'
                }],
                dockedItems: [{
                    xtype: 'toolbar',
                    dock: 'bottom',
                    ui: 'footer',
                    items: ['->',{
                        iconCls: constants.RESOURCES_BASE_URL + 'images/update.png',
                        itemId: 'save',
                        text: 'Speichern',
                        disabled: false,
                        scope: this,
                        action: 'changeShippingAddress'
                    }]
                }, {
                    xtype: 'addressGrid',
                    title: 'Zu &Auml;ndernde Adressen',
                    dock: 'bottom',
                    store: me.store
                }]
            }]
        });
        me.callParent(arguments);
    },

});