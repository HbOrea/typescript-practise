export class MyError extends Error {
    
    code: string;

    constructor(message: string, code: string) {
        super(message);
        this.name = "MyError";
        this.code = code;
    }
}