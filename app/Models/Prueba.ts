import DBClass from "../settings/db/db";

export default class PruebaModel extends DBClass {
    constructor (){
        super();
        this.table = "fut"
    }
}