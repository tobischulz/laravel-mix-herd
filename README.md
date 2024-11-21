# laravel-mix-herd
Laravel Mix v6 extension that makes HMR work with [Laravel Herd]([https://herd.laravel.com/]) certificates. Froked from andreiio/laravel-mix-valet to use Herd instead Valet only.

***Note**: This extension assumes you already have your project linked and secured in Herd.*

## Installation

Install the extension:

```sh
npm install laravel-mix-herd --save-dev
```

Next require the extension in your `webpack.mix.js` and call `herd()`:

```js
const mix = require('laravel-mix');
require('laravel-mix-herd');

mix.js('resources/js/app.js', 'public/js')
    .herd();
```

Alternatively, you can pass a config object instead, which will be merged with the defaults below:

```js
const mix = require('laravel-mix');
require('laravel-mix-herd');

mix.js('resources/js/app.js', 'public/js')
    .herd({
        host: 'othersite.test',
        port: 12345,
    });
```

## Options

| Option    | Default                 |
| --------- | ----------------------- |
| **host**  | Hostname from `APP_URL` |
| **port**  | 8080                    |
| **https** | true                    |
