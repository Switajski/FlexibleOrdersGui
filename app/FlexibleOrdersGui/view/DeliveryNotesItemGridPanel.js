Ext.define('MyApp.view.DeliveryNotesItemGridPanel', {
    extend: 'MyApp.view.PositionGridPanel',
    alias: 'widget.DeliveryNotesItemGrid',
    title: "Artikel zum verrechnen",
    id: 'DeliveryNotesItemGrid',
    onActionClick: function (view, a, b, column, event, record, f) {
        MyApp.getApplication().getController('InvoiceController').invoice("ok",
            record);
    }
});