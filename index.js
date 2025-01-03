const path = require('path');
const fs = require('fs');
const mix = require('laravel-mix');

class LaravelMixHerd {
    constructor() {
        this.config = {
            host: this.getAppHost(),
            port: 8080,
            https: true,
        };
    }

    name() {
        return 'herd';
    }

    register(config = {}) {
        if (!this.isHot()) {
            return;
        }

        if (typeof config === 'string') {
            config = { host: config };
        }

        this.config = {
            ...this.config,
            ...config,
        };

        mix.options({
            hmrOptions: {
                https: this.config.https,
                host: this.config.host,
                port: this.config.port,
            },
        });
    }

    boot() {
        if (!this.isHot()) {
            return;
        }
    }

    webpackConfig(config) {
        if (!this.isHot()) {
            return;
        }

        config.devServer.hot = true;

        config.output.publicPath = this.hotUrl();

        if (this.config.https) {
            config.devServer.https = {
                key: this.loadCert('key'),
                cert: this.loadCert('crt'),
            };
        }
    }

    loadCert(ext) {
        let dir;

        if (process.platform === 'linux') {
            dir = '.valet';
        } 
        
        if (['darwin', 'win32'].includes(process.platform)) {
            dir = './Library/Application Support/Herd/config/valet';
        }

        if (!dir) {
            throw new Error(`Unsupported platform: ${process.platform}`);
        }

        const cert = path.resolve(
            process.env.HOME,
            `${dir}/Certificates/${this.config.host}.${ext}`
        );

        if (!fs.existsSync(cert)) {
            throw new Error(`Could not find ${cert}`);
        }

        return fs.readFileSync(cert);
    }

    hotUrl() {
        return (
            (this.config.https ? 'https' : 'http') +
            `://${this.config.host}:${this.config.port}/`
        );
    }

    isHot() {
        return process.argv.includes('--hot');
    }

    getAppHost() {
        try {
            return new URL(process.env.APP_URL).hostname;
        } catch (error) {
            return null;
        }
    }
}

mix.extend('herd', new LaravelMixHerd());
