
'use strict';

(function() {

    // превращает переданную строку POST параметров в обьект
    function stringToObj (string) {
        var arr = string.split('&'),
            params = {};

        for (var i = 0; i < arr.length; i++) {
            var param = arr[i].split('='),

                key = decodeURIComponent(param[0]),
                val = param[1] === undefined ? '' : decodeURIComponent(param[1]);

            params[key] = val;
        }

        return params;
    }

    function getUtmCookies (utm_id) {
       var cookies_arr = document.cookie.split('; '),
           cookies_obj = {},
           temp;

        for(var i = 0; i < cookies_arr.length; i++){
            temp = cookies_arr[i].split('=');
            cookies_obj[temp[0]] = temp[1];
        }

        return cookies_obj[utm_id];
    }


    // Получение списка utm меток из url и cookies
    window.location.getUtmLabels = function(utm_id) {

        var url_string = this,
            utm_list = {};


        url_string.replace(

            /[?&]+([^=&]+)=?([^&]*)?/gi,

            function( match, key, value ) {
                var is_utm = (key.indexOf('utm_') != -1);

                if (is_utm) {
                    utm_list[key] = value !== undefined ? value : '';
                }
            }

        );

        if ( utm_id ) {
            return utm_list[utm_id] ? utm_list[utm_id] : null;
        }

        return utm_list;
    };


    // Получение значения utm метки по ее названию
    window.location.getUtmValueByID = function(utm_id) {
        var utm_value = '';

        var params_string = this.search.substring(1);

        var params = stringToObj(params_string);

        // получаем значение utm метки из url
        if (utm_id.length) {
            utm_value = params[utm_id] || '';

            if (!utm_value.length) {

                // пытаемся получить значение utm метки из cookies
                utm_value = getUtmCookies(utm_id);
            }
        }

        // - получить список всех get параметров
        // - выделить из них те, что относятся к utm меткам
        // - выбрать из списка меток значение необходимой
        // - если необходимой метки не оказалось в url параметрах, искать ее в cookies


        return utm_value;
    };


    // Сохранение значения utm метки по ее названию
    // *сохранение происходит благодаря cookies
    window.location.saveUtmToCookies = function(utm_id, utm_value) {
        var saved = false,
            value = utm_value || '';

        if (typeof utm_id == 'string' && utm_id.length) {
            document.cookie = utm_id + '=' + value;
            saved = true;
        }

        return saved;
    };
})();