Ext.define('MyApp.controller.SecurityController', {
    extend: 'Ext.app.Controller',
    loginUrl: constants.REST_BASE_URL + 'resources/j_spring_security_check',
    logoutUrl: constants.REST_BASE_URL + 'resources/j_spring_security_logout',
    id: 'SecurityController',
    loginWindow: null,
    views: ['LoginForm'],
    init: function () {
        // check if already logged in
        this.control({
            '#loginButton': {
                click: this.login
            },
            'textfield': {
                specialkey: function (field, e) {
                    if (e.getKey() == e.ENTER) {
                        this.login();
                    }
                }
            }
        });
        this.startAuthentication();

    },

    afterrender: function () {
        this.showLogin();
    },

    onKeypress: function () {
        if (keyEvent.keyCode == 13) { // = Enter
            this.login();
        }
    },

    startAuthentication: function () {
        var me = this;
        Ext.Ajax.cors = true;
        Ext.Ajax.withCredentials = true;

        Ext.Ajax.request({
            method:'GET',
            url: constants.REST_BASE_URL + 'country',
            headers: {
                'Access-Control-Allow-Origin': "*",
                'Content-Type': 'application/json',
                'Access-Control-Allow-Methods' : 'GET,PUT,POST'
            },
            useDefaultXhrHeader: false,
            cors : true,
            success: function (response, options) {
                // The GUI does not need to authenticat - it is already autheticated
                me.onSuccessfulAuthentification();
            },
            failure: function (response, options) {
                // Not authenticated - show login form
                if (response.status === 403) {
                    me.showLogin();
                } else if (response.status === 404) {
                    Ext.Msg.alert("Unerwarteter Fehler - URL nicht gefunden: " + response.status);
                } else {
                    Ext.Msg.alert("Anmeldung fehlgeschlagen:<br/>"
                        + JSON.stringify(response));
                }
            }
        });
    },

    showLogin: function () {
        Ext.getCmp('MainPanel').disable();
        this.loginWindow = Ext.create('MyApp.view.LoginForm', {
            id: "LoginForm",
            onSave: this.logIn
        });
        this.loginWindow.show();
        this.loginWindow.focus();
        Ext.getCmp('UsernameTextfield').focus();
    },

    login: function () {
        var me = this;

        form = Ext.getCmp('LoginForm').down('form').getForm();
        // if (form.isValid()) {
        if (true) {
            form.submit({
                url: me.loginUrl,
                success: function (response, options) {
                    me.onSuccessfulAuthentification();
                    Ext.getCmp('MainPanel').enable();
                    me.loginWindow.close();
                },
                failure: function (response, options) {
                    Ext.Msg.alert("Fehler beim login: </br>" + response);
                }
            });
        }
    },

    onSuccessfulAuthentification: function () {
        Ext.globalEvents.fireEvent('aftersuccessfulauthetification');
    }
});