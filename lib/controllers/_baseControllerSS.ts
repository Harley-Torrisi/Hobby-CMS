import { DatabaseContextFactory } from "@lib/database/context/databaseContextFactory";
import { DatabaseContextInterface } from "@lib/database/context/databaseContextInterface";

export abstract class BaseControllerSS
{
    protected dbPromise: Promise<DatabaseContextInterface>

    constructor()
    {
        this.dbPromise = DatabaseContextFactory.getDefault();
    }
}