export const deepCopy = <TData>(data: TData) =>
{
    return JSON.parse(JSON.stringify(data));
}