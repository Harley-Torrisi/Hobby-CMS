import DatabaseInterface from "@lib/database/interface/databaseInterface";
import DatabaseFaunaFQL from '@lib/database/classes/databaseFaunaFQL';
import SecurityInterface from "@lib/security/securityInterface";
import SecurityCryptoJS from "@lib/security/securityCryptoJS";

export namespace ServiceFactory
{
    export namespace DatabaseFactory
    {
        export async function getDefault(): Promise<DatabaseInterface>
        {
            const method = process.env.DB_TARGET_TYPE;

            if (!method) throw new Error('Cannot get default DatabaseInterface. No value found for DB_TARGET_TYPE');

            return getSpecific(method);
        }

        export async function getSpecific(interfaceTarget: string): Promise<DatabaseInterface>
        {
            switch (interfaceTarget)
            {
                default: throw new Error(`Cannot get default DatabaseInterface. '${interfaceTarget}' is not implemented or invalid syntax.`);

                case 'FAUNAFQL':
                    const secret = process.env.DB_INTERFACE_FAUNAFQL_SECRET!;
                    const domain = process.env.DB_INTERFACE_FAUNAFQL_DOMAIN!;
                    const port = Number.parseInt(process.env.DB_INTERFACE_FAUNAFQL_PORT!);
                    const scheme = process.env.DB_INTERFACE_FAUNAFQL_SCHEME!;
                    const database = process.env.DB_INTERFACE_FAUNAFQL_DATABASE_NAME!;
                    return new DatabaseFaunaFQL(secret, domain, port, scheme as any, database);
            }
        }
    }

    export namespace Security
    {
        export async function getDefault(): Promise<SecurityInterface>
        {
            const method = process.env.SECURITY_INTERFACE;

            if (!method) throw new Error('Cannot get default SecurityInterface. No value found for SECURITY_INTERFACE');

            return getSpecific(method);
        }

        export async function getSpecific(interfaceTarget: string): Promise<SecurityInterface>
        {
            switch (interfaceTarget)
            {
                default: throw new Error(`Cannot get default SecurityInterface. '${interfaceTarget}' is not implemented or invalid syntax.`);

                case 'CRYPTOJS': return new SecurityCryptoJS();
            }
        }
    }
}
