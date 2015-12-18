Ext.define('MyApp.model.AddressData', {
    extend: 'Ext.data.Model',
    idProperty: 'documentNumber',
    fields: [{
        name: 'documentNumber'
    }, {
        name: 'name1'
    }, {
        name: 'name2'
    }, {
        name: 'postalCode'
    }, {
        name: 'street'
    }, {
        name: 'city'
    }, {
        name: 'country'
    }]
});
