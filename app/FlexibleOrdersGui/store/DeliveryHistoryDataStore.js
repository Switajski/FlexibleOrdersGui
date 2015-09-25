Ext.define('MyApp.store.DeliveryHistoryDataStore', {
    extend: "Ext.data.TreeStore",
    autoLoad: false,
    proxy: {
        header : {
            'Access-Control-Allow-Origin:': '*'
        },
        type: 'ajax',
        url: constants.REST_BASE_URL + 'deliveryHistory/byReportItemId/0',
        reader: {
            type: 'json',
            root: 'data'
        }
    },
    root: {
        //expanded: true,
        text: "My Root"
    }
});