import
{
    Get, Create, Update, Delete,
    Collection, Documents, Index,
    Match, Paginate, Select, Map, Lambda,
    CreateIndex, CreateCollection,
    Client, ClientConfig, NewId
} from 'faunadb';

interface QueryResponsSingle<TData>
{
    data: TData
}

interface QueryResponsMulti<TData>
{
    data: { data: TData }[]
}

export class FaunaQueries
{
    private client: Client

    constructor({ secret, domain, port, scheme }: ClientConfig)
    {
        this.client = new Client({ secret, domain, port, scheme });
    }

    private unmapQueryResponsMulti<TData>(response: QueryResponsMulti<TData>): TData[]
    {
        return response.data.flatMap(x => x.data);
    }

    taskCollectionCreate = async (colectionName: string) =>
    {
        await this.client.query(
            CreateCollection({ name: colectionName, history_days: null })
        );
    }

    taskIndexCreate = async (collectionName: string, indexName: string, indexColumn: string, unique: boolean = true) =>
    {
        await this.client.query(
            CreateIndex({
                name: indexName,
                source: Collection(collectionName),
                terms: [{ field: ["data", indexColumn] }],
                unique: unique
            })
        );
    }

    create = async <TEntity>(collectionName: string, data: TEntity): Promise<TEntity> =>
    {
        const response = await this.client.query<QueryResponsSingle<TEntity>>(
            Create(Collection(collectionName), { data })
        );
        return response.data;
    }

    get = async <TEntity>(indexName: string, indexValue: string): Promise<TEntity> =>
    {
        const response = await this.client.query<QueryResponsSingle<TEntity>>(
            Get(Match(Index(indexName), indexValue))
        );
        return response.data;
    }

    getAll = async <TEntity>(collectionName: string): Promise<TEntity[]> =>
    {
        const response = await this.client.query<QueryResponsMulti<TEntity>>(
            Map(
                Paginate(Documents(Collection(collectionName))),
                Lambda(x => Get(x))
            )
        );
        return this.unmapQueryResponsMulti(response);
    }

    update = async <TEntity>(indexName: string, indexValue: string, data: object): Promise<TEntity> =>
    {
        const response = await this.client.query<QueryResponsSingle<TEntity>>(
            Update(
                Select("ref", Get(Match(
                    Index(indexName),
                    indexValue
                ))),
                { data }
            )
        );
        return response.data;
    }

    delete = async (indexName: string, indexValue: string) =>
    {
        await this.client.query(
            Delete(Select("ref", Get(Match(
                Index(indexName),
                indexValue
            ))))
        );
    }

    newID = async (): Promise<string> => await this.client.query(NewId());
}