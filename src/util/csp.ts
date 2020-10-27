import { v4 as uuid } from "uuid";
import { API_URL, IMG_SERVICE_URL } from "./../constants";

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
        `${API_URL}/`,
        `https://www.google-analytics.com/`,
        `https://maps.googleapis.com/`,
        `https://apis.google.com/`,
        `https://accounts.google.com/`,
    ];
    const styles = [
        `${API_URL}/`,
        `https://fonts.googleapis.com/`
    ];
    const fonts = [
        `${API_URL}/`,
        `https://fonts.gstatic.com/`
    ];
    const frames = [
        `${API_URL}/`,
        `https://www.youtube.com/`,
        `https://apis.google.com/`,
        `https://accounts.google.com/`,
    ];
    const images = [
        `${API_URL}/`,
        `${IMG_SERVICE_URL}/`,
        `https:`,
        `data:`,
    ];
    const connect = [
        `${API_URL}/`,
        `${IMG_SERVICE_URL}/`,
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
