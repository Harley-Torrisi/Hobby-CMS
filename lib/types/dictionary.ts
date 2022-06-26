export type DictionaryS<TValue> = {
    [key in string]: TValue;
};

export type DictionaryN<TValue> = {
    [key in number]: TValue;
};