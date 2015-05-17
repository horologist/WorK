var InstallApp = {
    init: function (_params) {

        if(this.hasBeenClosed()) return;

        var self = this, device = this.getClientDevice(), app = {}, params = {
            ios: {
                link: '',
                text: '',
                button_text: '',
                system: false,
                app_id: 0,
                on_tablet: true
            },
            android: {
                link: '',
                text: '',
                button_text: '',
                on_tablet: true
            }
        };

        this._extend(params, _params);

        if(!device.mobile)
            return;

        switch(device.os) {
            case 'ios':
                if(params['ios'].link == '' && params['ios'].system == false)
                    return;
                break;

            case 'android':
                if(params['android'].link == '')
                    return;
                break;
        }

        if(!params[device.os].on_tablet && device.is_tablet)
            return;

        app = params[device.os];

        if(device.os == 'ios' && app.system) {
            var meta = document.createElement('meta');

            meta.name = "apple-itunes-app";
            meta.content = "app-id=" + params.ios.app_id;
            document.getElementsByTagName('head')[0].appendChild(meta);

            return;
        }

        var el = this.getTemplate(params.styles);

        //el.querySelector('.iapp-text').innerHTML = app['text'];
        //el.querySelector('.iapp-button').innerHTML = app['button_text'];

        this.current_link = app.link;

        document.body.appendChild(el);
    },
    hasBeenClosed: function() {
        return this.cookies.get('installapp_closed');
    },
    getTemplate: function(styles) {
        container_styles = {
            'position': 'fixed',
            'left': 0,
            'top': '10px',
            'right': 0,
            'width': '100%',
            'min-height': '80px',
            'z-index': 1000,
//            'font-family':' tahoma, arial, verdana, sans-serif, Lucida Sans',
//            'font-size': '2em',
            'color': '#000',
            'background': 'linear-gradient(to top, #cdcdcd, #f4f4f4)',
            'border-top': '1px solid #aaaaab',
            'border-bottom': '1px solid #aaaaab'
        }, close_btn_styles = {
            'background-image': 'url(\'data:image/png;base64,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\')',
            'width': '19px',
            'height': '19px',
            'position': 'absolute',
            'margin': '-10px 0 0 10px',
            'cursor': 'pointer'
        }, red_head_styles = {
            'text-align': 'center',
            'margin-top': '5px',
            'font-size': '18px',
            'color': 'red'
        }, icon_styles = {
            'float': 'left',
            'margin': '3px 0 0 10px',
            'border': '1px solid #aaaaab',
            'border-radius': '3px'
        }, text_styles = {
            'float': 'left',
            'margin': '3px 0 0 5px',
            'padding': '0'
        }, btn_open_styles = {
            'margin': '10px 5px 0 0',
            'cursor': 'pointer',
            'background': 'linear-gradient(to top, #dcdcdc, #eeeeee)',
            'width': '75px',
            'height': '28px',
            'border': '1px solid #aaaaab',
            'border-radius': '3px',
            'float': 'right'
        };


        for(var i in styles) {
            switch(i) {
                case 'container':
                    this._extend(container_styles, styles['container']);
                    break;
                case 'close_btn':
                    this._extend(close_btn_styles, styles['close_btn']);
                    break;
                case 'red_head':
                    this._extend(red_head_styles, styles['red_head']);
                    break;
                case 'icon':
                    this._extend(icon_styles, styles['icon']);
                    break;
                case 'text_styles':
                    this._extend(text_styles, styles['text']);
                    break;
                case 'btn_open_styles':
                    this._extend(btn_open_styles, styles['btn_open']);
                    break;
            }
        }

        var template = '<div id="installapp" style="'+this.getStylesString(container_styles)+'"> \
                            <div class="iapp-text" style="'+this.getStylesString(close_btn_styles)+'" onclick="InstallApp.close()"></div> \
                            <div style="'+this.getStylesString(red_head_styles)+'" class="iapp-button" onclick="InstallApp.openApp();">Загрузите наше приложение!</div> \
                            <img src="data:image/png;base64,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" style="'+this.getStylesString(icon_styles)+'"> \
                            <div style="'+this.getStylesString(text_styles)+'"> \
                            РАТ - Своих не бросаем<br> \
                            FREE - On the Google Play \
                            </div> \
                            <div style="'+this.getStylesString(btn_open_styles)+'" onclick="InstallApp.openApp();"> \
                                <div style="margin: 4px 0 0 9px;">открыть</div> \
                            </div> \
                        </div>';

        var el = document.createElement('div');
        el.innerHTML = template;

        return el.firstChild;
    },
    current_link: '',
    openApp: function() {
        window.open(this.current_link);
    },
    close: function() {
        document.body.removeChild(document.getElementById('installapp'));

        this.cookies.set('installapp_closed', true, 1);
    },
    getScrollPos: function(el) {
        var x = 0, y = 0;
        if (el && el !== window) {
            x = el.scrollLeft;
            y = el.scrollTop;
        } else {
            if (typeof window.pageYOffset == 'number') {
                y = window.pageYOffset;
                x = window.pageXOffset;
            } else if (document.body && (document.body.scrollLeft || document.body.scrollTop)) {
                y = document.body.scrollTop;
                x = document.body.scrollLeft;
            } else if (document.documentElement && (document.documentElement.scrollLeft || document.documentElement.scrollTop)) {
                y = document.documentElement.scrollTop;
                x = document.documentElement.scrollLeft;
            }
        }

        return {
            x: x,
            y: y
        };
    },
    getStylesString: function(styles) {
        var string, list = [];

        for(var i in styles) {
            list.push(i + ':' + styles[i]);
        }

        return list.join(';');
    },
    getDocumentSize: function () {
        var w = window.innerWidth || (document.documentElement && document.documentElement.clientWidth) || (document.body && document.body.clientWidth),
            h = window.innerHeight || (document.documentElement && document.documentElement.clientHeight) || (document.body && document.body.clientHeight);
        return {
            w: w,
            h: h
        };
    },
    getClientDevice: function() {
        var mobile = /Mobile|mini|Fennec|Android|iP(ad|od|hone)/.test(navigator.appVersion);
        var osVersion = 0;
        var is_tablet = false;
        var os = false, clientStrings = [
            { s: 'android', r: /Android/},
            { s: 'ios', r: /(iPhone|iPad|iPod)/}
        ];

        for (var id in clientStrings) {
            var cs = clientStrings[id];
            if (cs.r.test(navigator.userAgent)) {
                os = cs.s;
                break;
            }
        }

        switch (os) {
            case 'android':
                osVersion = /Android ([\.\_\d]+)/.exec(navigator.userAgent)[1];
                is_tablet = (/mobile/i.test(navigator.userAgent.toLowerCase()));
                break;

            case 'ios':
                osVersion = /OS (\d+)_(\d+)_?(\d+)?/.exec(navigator.appVersion);
                osVersion = osVersion[1] + '.' + osVersion[2] + '.' + (osVersion[3] | 0);
                is_tablet = (/ipad/i.test(navigator.userAgent.toLowerCase()));
                break;
        }

        return {
            mobile: mobile,
            os: os,
            osVersion: osVersion,
            is_tablet: is_tablet
        };
    },
    _extend: function(dest, source) {
        for(var i in source) {
            dest[i] = source[i];
        }
    },
    cookies: {
        get: function(name) {
            var cookieCrumbs = document.cookie.split(';');
            var nameToFind = name + '=';
            for (var i = 0; i < cookieCrumbs.length; i++) {
                var crumb = cookieCrumbs[i];
                while (crumb.charAt(0) == ' ') {
                    crumb = crumb.substring(1, crumb.length);
                }
                if (crumb.indexOf(nameToFind) == 0) {
                    return crumb.substring(nameToFind.length, crumb.length);
                }
            }
            return null;
        },
        set: function (name, value, days, domain) {
            var expires = '';
            if (days) {
                var date = new Date();
                date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
                expires = '; expires=' + date.toGMTString();
            }
            document.cookie = name + '=' + value + expires + '; path=/' + '; domain=' + window.location.host;
        }
    }
};