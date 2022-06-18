import { Injectable } from '@nestjs/common';
import * as fs from 'fs';

@Injectable()
export class SettingsService {
    //private static _instance: SettingService;
    private settings:any;

    constructor() {
        this.settings = JSON.parse(fs.readFileSync('settings/default.json').toString());
        console.log(this.settings);
    }

    public get config() {
        return this.settings;
    }

    //public static get Instance() {
    //    return this._instance || (this._instance = new this());
    //}
}
