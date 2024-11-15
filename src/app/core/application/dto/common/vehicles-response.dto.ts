export interface IGetVehicles {
    statusCode: number;
    message:    string;
    data:       Datum[];
    metadata:   Metadata;
}

export interface Datum {
    id:           number;
    make:         string;
    model:        string;
    year:         number;
    licensePlate: string;
    photo:        null | string;
}

export interface Metadata {
    totalItems:   number;
    itemCount:    number;
    itemsPerPage: number;
    totalPages:   number;
    currentPage:  number;
}
