Ext.define('MyApp.view.ChangeAddressWindow', {
    extend: 'Ext.window.Window',
    title: 'Adresse &auml;ndern',
    alias: 'widget.changeAddressWindow',
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
                    title: 'Neue Adresse'
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
                        action: 'changeAddress'
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