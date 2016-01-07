// Global Exception Handling
Ext.Ajax.on('requestexception', function (conn, response, options) {
    if (response.status === 400) {
        Ext.MessageBox.alert(response.status + ' Eingabefehler',
            response.responseText);
    } else if (response.status === 422) {
        var responseText = Ext.JSON.decode(response.responseText);

        var output = '';
        for (var property in responseText.errors) {
            output += property + ': ' + responseText.errors[property] + '; ';
        }
        MyApp.customAlert.msg('Eingabe nicht valide', output);
    } else if (response.status === 404) {
        Ext.MessageBox.alert(options.url + ' nicht erreichbar (' + response.status + ') '
            + response.statusText, options.url);
    } else if (response.status === 500) {
        Ext.MessageBox.alert('Schwerwiegender Fehler',
            response.responseText);
    }
});

Ext.override(Ext.data.JsonWriter, {
    encode: false,
    writeAllFields: true,
    listful: true,
    constructor: function (config) {
        this.callParent(this, config);
        return this;
    },
    render: function (params, baseParams, data) {
        params.jsonData = data;
    }
});

Ext.define('MyApp.controller.MyController', {
    debug: true,
    extend: 'Ext.app.Controller',

    id: 'MyController',
    models: ['BestellungData', 'ItemData', 'KundeData', 'DeliveryMethodData', 'CountryData'],
    stores: ['BestellungDataStore', 'ItemDataStore', 'KundeDataStore',
        'InvoiceItemDataStore', 'ShippingItemDataStore',
        'ArchiveItemDataStore', 'OrderNumberDataStore',
        'AgreementItemDataStore', 'DeliveryNotesItemDataStore',
        'InvoiceNumberDataStore', 'CreateOrderDataStore',
        'CreateDeliveryNotesItemDataStore', 'CreateInvoiceItemDataStore',
        'DeliveryNotesItemDataStore', 'DeliveryMethodDataStore',
        'CreateConfirmationReportItemDataStore', 'CountryDataStore',
        'DeliveryHistoryDataStore', 'CreateAgreementItemDataStore'],
    views: ['MainPanel', 'CreateCustomerWindow', 'CreateOrderItemGridPanel',
        'DeliveryHistoryPanel', 'ConfirmWindow', 'AddressGridPanel',
        'DeliverWindow', 'AgreementWindow', 'OrderNumberComboBox',
        'InvoiceNumberComboBox', 'OrderWindow', 'InvoiceWindow',
        'DeliveryNotesItemGridPanel', 'DeliveryMethodComboBox', 'CountryComboBox'],
    activeBestellnr: 0,
    activeBestellpositionId: 0,
    bestellungDataStore: null,
    activeCustomer: 0,

    init: function (application) {
        this.listen({
            global: {
                aftersuccessfulauthetification: this.initStores
            }
        });
        this.control({
            '#mainCustomerComboBox': {
                blur: this.onCustomerBlur,
                keypress: this.onCustomerKeypress
            },
            '#DeleteBestellungButton': {
                click: this.deleteBestellungDialog
            },
            '#ShowSums': {
                click: this.onShowSums
            },
            '#ShowToBeShipped': {
                click: this.onShowToBeShipped
            },
            'button[action=sendToDropbox]': {
                click: this.onSendToDropbox
            }
        });

    },

    initStores: function () {
        this.getStore('ItemDataStore').filter('status', 'ordered');
        this.getStore('AgreementItemDataStore').filter('status', 'confirmed');
        this.getStore('ShippingItemDataStore').filter('status', 'agreed');
        this.getStore('DeliveryNotesItemDataStore').filter('status', 'shipped');
        this.getStore('InvoiceItemDataStore').filter('status', 'invoiced');

        this.getStore('CountryDataStore').load();
    },

    retrieveChosenCustomerSavely: function () {
        customerNo = Ext.getCmp('mainCustomerComboBox').getValue();
        if (customerNo == 0 || customerNo == "" || customerNo == null) {
            Ext.MessageBox.show({
                title: 'Kundenfeld leer',
                msg: 'Bitte Kunden ausw&auml;hlen',
                icon: Ext.MessageBox.ERROR,
                buttons: Ext.Msg.OK
            });
            return;
        }

        store = MyApp.getApplication().getStore('KundeDataStore');
        cIndex = store.findExact('customerNumber', customerNo);
        customer = store.getAt(cIndex);

        return customer;
    },

    deleteBestellungDialog: function (button, event, options) {
        var bestellung = this.getBestellungSelection();

        if (bestellung.getData().status == 'ORDERED')
            Ext.MessageBox.confirm('Best&aumltigen',
                'Bestellung sicher l&ouml;schen?', this.deleteBestellung);
        else
            Ext.MessageBox
                .alert('Hinweis',
                    'Bestellung schon best&auml;tigt. Nur noch Storno ist m&ouml;glich.');
    },

    onShowToBeShipped: function (view, a, b, column, event, record, f) {
        var string = '/ausstehendeArtikel.pdf';
        var customerNumber = Ext.getCmp('mainCustomerComboBox').getValue();
        if (customerNumber != null) {
            string = 'kunden/' + customerNumber + '/ausstehendeArtikel.pdf';
        }
        var win = window.open(constants.REST_BASE_URL + string, '_blank');
        win.focus();
    },

    sleep: function (milliseconds) {
        var start = new Date().getTime();
        for (var i = 0; i < 1e7; i++) {
            if ((new Date().getTime() - start) > milliseconds) {
                break;
            }
        }
    },

    syncAll: function () {
        var allGrids = Ext.ComponentQuery.query('PositionGrid');
        allGrids.forEach(function (grid) {
            grid.getStore().load();
        });
    },

    onCustomerKeypress: function (customerComboBox, keyEvent) {
        if (keyEvent.keyCode == 13) { // = Enter
            MyApp.getApplication().getController('MyController').changeCustomer(customerComboBox.lastValue);
        }
    },

    onCustomerBlur: function (field) {
        MyApp.getApplication().getController('MyController').changeCustomer(field.lastValue);
    },

    changeCustomer: function (customerNumber) {
        var kundeStore = Ext.data.StoreManager.lookup('KundeDataStore');
        if (kundeStore.findRecord("customerNumber", customerNumber, null, null, false, true) != null) {

            var stores = new Array();
            stores[0] = Ext.data.StoreManager.lookup('ItemDataStore');
            stores[1] = Ext.data.StoreManager.lookup('ShippingItemDataStore');
            stores[2] = Ext.data.StoreManager.lookup('AgreementItemDataStore');
            stores[3] = Ext.data.StoreManager.lookup('DeliveryNotesItemDataStore');
            stores[4] = Ext.data.StoreManager.lookup('InvoiceItemDataStore');

            stores.forEach(function (store) {
                found = false;
                store.filters.items.forEach(function (filter) {
                    if (filter.property == MyApp.constants.FILTER_ON_CUSTOMER) {
                        filter.value = customerNumber;
                        found = true;
                        store.load();
                    }
                });
                if (!found) {
                    store.filter(MyApp.constants.FILTER_ON_CUSTOMER, customerNumber);
                }
            });
        }
    },

    deleteReport: function (documentNumber) {
        var request = Ext.Ajax.request({
            url: constants.REST_BASE_URL + 'transitions/Report/' + documentNumber,
            method: 'DELETE',
            params: {
                documentNumber: documentNumber
            },
            success: function (response) {
                controller = MyApp.getApplication()
                    .getController('MyController');
                controller.sleep(500);
                controller.syncAll();
            },
            failure: function (response, opts) {
                Ext.MessageBox.alert('Status', 'Konnte Dokument nicht l&ouml;schen', response);
            }
        });
    },

    onSendToDropbox: function (button) {
        console.log(button.documentNumber);
        var request = Ext.Ajax.request({
            url: constants.REST_BASE_URL + 'dropbox/sendReport/' + button.documentNumber,
            method: 'POST',
            params: {
                documentNumber: button.documentNumber
            },
            success: function (response) {
                if (response.status == 210) { // redirect
                    var obj = JSON.parse(response.responseText);
                    console.log(obj);

                    var src = obj.data;
                    var win = window.open(src, '_blank');
                    win.focus();
                } else {
                    Ext.MessageBox.alert('Status', 'In der Dropbox angekommen.');
                }
            },
            failure: function (response, opts) {
                Ext.MessageBox.alert('Status', 'Fehler', response);
            }
        });
    },

    onShowSums: function () {
        statesToGrids = [{
            state: 'agreed',
            grid: 'AgreementItemGrid',
            //TODO: 'text' changed. Make the appending of open items dependent from current title
            text: 'Auftr&auml;e'
        }, {
            state: 'confirmed',
            grid: 'ShippingItemGrid',
            text: 'Auftragsbest&auml;tigungen'
        }, {
            state: 'shipped',
            grid: 'DeliveryNotesItemGrid',
            text: 'Lieferscheine'
        }, {
            state: 'invoiced',
            grid: 'InvoiceItemGrid',
            text: 'Rechnungen'
        }]

        statesToGrids.forEach(function (stateToGrid) {
            Ext.Ajax.request({
                url: constants.REST_BASE_URL + 'statistics/openAmount',
                method: 'GET',
                params: {
                    state: stateToGrid.state
                },
                success: function (response) {
                    var text = response.responseText;
                    shippedAmount = Ext.JSON.decode(text).data;
                    Ext.getCmp(stateToGrid.grid)
                        .setTitle(stateToGrid.text
                            + ' - Offener Betrag: '
                            + shippedAmount.value + ' '
                            + shippedAmount.currency);
                }
            });
        });
    },

    onShowPdfClick: function (documentNumber) {
        var src = constants.REST_BASE_URL + 'reports/' + documentNumber + '.pdf';
        var w = new Ext.Window({
            title: documentNumber,
            width: 700,
            height: 987,
            layout: 'fit',
            items: [{
                // solution from: http://stackoverflow.com/questions/19654577/html-embedded-pdf-iframe
                html : '<iframe src="'+src+'" style="float:none;display:inline;height:1200px;" width="100%" height="100%"></iframe>'
                // old solution:
                //html : '<object width="100%" height="100%" data="' + src + '"></object>'
                // html 5 solution:
                //html: '<embed src="' + src + '" width="700" height="987" type="application/pdf" ' +
                //'alt="pdf"' + 'pluginspage="http://www.adobe.com/products/acrobat/readstep2.html">'
            }],
            modal: true,
            dockedItems: [{
                xtype: 'toolbar',
                dock: 'bottom',
                items: [{
                    text: 'in die Dropbox',
                    icon: constants.RESOURCES_BASE_URL + 'images/dropbox.png',
                    action: 'sendToDropbox',
                    documentNumber: documentNumber
                }]
            }]
        });

        w.show();
    },

});

