# be.af.slider

## Basic Usage

```js
$('#element').beAfSlider();
```

## Additional Options

```js
$('#element').beAfSlider({
    direction: 'vertical'
});
```

Here's the full list:

| Option        | DOM Attribute         | Default           |  Description                                                                   |
|---------------|------------------------ ------------------|--------------------------------------------------------------------------------|
| direction     | `data-direction`      | horizontal        | Slider goes `horizontal` or `vertical`                                         |
| before        | `data-before`         | null              | URL for the before image                                                       |
| after         | `data-after`          | null              | URL for the after image                                                        |
| startPercent  | `data-percent`        | 50                | The default start position of the slider, from 0 to 100                        |
| minPercent    | `data-min-percent`    | 0                 | minimum of percent                                                             |
| maxPercent    | `data-max-percent`    | 100               | maximum of percent                                                             |
| initListeners |                       | true              | add event listeners to DOM Elements, can set later manuel with initListeners() |

## Callbacks
```js
$('#element').beAfSlider({
    callbacks: {
        // defined callbacks
    }
});
```

Here's the full list:

| Callback      | Description                                                                    |
|---------------|--------------------------------------------------------------------------------|
| afterBuild    | After the Templates was build and initListeners()                              |
| beforePercent | Before the percent will be set                                                 |
| beforeResize  | Before the resize Function will be started                                     |
| afterResize   | After the resize Function was started                                          |


## Templates
```js
$('#element').beAfSlider({
    template: {
        // defined templates
    }
});
```

Here's the full list:

| Template      | Default                                     | Description                                               |
|---------------|---------------------------------------------|-----------------------------------------------------------|
| slider        | `<div class="be-af-slider-slider"></div>`   | The Draggable Slider                                      |
| before        | `<div class="be-af-slider-before"></div>`   | The Before Picture Wrapper                                |
| after         | `<div class="be-af-slider-after"></div>`    | The After Picture Wrapper                                 |


## Advance

### Getting the Plugin Wrapper
```js
var beAfSliderPlugin = $('#element').data('beAfSlider');
```

### Plugin Wrapper Methods

#### Init Listeners manuel
```js
beAfSliderPlugin.initListeners();
```

#### Set Percent
```js
beAfSliderPlugin.setPercent(percent);
```

#### Get Option
```js
beAfSliderPlugin.getOption(name);
```


