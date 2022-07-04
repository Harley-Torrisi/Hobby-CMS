export const compareObjectsSame = <TData>(objectOne: TData, objectTwo: TData): boolean =>
{
    return JSON.stringify(objectOne) === JSON.stringify(objectTwo);
}