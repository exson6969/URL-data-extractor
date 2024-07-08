"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const firebaseConfig_1 = require("./firebaseConfig");
const firestore_1 = require("firebase/firestore");
const extractCityAndCountry = (url) => {
    const regex = /\/place\/([^\/]+),([^\/]+)\/@/;
    const match = url.match(regex);
    if (match && match.length >= 3) {
        const city = decodeURIComponent(match[1].replace(/\+/g, ' '));
        const country = decodeURIComponent(match[2].replace(/\+/g, ' '));
        return { city, country };
    }
    return null;
};
const storeData = (userId, city, country) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield (0, firestore_1.setDoc)((0, firestore_1.doc)(firebaseConfig_1.db, 'users', userId), { city, country }, { merge: true });
        console.log('Data stored successfully');
    }
    catch (error) {
        console.error('Error storing data: ', error);
    }
});
const extractAndStore = (userId, url) => __awaiter(void 0, void 0, void 0, function* () {
    const data = extractCityAndCountry(url);
    if (data) {
        try {
            yield storeData(userId, data.city, data.country);
        }
        catch (error) {
            console.log(error);
        }
    }
    else {
        console.log('Invalid URL format');
    }
});
(() => __awaiter(void 0, void 0, void 0, function* () {
    const userId = 'exson';
    const url = 'https://www.google.com/maps/place/Meenambakkam,+Chennai,+Tamil+Nadu,+India+600114/@12.9801823,80.1734136,15z/data=!4m6!3m5!1s0x3a525e0305be150f:0x2b99b7504f8f7512!8m2!3d12.9828816!4d80.177393!16s%2Fg%2F11bw49lm21?entry=ttu';
    yield extractAndStore(userId, url);
}))();
