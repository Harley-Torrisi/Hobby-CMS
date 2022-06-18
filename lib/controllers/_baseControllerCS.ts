import { ApiRequester } from "@lib/helpers/internalApiHelper";

export abstract class BaseControllerCS
{
    protected api: ApiRequester;

    constructor()
    {
        this.api = new ApiRequester();
    }
}