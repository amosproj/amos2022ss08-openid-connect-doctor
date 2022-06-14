export class ProtocolLogger{
    public log: string;
    public statusCode: number;
    public index:number;
    constructor(log: string, statusCode: number, index:number) {
        this.log = log;
        this.statusCode = statusCode;
        this.index=index;
    }
}