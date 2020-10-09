import { v4 as uuid } from "uuid";
import { IMG_SERVICE_URI, IMG_SERVICE_PORT } from "./../constants";

function getNonce(_: any, res: any) {
    return `'nonce-${res.locals.nonce}'`;
}

export function generateNonce(_: any, res: any, next: any) {
    const rhyphen = /-/g;
    res.locals.nonce = uuid().replace(rhyphen, ``);
    next();
}

export function getDirectives() {
    const self = `'self'`;
    const unsafeInline = `'unsafe-inline'`;
    const scripts = [
        `https://www.google-analytics.com/`,
        `https://maps.googleapis.com/`,
        `https://apis.google.com/`,
        `https://accounts.google.com/`,
    ];
    const styles = [`https://fonts.googleapis.com/`];
    const fonts = [`https://fonts.gstatic.com/`];
    const frames = [
        `https://www.youtube.com/`,
        `https://apis.google.com/`,
        `https://accounts.google.com/`,
    ];
    const images = [
        `${IMG_SERVICE_URI}:${IMG_SERVICE_PORT}/`,
        `https:`,
        `data:`,
    ];
    const connect = [
        `${IMG_SERVICE_URI}:${IMG_SERVICE_PORT}/`,
        `https://api.github.com/`,
        `https://maps.googleapis.com/`,
        `https://apis.google.com/`,
        `https://accounts.google.com/`,
    ];

    return {
        defaultSrc: [self, getNonce, ...scripts],
        scriptSrc: [self, getNonce, ...scripts],
        styleSrc: [self, unsafeInline, ...styles],
        fontSrc: [self, ...fonts],
        frameSrc: [self, ...frames],
        connectSrc: [self, ...connect],
        imgSrc: [self, ...images],
        objectSrc: [self],
        upgradeInsecureRequests: [],
    };
}