MyApp.customAlert = function () {
    var msgCt;

    function createBox(t, s) {
        return ['<div class="msg">',
            '<div class="x-box-tl"><div class="x-box-tr"><div class="x-box-tc"></div></div></div>',
            '<div class="x-box-ml"><div class="x-box-mr"><div class="x-box-mc"><h3>', t, '</h3>', s, '</div></div></div>',
            '<div class="x-box-bl"><div class="x-box-br"><div class="x-box-bc"></div></div></div>',
            '</div>'].join('');
    }

    return {
        msg: function (title, format) {
            if (!msgCt) {
                msgCt = Ext.DomHelper.insertFirst(document.body, {id: 'msg-div'}, true);
            }
            msgCt.alignTo(document, 't-t');
            var s = Array.prototype.slice.call(arguments, 1);
            var m = Ext.DomHelper.append(msgCt, {html: createBox(title, s)}, true);
            setTimeout(function () {
                m.ghost("t", {remove: true});
            }, 3000);
        },

        init: function () {
            var t = Ext.get('exttheme');
            if (!t) { // run locally?
                return;
            }
            var theme = Cookies.get('exttheme') || 'aero';
            if (theme) {
                t.dom.value = theme;
                Ext.getBody().addClass('x-' + theme);
            }
            t.on('change', function () {
                Cookies.set('exttheme', t.getValue());
                setTimeout(function () {
                    window.location.reload();
                }, 250);
            });

            var lb = Ext.get('lib-bar');
            if (lb) {
                lb.show();
            }
        }
    };
}();
