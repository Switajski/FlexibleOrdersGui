Ext.define('MyApp.view.DeliveryNotesItemGridPanel', {
    extend: 'MyApp.view.PositionGridPanel',
    alias: 'widget.DeliveryNotesItemGrid',
    title: "Lieferscheine",
    id: 'DeliveryNotesItemGrid',
    customicon: constants.RESOURCES_BASE_URL + 'images/new_ab.png',
    onActionClick: function (view, a, b, column, event, record, f) {
        MyApp.getApplication().getController('InvoiceController').invoice("ok",
            record);
    }
});