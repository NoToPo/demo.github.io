import { environment } from "src/environments/environment";

export class Urlserver {
    static readonly REST_API_SERVER = environment.apiUrl;

    // User API urls
    static readonly URL_LOGIN = `${this.REST_API_SERVER}/user/login`;
    static readonly URL_SIGNUP = `${this.REST_API_SERVER}/user/signup`;
    static readonly URL_CHANGE_PASSWORD = `${this.REST_API_SERVER}/user/changePassword`;
    static readonly URL_GET_IMAGE = `${this.REST_API_SERVER}/get_image?path=`;
    static readonly URL_GET_NAME_PROJECT = `${this.REST_API_SERVER}/user/getNameProject`;
    static readonly URL_GET_TYPE_PROJECT = `${this.REST_API_SERVER}/user/getTypeProject`;
    static readonly URL_INSERT_NOTE = `${this.REST_API_SERVER}/user/insertNote`;
    static readonly URL_UPLOAD_IMAGE = `${this.REST_API_SERVER}/user/uploadImage`;
    static readonly URL_SET_STATUS = `${this.REST_API_SERVER}/setStatus`;

    static readonly URL_GET_FURNITURE_LIST = `${this.REST_API_SERVER}/getFurnitureList`;
    static readonly URL_GET_STATUS_LIST = `${this.REST_API_SERVER}/getStatusList`;

    public static getSortSearchData(data: any): string {
        let url = `${this.REST_API_SERVER}/sortSearchData?id_name_project=${data.id_name_project}`;

        if (data.Code) {
            url = url + `&Code=${data.Code}`;
        }
        if (data.Phone) {
            url = url + `&Phone=${data.Phone}`;
        }
        if (data.Bed) {
            url = url + `&Bed=${data.Bed}`;
        }
        if (data.Status) {
            url = url + `&Status=${data.Status}`;
        }
        if (data.Furniture) {
            url = url + `&Furniture=${data.Furniture}`;
        }
        if (data.Bathroom) {
            url = url + `&Bathroom=${data.Bathroom}`;
        }


        return url;
    }

    public static getDataProperties(page: number, pageLimit: number, orderBy: string): string {
        return `${this.REST_API_SERVER}/user/getDataProperties?page=${page}&page_limit=${pageLimit}&order_by=${orderBy}`
    }

    public static viewPhoneNumber(idNameProject: string, idData: string): string {
        return `${this.REST_API_SERVER}/user/viewPhoneNumber?id_name_project=${idNameProject}&id_data=${idData}`
    }

    // Mod API urls
    static readonly URL_CREATE_DATA_PROPERTIES = `${this.REST_API_SERVER}/su/createDataProperties`;
    static readonly URL_UPDATE_DATA_PROPERTIES = `${this.REST_API_SERVER}/su/updateDataProperties`;
    public static getModDataProperties(page: number, pageLimit: number, orderBy: string): string {
        return `${this.REST_API_SERVER}/su/getDataProperties?page=${page}&page_limit=${pageLimit}&order_by=${orderBy}`
    }

    // Admin API urls
    static readonly URL_CREATE_TYPE_PROJECT = `${this.REST_API_SERVER}/su/createTypeProject`;
    static readonly URL_UPDATE_TYPE_PROJECT = `${this.REST_API_SERVER}/su/updateTypeProject`;
    static readonly URL_GET_ADMIN_TYPE_PROJECT = `${this.REST_API_SERVER}/su/getTypeProject`;
    static readonly URL_CREATE_NAME_PROJECT = `${this.REST_API_SERVER}/su/createNameProject`;
    static readonly URL_UPDATE_NAME_PROJECT = `${this.REST_API_SERVER}/su/updateNameProject`;
    static readonly URL_GET_ADMIN_NAME_PROJECT = `${this.REST_API_SERVER}/su/getNameProject`;
}
