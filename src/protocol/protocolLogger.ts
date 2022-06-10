export class ProtocolLogger{
    public log: string;
    public statusCode: number;
    constructor(log: string, statusCode: number) {
        this.log = log;
        this.statusCode = statusCode;
    }
}