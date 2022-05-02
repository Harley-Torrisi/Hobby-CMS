import SecurityInterface from '@lib/security/securityInterface'
import CryptoJS from 'crypto-js';

export default class SecurityCryptoJS implements SecurityInterface
{
    async hashValue(value: string, salt: string): Promise<string>
    {
        var hash = CryptoJS.HmacSHA256(value, salt);
        var hash64 = CryptoJS.enc.Base64.stringify(hash);
        return hash64;
    }
}