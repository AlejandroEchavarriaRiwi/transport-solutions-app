export interface IGetMaintenance {
    statusCode: number;
    message:    string;
    data:       Datum[];
    metadata:   Metadata;
}

export interface Datum {
    id:      number;
    type:    string;
    date:    Date;
    mileage: number;
    notes:   string;
}

export interface Metadata {
    totalItems:   number;
    itemCount:    number;
    itemsPerPage: number;
    totalPages:   number;
    currentPage:  number;
}
