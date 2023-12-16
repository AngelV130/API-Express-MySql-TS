import { createPool, Pool, OkPacket, RowDataPacket, ResultSetHeader, ProcedureCallPacket } from 'mysql2/promise';
import Env from '../../../Env'

const {DB_HOST,DB_PORT,DB_USER,DB_PASSWORD,DB_NAME} = Env

type Conditions =  "=" | "!=" | ">" | "<" | ">=" | "<=" | "LIKE" | "IN" | "NOT IN" | "IS NULL" | "IS NOT NULL"

interface WhereCondition {
    type: 'OR' | "AND" | "LIKE" | "IN" | "NOT IN" | "IS NULL" | "IS NOT NULL" | " ";
    column: string;
    condition: Conditions;
    value: string | number | boolean | null;
}


interface Numeric {
    columName: string
    type: "INT" | "SMALLINT" | "BIGINT" | "DECIMAL" | "FLOAT"
    length?: number
    lengthDecimal?: number
    optionsDef?: Array<"PRIMARY KEY" |"UNIQUE" |"AUTO_INCREMENT" |"NOT NULL">
    foreing?:foreingKey
}
interface String{
    columName: string
    type: "CHAR" | "VARCHAR" | "TEXT"
    lengthChar: number | 255
    optionsDef?: Array<"PRIMARY KEY" |"UNIQUE" |"AUTO_INCREMENT" |"NOT NULL">
    foreing?:foreingKey
}
interface Date{
    columName: string
    type: "DATE" | "TIME" | "DATETIME"
    optionsDef?: Array<"PRIMARY KEY" |"UNIQUE" |"AUTO_INCREMENT" |"NOT NULL">
}
interface Miscellaneous {
    columName: string
    type: "ENUM" | "SET" | "JSON"
    optionsEnumSet: string[]
    optionsDef?: Array<"PRIMARY KEY" |"UNIQUE" |"AUTO_INCREMENT" |"NOT NULL">
}
interface foreingKey{
  tableRefrence: string
  columnRefrence: string
  cascade: boolean
}

export default class DBClass {
    private pool: Pool;
    private queryType?: 'SELECT' | 'INSERT' | 'UPDATE' | 'DELETE';
    private columns?: string[];
    private whereConditions: WhereCondition[] = [];
    private _table?: string

    constructor() {
      this.pool = createPool({
        host: DB_HOST,
        port: DB_PORT,
        user: DB_USER,
        password: DB_PASSWORD,
        database: DB_NAME,
      });
    }

    protected get DB() {
        return this.pool
    }
    protected set table(table:string) {
        this._table = table;
    }
    protected get table():string | undefined {
        return this._table;
    }

    async execute(): Promise<OkPacket | RowDataPacket[] | ResultSetHeader[] | RowDataPacket[][] | OkPacket[] | ProcedureCallPacket> {
        if (!this.queryType) {
          throw new Error('No query type specified. Use select, insert, update, or delete.');
        }
        if (!this._table) {
            throw new Error('No table specified. Specified a table.');
        }
        
        let queryString = `${this.queryType} ${this.columns!.join(',')} FROM ${this._table}`;
    
        if (this.whereConditions.length > 0) {
          queryString += ' WHERE ' + this.whereConditions.map((v)=>{
            return `${v.type} ${v.column} ${v.condition} ${v.value}`
          }).join(' ');
        }
    
        try {
            this.pool.getConnection()
            const [rows] = await this.pool.query(queryString);
            return rows;
        } catch (error) {
          throw new Error(`Error executing query: ${error}`);
        }
      }


    // Functions querys DB
    select(columns: string[]) {
        this.queryType = 'SELECT';
        this.columns = columns;
        this.whereConditions = [];
        return this;
      }
    
      where(column: string, condition: Conditions, value: string | number | boolean | null) {
        this.whereConditions.push({ type: ' ', column, condition, value });
        return this;
      }
    
      ORwhere(column: string, condition: Conditions, value: string | number | boolean) {
        this.whereConditions.push({ type: 'OR', column, condition, value });
        return this;
      }
      ANDwhere(column: string, condition: Conditions, value: string | number | boolean) {
        this.whereConditions.push({ type: 'AND', column, condition, value });
        return this;
      }

      // Miscellaneous(options:Miscellaneous){

      // }
      // Date(options:Date){

      // }
      // String(options:String){

      // }
      // Numeric(options:Numeric){
        
      // }
      async createTable(
        colums:
        Array<
        Miscellaneous|
        Date|
        String|
        Numeric>
        ){
        let queryString = `CREATE TABLE ${"Prueba2"} (${
          colums.map((v)=>{
            let complement:string = ''
            let FOREIGN:string | null = null
            if("length" in v){
              complement = `${v.length}` || ' '
              if(v.type == "DECIMAL"){
                complement = `(${v.length || 10},${v.lengthDecimal || 2})`
              }
            }
            if("lengthChar" in v){
              if(v.type == "VARCHAR" || v.type == "CHAR"){
                complement = `(${v.lengthChar || 255})`
              }
            }
            if("optionsEnumSet" in v){
              if(v.type != "JSON"){
                complement = `(${v.optionsEnumSet.join(",")})`
              }
            }

            if( v.type === "CHAR" ||
                v.type === "VARCHAR" ||
                v.type === "TEXT" ||
                v.type === "INT" ||
                v.type === "SMALLINT" ||
                v.type === "BIGINT" ||
                v.type === "DECIMAL" ||
                v.type === "FLOAT"){
                  if(v.foreing != undefined){
                console.log("Entro",v.type)
                FOREIGN = `FOREIGN KEY (${v.columName}) REFERENCES ${v.foreing.tableRefrence}(${v.foreing.columnRefrence}) ${v.foreing.cascade == true ? "ON DELETE CASCADE":''}`;
              }
            }
            return `${v.columName} ${v.type}${complement || " "} ${v.optionsDef?.join(" ") || ""} ${FOREIGN != null ? ", "+FOREIGN : ' '}`;
          }).join(",")
        });`;

        try {
          this.pool.getConnection()
          const rows = await this.pool.query(queryString);
          return {
            rows, queryString
          };
      } catch (error) {
        console.log(queryString)
        throw new Error(`Error executing query: ${error}`);
      }
    }
}