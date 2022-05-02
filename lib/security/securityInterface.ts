export default interface SecurityInterface
{
    /** @returns encrypted value.*/
    hashValue(value: string, salt: string): Promise<string>
}