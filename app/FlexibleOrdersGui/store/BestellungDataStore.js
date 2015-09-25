Ext.define('MyApp.store.BestellungDataStore', {
    extend: 'Ext.data.Store',
    requires: ['MyApp.model.BestellungData'],
    constructor: function (cfg) {
        var me = this;
        var url = constants.REST_BASE_URL + 'reports/json';
        cfg = cfg || {};
        me.callParent([Ext.apply({
            model: 'MyApp.model.BestellungData',
            storeId: 'BestellungDataStore',
            pageSize: 20,
            proxy: {
                type: 'ajax',
                headers: {
                    Accept: 'application/json'
                },
                actionMethods: {
                    read: 'GET',
                    update: 'PUT',
                    destroy: 'DELETE',
                    create: 'POST'
                },
                api: {
                    read: url,
                    update: url,
                    destroy: url,
                    create: url
                },
                reader: {
                    type: 'json',
                    successProperty: 'success',
                    root: 'data',
                    messageProperty: 'message'
                },
                autoSync: true,
                writer: {
                    type: 'json',
                    root: 'data',
                    writeAllFields: false
                }
                /*
                 * , afterRequest:function(request,success){ if(request.action =
                 * 'create'){ console.log('create abfangen'); console.log(request); } },
                 */
            },
            listeners: {
                exception: function (proxy, response, operation) {
                    console.rerror(response);
                    Ext.MessageBox.show({
                        title: 'Server Fehler',
                        msg: operation.getError(),
                        icon: Ext.MessageBox.ERROR,
                        buttons: Ext.Msg.OK
                    });
                }
            }
        }, cfg)]);
    }
});