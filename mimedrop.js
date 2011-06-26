(function($) {
    var s;
    // Methods
    var methods = {
        init: function(o) {
            s = {
                'nosupport'   : 'No support for the File API in this web browser',
                'maxsize'     : '500000' //Kb
            };
            return this.each(function() {
                if (o) $.extend(s, o);

                $(this)
                        .bind({
                            dragleave: function (e) {
                                e.preventDefault();
                                $(this).removeClass('over');
                            },
                            dragenter: function (e) {
                                e.preventDefault();
                                $(this).addClass('over');
                            },
                            dragover: function (e) {
                                e.preventDefault();
                            }
                        });
                this.addEventListener("drop", function (e) {
                    e.preventDefault();
                    $(this).removeClass('over');

                    if (typeof e.dataTransfer.files !== "undefined") {
                        for (var i = 0, l = e.dataTransfer.files.length; i < l; i++) {
                            methods.handle.call(this, e.dataTransfer.files[i], i);
                        }
                    } else {
                        $(this).html(s.nosupport);
                    }
                }, false);
            });
        },
        handle: function(file, index, mimetype) {
            var nextType = undefined;
            var $this = this;

            var type = (mimetype ? mimetype : file.type),
                    type = type ? type : 'application/octet-stream';

            $.each(s.handler, function() {
                if (type.match(new RegExp(this[0].replace(/\*/g, '.*?').replace(/\+/, '\\+')))) {
                    this[1].call($this, file, index);
                    return false;
                }
            });

            return $(this);
        }
    };

    $.fn.mimedrop = function(method) {
        if (methods[method]) {
            return methods[method].apply(this, Array.prototype.slice.call(arguments, 1));
        } else if (typeof method === 'object' || ! method) {
            return methods.init.apply(this, arguments);
        } else {
            $.error('Method ' + method + ' does not exist on jQuery.mimedrop');
        }
    };
})(jQuery);