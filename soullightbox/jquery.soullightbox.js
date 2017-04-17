/*!
 * SoulLightbox Jquery Plugin v1.0.0
 *
 * Copyright 2016, Christopher Díaz Pantoja http://christopher.mx
 * Released under the MIT license
 * http://jquery.org/license
 *
 * Date: 2016-11-23T15:27Z
 */

;(function($){
    $.fn.soullightbox = function(options){
         //Var definition
         var soullightbox = this;
         var pluginname = "soullightbox";
         var screen_width = $(window).width();
         var media_available = new Array('picture','video','html');
         var body_class = '';

         //Main settings
         var settings = $.extend({
            canvas_width: 60,//percentage
            mobile_max_width: 580,//pixels
            mobile_canvas_width: 90,//percentage
            media: 'picture',
            video_ratio: (315/560)
         }, options);

        if($(this).length > 0){
            createLightbox();
            $(this).click(showLightbox);
        }

        function createLightbox(){
            if($('#' + pluginname).length == 0){
                $('body').prepend('<div id="'+ pluginname +'"></div>');
                $('#' + pluginname).append('<div id="soullightbox-wrapper"></div>');
                $('#' + pluginname).append('<a href="" id="soullightbox-close-btn"><span>cerrar</span></a>');
                $('#soullightbox-close-btn').click(function(e){
                    e.preventDefault();
                    $('#' + pluginname).hide();
                    $('body').removeClass('soullightbox');
                    $('#soullightbox-wrapper').html('');
                    if(body_class !== ''){
                        $('html').removeClass(body_class);
                        $('body').removeClass(body_class);
                    }
                });
            }
        }

        function showLightbox(e){
            e.preventDefault();

            var media = $(this).attr('data-media');

            if(media === undefined || media_available.indexOf(media) == -1){
                media = settings.media;
            }

            //Cleans wrapper and resets events
            $('#soullightbox-wrapper').html('');
            $(window).unbind('resize', fixVideoSize);

            switch(media) {
                case 'video':
                    var video_id = $(this).attr('data-video-id');
                    if(video_id){
                        loadVideoPlayer(video_id);
                        $('#' + pluginname).show();
                    }
                    break;
                case 'picture':
                    var picture_url = $(this).attr('href');
                    if(picture_url !== ''){
                        loadPicture(picture_url);
                        $('#' + pluginname).show();
                    }
                case 'html':
                    var element_id = $(this).attr('data-element-id');
                    if(element_id){
                        loadHTML(element_id);
                        $('#' + pluginname).show();
                        $('html,body').prop({scrollTop: 0});
                    }
                    break;
                default: ;
            }

            $('body').addClass('soullightbox');

        }

        function loadVideoPlayer(video_id){
            $('#soullightbox-wrapper').append('<iframe id="soullightbox-video" src="https://www.youtube.com/embed/' + video_id + '?rel=0&amp;showinfo=0&amp;autoplay=1" frameborder="0" allowfullscreen></iframe>');
            fixVideoSize();
            $(window).on('resize', fixVideoSize);
        }

        function fixVideoSize(){
            var window_width = $(window).width();
            var aspect_ratio =  settings.video_ratio;
            var width_per = settings.canvas_width;

            if(window_width < settings.mobile_max_width){
                width_per = settings.mobile_canvas_width;
            }

            var element_width = window_width * (width_per/100);
            var element_height = aspect_ratio * element_width;

            $('#soullightbox-video, #soullightbox-wrapper').width(element_width);
            $('#soullightbox-video, #soullightbox-wrapper').height(element_height);
        }

        function loadPicture(picture_url){

            var picture_tmp_id = 'cpi-loading-picture-tmp';
            var picture = new Image();
            picture.src = picture_url;

            $('#soullightbox-wrapper').append('<span id="'+picture_tmp_id+'" style="color: #fff; display: block; width: 200px;">cargando imagen...</span>');
            $('#soullightbox-wrapper').width($('#' + picture_tmp_id).width());
            $('#soullightbox-wrapper').height($('#' + picture_tmp_id).height());

            $(picture).one('load',function(){
                var picture_width = (picture.width > ($(window).width() - 80))?($(window).width() * .7):picture.width;
                $('#soullightbox-wrapper').html('');
                $('#soullightbox-wrapper').append('<img id="'+picture_tmp_id+'" src="' + picture_url + '" width="'+picture_width+'" alt="picture">');
                $('#soullightbox-wrapper').width($('#' + picture_tmp_id).width());
                $('#soullightbox-wrapper').height($('#' + picture_tmp_id).height());
            });
        }

        function loadHTML(element_id){
            $('#' + element_id).clone(true).appendTo('#soullightbox-wrapper');
            var element_obj = $('#soullightbox-wrapper').children('.' + element_id)
            element_obj.show();

            //Changes ID's element's name
            element_obj.attr('id', element_id + '-cloned');

            //Adjusts the size of wrapper
            $('#soullightbox-wrapper').width($('#' + element_id).width());
            $('#soullightbox-wrapper').height($('#' + element_id).height());

            //Changes ID's name for every form
            $.each(element_obj.find('form'), function(){
                if($(this).prop('id')){
                    $(this).prop('id', $(this).prop('id') + '-cloned');
                }
            });

            body_class = 'body-soullightbox-' + element_id;
            $('html').addClass(body_class);
            $('body').addClass(body_class);

            if(element_obj.find('.g-recaptcha').length > 0){
                $.getScript( "https://www.google.com/recaptcha/api.js");
            }
        }

    };
}(jQuery));
