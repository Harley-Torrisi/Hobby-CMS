import { FaunaContext } from "../vendor/faunaContext";
import { DatabaseContextInterface } from "./databaseContextInterface";

enum Vedors
{
    FaunFQL = "FAUNAFQL"
}

export class DatabaseContextFactory
{
    public static async getDefault(): Promise<DatabaseContextInterface>
    {
        const method = process.env.DB_TARGET_TYPE;

        if (!method)
            throw new Error('Cannot get default DatabaseContext. No value found for DB_TARGET_TYPE');

        return this.getSpecific(method);
    }

    public static async getSpecific(vendor: string): Promise<DatabaseContextInterface>
    {
        switch (vendor)
        {
            case Vedors.FaunFQL:
                const secret = process.env.DB_INTERFACE_FAUNAFQL_SECRET!;
                const domain = process.env.DB_INTERFACE_FAUNAFQL_DOMAIN!;
                const port = Number.parseInt(process.env.DB_INTERFACE_FAUNAFQL_PORT!);
                const scheme = process.env.DB_INTERFACE_FAUNAFQL_SCHEME!;
                return new FaunaContext(secret, domain, port, scheme as any);

            default: throw new Error(`Cannot get DatabaseContext. '${vendor}' is not implemented or invalid syntax.`);
        }
    }
}