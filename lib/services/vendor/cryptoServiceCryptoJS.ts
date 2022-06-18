import { CryptoServiceInterface } from "../cryptoService";
import { HmacSHA256, enc } from 'crypto-js';
import { randomUUID } from "crypto";

export class CryptoServiceCryptoJS implements CryptoServiceInterface
{
    async randomUUID(): Promise<string>
    {
        return randomUUID();
    }

    async hashValue(value: string, salt: string): Promise<string>
    {
        var hash = CryptoJS.HmacSHA256(value, salt);
        var hash64 = CryptoJS.enc.Base64url.stringify(hash);
        return hash64;
    }

    async hashValueDefault(value: string): Promise<string>
    {
        if (typeof window !== 'undefined')
            throw new Error('This method can only be called on the server.');

        const salt = process.env.SECURITY_INTERFACE;
        if (!salt)
            throw new Error('Cannot use default hash method. No value found for SECURITY_SALT');

        var hash = HmacSHA256(value, salt);
        var hash64 = enc.Base64url.stringify(hash);
        return hash64;
    }

}