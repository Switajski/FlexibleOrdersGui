Ext.define('MyApp.view.OrderItemGridPanel', {
    extend: 'MyApp.view.PositionGridPanel',
    alias: 'widget.OrderItemGrid',
    title: "Bestellungen",
    onActionClick: function (view, a, b, column, event, record, f) {
        var ocnr = record.data.orderNumber;
        MyApp.getApplication().getController('ConfirmController').onConfirm(
            record);

    },
    onPdfClick: function (view, a, b, column, event, record, f) {
        var win = window.open(constants.REST_BASE_URL + 'reports/'
            + record.data.orderNumber + '.pdf', '_blank');
        win.focus();
    },
    onDeliveryHistoryClick: function (view, a, b, column, event, record, f) {
        Ext.MessageBox.alert('Lieferhisorie leer',
            'Die Lieferhistorie dieser Bestellung ist leer');
    },
    onRemoveClick: function (view, a, b, column, event, record, f) {
        MyApp.getApplication().getController('OrderController').deleteOrder(
            record.data.orderNumber);
    }

});