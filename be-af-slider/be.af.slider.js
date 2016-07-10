(function ($, document) {
    'use strict';

    $.beAfSlider = function () {

        var VERSION = '1.0.0';

        this.defaultOptions = {
            direction: 'horizontal',

            before: null,
            after: null,

            initListeners: true,
            startPercent: 50,

            callbacks: {
                afterBuild: $.noop,
                beforePercent: $.noop
            },

            template: {
                slider: '<div class="be-af-slider-slider"></div>',
                before: '<div class="be-af-slider-before"></div>',
                after: '<div class="be-af-slider-after"></div>'
            }
        };

        return this;
    };

    var beAfSlider = function (element, options) {
        this.el = element;
        this._el = $(element);

        this.images = {};
        this.options = $.extend(true, {}, $.beAfSlider().defaultOptions, options);

        return this.init();
    };

    var beAfSliderIntern = function () {
        return {
            /**
             * preload all images and call the callback
             * @param {beAfSlider} beAfSlider
             * @param {function} callback
             */
            preLoad: function (beAfSlider, callback) {
                var beforeImg = beAfSlider.getElement().data('before') || beAfSlider.getOption('before'),
                    afterImg = beAfSlider.getElement().data('after') || beAfSlider.getOption('after');

                $.each([beforeImg, afterImg], function (i, source) {
                    var image = new Image();
                    image.src = source;
                    image.onload = function () {
                        beAfSlider.images[i] = $('<img>').attr('src', source);

                        console.log(beAfSlider.images);
                        if (i == 1) {
                            callback();
                        }
                    }
                });
            },

            getDragPointerX: function (event) {
                if (event.pageX) {
                    return event.pageX;
                }

                return event.originalEvent.touches[0].pageX;
            },

            getDragPointerY: function (event) {
                if (event.pageY) {
                    return event.pageY;
                }

                return event.originalEvent.touches[0].pageY;
            }
        }
    };

    beAfSlider.prototype = {

        init: function () {
            var self = this;

            this.setOption('isMoving', false);

            beAfSliderIntern().preLoad(this, function () {
                self.build();
            });

            return this;
        },

        build: function () {
            this.getElement().addClass(this.getOption('direction'));

            this._slider = $(this.getOption('template')['slider']);
            this.getElement().append(this._slider);

            this._before = $(this.getOption('template')['before']);
            this._before.append(this.images[0]);
            this.getElement().append(this._before);

            this._after = $(this.getOption('template')['after']);
            this._after.append(this.images[1]);
            this.getElement().append(this._after);

            this._hidden = this.images[0].clone().addClass('be-af-slider-hidden');
            this.getElement().append(this._hidden);

            if (this.getOption('initListeners')) {
                this.initListeners();
            }

            this.setPercent(this.getOption('startPercent'));

            this.getOption('callbacks')['afterBuild']();

            return this;
        },

        initListeners: function () {
            var self = this;

            this._slider.on('mousedown touchstart', function () {
                self.setOption('isMoving', true);
                self.getElement().addClass('active');
            });

            $(document)
                .on('mousemove touchmove', function (e) {
                    if (!self.getOption('isMoving')) {
                        return this;
                    }

                    e.preventDefault();
                    e.stopPropagation();

                    var base,
                        current;

                    if (self.getOption('direction') == 'horizontal') {
                        base = self.getElement().offset().left + self._hidden.width();
                        current = beAfSliderIntern().getDragPointerX(e);
                    } else {
                        base = self.getElement().offset().top + self._hidden.height();
                        current = beAfSliderIntern().getDragPointerY(e);
                    }
                    
                    self.setPercent(current * 100 / base);

                })
                .on('mouseup touchend', function () {
                    self.setOption('isMoving', false);
                    self.getElement().removeClass('active');
                });

            return this;
        },

        setPercent: function (percent) {
            var cssProperty,
                cssPropertySlider;

            if (this.getOption('direction') == 'horizontal') {
                cssProperty = 'width';
                cssPropertySlider = 'left';
            } else {
                cssProperty = 'height';
                cssPropertySlider = 'top';
            }

            if (percent < 0) {
                percent = 0;
            }

            if (percent > 100) {
                percent = 100;
            }

            this.percent = percent;

            this.getOption('callbacks')['beforePercent']();

            this._before.css(cssProperty, this.percent + '%');
            this._slider.css(cssPropertySlider, this.percent + '%');

            return this;
        },

        getElement: function () {
            return this._el;
        },

        getOption: function (name) {
            return this.options[name];
        },

        setOption: function (name, value) {
            this.options[name] = value;

            return this;
        }
    };

    $.fn.beAfSlider = function (options) {
        return this.each(function () {
            if (!$.data(this, 'beAfSlider')) {
                $.data(this, 'beAfSlider', new beAfSlider(this, options));
            }
        });
    };

    return this;

})(jQuery, document);