(function( $ ){
    var s;
    // Methods
    var m = {
        init: function(e){},
        start: function(e){},
        traverse: function(files,area){
            if (typeof files !== "undefined") {
                for (var i=0, l=files.length; i<l; i++) {
                    m.handle(files[i], area, i);
                }
            } else {
                area.html(s.nosupport);
            }
        },
        handle: function(file, area, index) {
            $.each(s.handler, function() {
                var type = file.type ? file.type : 'application/octet-stream';
                if (type.match(new RegExp(this[0].replace(/\*/g, '.*?').replace(/\+/, '\\+')))) {
                    this[1].call(area, file, index);
                    return false;
                }
            });

        }
    };
    $.fn.mimedrop = function(o) {
        // Settings
        s = {
            'init': m.init,
            'start': m.start,
            'instructions': 'drop a file here',
            'over'        : 'drop file here!',
            'nosupport'   : 'No support for the File API in this web browser',
            'noimage'     : 'Unsupported file type!',
            'maxsize'     : '500' //Kb
        };
        this.each(function(){
            if(o) $.extend(s, o);
            var instructions = $('<div>').appendTo($(this));
            s.init($(this));            
            if(!$(this).data('value'))
                instructions.addClass('instructions').html(s.instructions);

            $(this)
            .bind({
                dragleave: function (e) {
                    e.preventDefault();
                    if($(this).data('value'))
                        instructions.removeClass().empty();
                    else
                        instructions.removeClass('over').html(s.instructions);
                },
                dragenter: function (e) {
                    e.preventDefault();
                    instructions.addClass('instructions over').html(s.over);
                },
                dragover: function (e) {
                    e.preventDefault();
                }
            });
            this.addEventListener("drop", function (e) {
                e.preventDefault();
                s.start($(this));
                console.log(e.dataTransfer.files);
                m.traverse(e.dataTransfer.files, $(this));
                instructions.removeClass().empty();
            },false);
        });
    };
})( jQuery );