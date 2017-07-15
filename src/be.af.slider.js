(function (root, factory) {
    if (typeof define === 'function' && define.amd) {
        // AMD. Register as an anonymous module.
        define([], factory);
    } else if (typeof exports === 'object') {
        // Node. Does not work with strict CommonJS, but
        // only CommonJS-like environments that support module.exports,
        // like Node.
        module.exports = factory();
    } else {
        // Browser globals (root is window)
        root.beAfSlider = factory();
    }
}(this, function () {
    'use strict';

    var noop = function () {
    };

    var deepExtend = function (out) {
        out = out || {};

        for (var i = 1; i < arguments.length; i++) {
            var obj = arguments[i];

            if (!obj)
                continue;

            for (var key in obj) {
                if (obj.hasOwnProperty(key)) {
                    if (typeof obj[key] === 'object')
                        out[key] = deepExtend(out[key], obj[key]);
                    else
                        out[key] = obj[key];
                }
            }
        }

        return out;
    };


    var addClass = function (el, className) {
        if (el.classList) {
            el.classList.add(className);
        } else {
            el.className += ' ' + className;
        }
    };

    var removeClass = function (el, className) {
        if (el.classList) {
            el.classList.remove(className);
        } else {
            el.className = el.className.replace(new RegExp('(^|\\b)' + className.split(' ').join('|') + '(\\b|$)', 'gi'), ' ');
        }
    };

    var getOffset = function (el) {
        var rect = el.getBoundingClientRect();

        return {
            top: rect.top + document.body.scrollTop,
            left: rect.left + document.body.scrollLeft
        };
    };

    var parseHTML = function (str) {
        var el = document.createElement('div');
        el.innerHTML = str;

        return el.children[0];
    };


    var beAfSlider = function (element, options) {
        this.element = element;

        this.images = {};
        this.options = deepExtend({}, beAfSlider.defaultOptions, options);

        return this.init();
    };


    beAfSlider.defaultOptions = {
        direction: 'horizontal',

        before: null,
        after: null,

        initListeners: true,

        percent: 50,
        minPercent: 0,
        maxPercent: 100,

        callbacks: {
            afterBuild: noop,
            beforePercent: noop,
            beforeResize: noop,
            afterResize: noop
        },

        template: {
            slider: '<div class="be-af-slider-slider"></div>',
            before: '<div class="be-af-slider-before"></div>',
            after: '<div class="be-af-slider-after"></div>'
        }
    };


    var api = {

        VERSION: '2.0.0',

        create: function (element, options) {
            return new beAfSlider(element, options)
        },

        /**
         * preload all images and call the callback
         * @param {beAfSlider} beAfSlider
         * @param {function} callback
         */
        preLoad: function (beAfSlider, callback) {

            var beforeImg = beAfSlider.options['before'],
                afterImg = beAfSlider.options['after'],
                x = 0;

            [beforeImg, afterImg].forEach(function (source, i) {
                var image = new Image();
                image.src = source;

                image.onload = function () {
                    var imgEl = document.createElement('img');
                    imgEl.src = source;
                    x++;
                    beAfSlider.images[i] = imgEl;

                    if (x === 2) {
                        callback.call(beAfSlider);
                    }
                }
            });
        },


        getDragPointerX: function (event) {
            if (event.pageX) {
                return event.pageX;
            }

            return event.touches[0].pageX;
        },

        getDragPointerY: function (event) {
            if (event.pageY) {
                return event.pageY;
            }

            return event.touches[0].pageY;
        },

        onWindowResize: function () {
            this.options.callbacks.beforeResize.call(this.element);

            removeClass(this.after, 'be-af-slider-max-width');

            if (window.innerWidth > this.after.innerWidth) {
                removeClass(this.before, 'be-af-slider-max-width');
                removeClass(this.hidden, 'be-af-slider-max-width');

                // not remove again
                // removeClass(this.after, 'be-af-slider-max-width');
            } else {
                addClass(this.before, 'be-af-slider-max-width');
                addClass(this.after, 'be-af-slider-max-width');
                addClass(this.hidden, 'be-af-slider-max-width');
            }

            this.options.callbacks.afterResize.call(this.element);
        },

        onMoveStart: function () {
            this.options.isMoving = true;
            addClass(this.element, 'active');

            this.addDocumentListeners();
        },

        onMoving: function (e) {
            e.preventDefault();
            e.stopPropagation();

            if (!this.options.isMoving) {
                // TODO: not working :(
                //this.removeDocumentListeners();

                return this;
            }

            var oldVisibility = this.hidden.style.visibility,
                start,
                base,
                current;

            this.hidden.style.visibility = 'hidden';
            removeClass(this.hidden, 'be-af-slider-hidden');

            if (this.options.direction === 'horizontal') {
                start = getOffset(this.element).left;
                base = this.hidden.clientWidth;
                current = api.getDragPointerX(e) - start;
            } else {
                start = getOffset(this.element).top;
                base = this.hidden.clientHeight;
                current = api.getDragPointerY(e) - start;
            }

            this.hidden.style.visibility = oldVisibility;
            addClass(this.hidden, 'be-af-slider-hidden');


            this.setPercent(current * 100 / base);
        },

        onMoveEnd: function (e) {
            e.preventDefault();
            e.stopPropagation();

            this.options.isMoving = false;
            removeClass(this.element, 'active');

            this.removeDocumentListeners();
        },

        setDataOptions: function (beAfSlider) {
            [
                'direction',
                'percent',
                'before',
                'after',
                'minPercent',
                'maxPercent'
            ].forEach(function (data) {
                if (data in beAfSlider.element.dataset) {
                    beAfSlider.options[data] = beAfSlider.element.dataset[data];
                }
            });
        }
    };


    beAfSlider.prototype = {

        init: function () {
            this.options.isMoving = false;

            api.setDataOptions(this);
            api.preLoad(this, this.build);

            return this;
        },

        build: function () {

            addClass(this.element, this.options.direction);

            this.slider = parseHTML(this.options.template.slider);
            this.before = parseHTML(this.options.template.before);
            this.after = parseHTML(this.options.template.after);
            this.hidden = this.images[0].cloneNode(true);

            this.element.appendChild(this.slider);

            this.before.appendChild(this.images[0]);
            this.element.appendChild(this.before);

            this.after.appendChild(this.images[1]);
            this.element.appendChild(this.after);

            addClass(this.hidden, 'be-af-slider-hidden');
            this.element.appendChild(this.hidden);

            if (this.options.initListeners) {
                this.initListeners();
            }

            this.setPercent(this.options.percent);

            this.options.callbacks.afterBuild.call(this);

            return this;
        },

        initListeners: function () {

            api.onWindowResize.call(this);
            window.addEventListener('resize', api.onWindowResize.bind(this));

            this.slider.addEventListener('mousedown', api.onMoveStart.bind(this));
            this.slider.addEventListener('touchstart', api.onMoveStart.bind(this));

            return this;
        },

        addDocumentListeners: function () {
            document.addEventListener('mousemove', api.onMoving.bind(this));
            document.addEventListener('touchmove', api.onMoving.bind(this));
            document.addEventListener('mouseup', api.onMoveEnd.bind(this));
            document.addEventListener('touchend', api.onMoveEnd.bind(this));
        },

        removeDocumentListeners: function () {
            document.removeEventListener('mousemove', api.onMoving);
            document.removeEventListener('touchmove', api.onMoving);
            document.removeEventListener('mouseup', api.onMoveEnd);
            document.removeEventListener('touchend', api.onMoveEnd);
        },

        setPercent: function (percent) {
            var cssProperty,
                cssPropertySlider;

            if (this.options.direction === 'horizontal') {
                cssProperty = 'width';
                cssPropertySlider = 'left';
            } else {
                cssProperty = 'height';
                cssPropertySlider = 'top';
            }

            if (percent < this.options.minPercent) {
                percent = this.options.minPercent;
            }

            if (percent > this.options.maxPercent) {
                percent = this.options.maxPercent;
            }

            this.percent = percent;

            this.options.callbacks.beforePercent.call(this);

            this.before.style[cssProperty] = this.percent + '%';
            this.slider.style[cssPropertySlider] = this.percent + '%';

            return this;
        }
    };


    return api;
}));