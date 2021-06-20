export enum ValueTypes {
    STRING = 'string',
    INT = 'int',
    INT32 = 'int32',
    INT64 = 'int64',
    INT_SLICE = 'int_slice',
    UINT8 = 'uint8',
    UINT16 = 'uint16',
    UINT32 = 'uint32',
    UINT64 = 'uint64',
    UINT64_SLICE = 'uint64_slice',
    FLOAT32 = 'float32',
    FLOAT64 = 'float64',
    BYTES = 'bytes',
    TIME = 'time',
    BOOL = 'bool',
    IP = 'ip',
    IP_SLICE = 'ip_slice',
    STRING_SLICE = 'string_slice',
}

export enum Sources {
    CORE = 'core',
    COLLECTOR = 'collector',
    ECS = 'ecs',
    USER = 'user',
}

export interface IEventFields {
    DisplayPriority?: number;
    FieldName: string;
    LongDescription: string;
    RenderType?: string;
    ShortDescription: string;
    Source?: Sources;
    SourceType?: string;
    Value?: any;
    ValueType: ValueTypes;
    DropSimilarityThreshold?: boolean; // Флажок расширенного поиска
    DropTotal?: boolean; // Флажок для того, чтобы в БД не было подсчета параметра total
}

export const eventFieldsTypes = ['unknown', 'number', 'text', 'hex', 'base64', 'time', 'docKey', 'bool', 'ip', 'json', 'url'];

export const initialEventFieldsModel = {
    FieldName: '',
    ShortDescription: '',
    LongDescription: '',
    ValueType: ValueTypes.STRING,
};
