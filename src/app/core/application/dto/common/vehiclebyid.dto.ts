export interface IGetVehicleByID {
    statusCode: number;
    message:    string;
    data:       Data;
}

export interface Data {
    id:           number;
    make:         string;
    model:        string;
    year:         number;
    licensePlate: string;
    photo:        string;
}
