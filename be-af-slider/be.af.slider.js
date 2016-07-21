(function ($, document, window) {
    'use strict';

    $.beAfSlider = function () {

        var VERSION = '1.0.2';

        this.defaultOptions = {
            direction: 'horizontal',

            before: null,
            after: null,

            initListeners: true,

            startPercent: 50,
            minPercent: 0,
            maxPercent: 100,

            callbacks: {
                afterBuild: $.noop,
                beforePercent: $.noop,
                beforeResize: $.noop,
                afterResize: $.noop
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
                var beforeImg = beAfSlider.getOption('before'),
                    afterImg = beAfSlider.getOption('after');

                var x = 0;
                $.each([beforeImg, afterImg], function (i, source) {
                    var image = new Image();
                    image.src = source;
                    image.onload = function () {
                        x++;
                        beAfSlider.images[i] = $('<img>').attr('src', source);

                        if (x == 2) {
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
            },

            onWindowResize: function () {
                this.getOption('callbacks')['beforeResize'].bind(this)();

                if (window.innerWidth > this._after.removeClass('be-af-slider-max-width').width()) {
                    this._before.removeClass('be-af-slider-max-width');
                    this._after.removeClass('be-af-slider-max-width');
                    this._hidden.removeClass('be-af-slider-max-width');
                } else {
                    this._before.addClass('be-af-slider-max-width');
                    this._after.addClass('be-af-slider-max-width');
                    this._hidden.addClass('be-af-slider-max-width');
                }

                this.getOption('callbacks')['afterResize'].bind(this)();
            },

            onMoveStart: function () {
                this.setOption('isMoving', true);
                this.getElement().addClass('active');
            },

            onMoving: function (e) {
                if (!this.getOption('isMoving')) {
                    return this;
                }

                e.preventDefault();
                e.stopPropagation();

                var start,
                    base,
                    current;

                if (this.getOption('direction') == 'horizontal') {
                    start = this.getElement().offset().left;
                    base = this._hidden.width();
                    current = beAfSliderIntern().getDragPointerX(e) - start;
                } else {
                    start = this.getElement().offset().top;
                    base = this._hidden.height();
                    current = beAfSliderIntern().getDragPointerY(e) - start;
                }

                this.setPercent(current * 100 / base);
            },

            onMoveEnd: function () {
                this.setOption('isMoving', false);
                this.getElement().removeClass('active');
            },

            setDataOptions: function () {
                var element = this.getElement(),
                    dataOption = {
                        'direction': 'direction',
                        'percent': 'startPercent',
                        'before': 'before',
                        'after': 'after',
                        'min-percent': 'minPercent',
                        'max-percent': 'maxPercent'
                    };

                $.each(dataOption, function (data, option) {
                    if (element.data(data)) {
                        this.setOption(option, element.data(data));
                    }
                }.bind(this));
            }
        }
    };

    beAfSlider.prototype = {

        init: function () {
            this.setOption('isMoving', false);

            beAfSliderIntern().setDataOptions.bind(this)();

            beAfSliderIntern().preLoad(this, this.build.bind(this));

            return this;
        },

        build: function () {
            var hiddenImage = this.images[0].clone();


            this.getElement().addClass(this.getOption('direction'));

            this._slider = $(this.getOption('template')['slider']);
            this.getElement().append(this._slider);

            this._before = $(this.getOption('template')['before']);
            this._before.append(this.images[0]);
            this.getElement().append(this._before);

            this._after = $(this.getOption('template')['after']);
            this._after.append(this.images[1]);
            this.getElement().append(this._after);

            this._hidden = hiddenImage.addClass('be-af-slider-hidden');
            this.getElement().append(this._hidden);

            if (this.getOption('initListeners')) {
                this.initListeners();
            }

            this.setPercent(this.getOption('startPercent'));

            this.getOption('callbacks')['afterBuild']();

            return this;
        },

        initListeners: function () {

            beAfSliderIntern().onWindowResize.bind(this)();
            $(window).on('resize', beAfSliderIntern().onWindowResize.bind(this));

            this._slider.on('mousedown touchstart', beAfSliderIntern().onMoveStart.bind(this));

            $(document)
                .on('mousemove touchmove', beAfSliderIntern().onMoving.bind(this))
                .on('mouseup touchend', beAfSliderIntern().onMoveEnd.bind(this));

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
            
            if (percent < this.getOption('minPercent')) {
                percent = this.getOption('minPercent');
            }

            if (percent > this.getOption('maxPercent')) {
                percent = this.getOption('maxPercent');
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

})(jQuery, document, window);