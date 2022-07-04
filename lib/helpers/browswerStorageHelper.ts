export const getSessionStorageValue = (key: string) => sessionStorage.getItem(key);

/** Will clear key if value is null.*/
export const setSessionStorageValue = (key: string, value: string | null) =>
{
    value == null
        ? sessionStorage.removeItem(key)
        : sessionStorage.setItem(key, value);
}


export const getLocalStorageValue = (key: string) => localStorage.getItem(key);

/** Will clear key if value is null.*/
export const setLocalStorageValue = (key: string, value: string | null) =>
{
    value == null
        ? localStorage.removeItem(key)
        : localStorage.setItem(key, value);
}
