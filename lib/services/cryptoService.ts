import { CryptoServiceCryptoJS } from './vendor/cryptoServiceCryptoJS';

enum Vedors
{
    CryptoJS = "CRYPTOJS"
}

export class CryptoServiceFactory
{
    /** NOTE: This method is for SSR use only. */
    public static async getDefault(): Promise<CryptoServiceInterface>
    {
        if (typeof window !== 'undefined')
            throw new Error('This method can only be called on the server.');

        const method = process.env.SECURITY_INTERFACE;
        if (!method)
            throw new Error('Cannot get default CryptoServiceInterface. No value found for SECURITY_INTERFACE');
        return this.getSpecific(method);
    }

    public static async getSpecific(vendor: string): Promise<CryptoServiceInterface>
    {
        switch (vendor)
        {
            case Vedors.CryptoJS:
                return new CryptoServiceCryptoJS();

            default: throw new Error(`Cannot get CryptoServiceInterface. '${vendor}' is not implemented or invalid syntax.`);
        }
    }
}

export interface CryptoServiceInterface
{
    hashValue(value: string, salt: string): Promise<string>

    /** NOTE: This method is for SSR use only. */
    hashValueDefault(value: string): Promise<string>

    randomUUID(): Promise<string>
}