import { Injectable } from '@angular/core';
//


import * as FileSaver from 'file-saver';
import * as XLSX from 'xlsx';
const EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
const EXCEL_EXTENSION = '.xlsx';
@Injectable()
export class ExportExcelService {

  constructor() { }

  private exportAsExcelFile(worksheet: XLSX.WorkSheet, excelFileName: string, worksheet1?: XLSX.WorkSheet): void {
    const workbook: XLSX.WorkBook = { Sheets: { 'data': worksheet  }, SheetNames: ['data'] };
    const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    this.saveAsExcelFile(excelBuffer, excelFileName);
}
private saveAsExcelFile(buffer: any, fileName: string): void {
    const data: Blob = new Blob([buffer], { type: EXCEL_TYPE });
    FileSaver.saveAs(data, fileName + EXCEL_EXTENSION);
}



ExportExcel(rows,headers:{}, excelLabel:string,filter?:number,col?:number, worksheet1?: XLSX.WorkSheet){

    let exportedRows =  rows
  //  let keyArr: string[] = this.getHeadersArray(headers);
  let removedKeyArr: string[] = this.getRemovedHeadersArray(exportedRows,headers);
  for (var removedKey of removedKeyArr) {
      for (var row of exportedRows) {
          delete row[removedKey];
      }
  }
  let orderedKeyArr: string[] = this.getOrderedHeadersArray(headers);

 
 let worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(
      exportedRows,
      { header: orderedKeyArr }
  );
  let j=[0,0,0,0,0,0,0,0]
  for(let i=0;i<=filter;i++){
j[i]=i
  }
  
 // worksheet= XLSX.utils.sheet_add_json(worksheet, [["this is afilter", 1, 2, 3]], {origin: "A0"});
 if(filter){
    if(!worksheet['!merges']) 
    worksheet['!merges'] = [];
    switch(filter){
        case 1:{
            worksheet["!merges"].push({s:{r:j[1],c:0},e:{r:j[1],c:col/2}},{s:{r:j[1],c:(col/2)+1},e:{r:j[1],c:col}});
            break
      }
      case 2:{
        worksheet["!merges"].push({s:{r:j[1],c:0},e:{r:j[1],c:col/2}},{s:{r:j[2],c:0},e:{r:j[2],c:col/2}},{s:{r:j[1],c:(col/2)+1},e:{r:j[1],c:col}},{s:{r:j[2],c:(col/2)+1},e:{r:j[2],c:col}});
        break
      }
      case 3:{
        worksheet["!merges"].push({s:{r:j[1],c:0},e:{r:j[1],c:col/2}},{s:{r:j[2],c:0},e:{r:j[2],c:col/2}},{s:{r:j[3],c:0},e:{r:j[3],c:col/2}},{s:{r:j[1],c:(col/2)+1},e:{r:j[1],c:col}},{s:{r:j[2],c:(col/2)+1},e:{r:j[2],c:col}},{s:{r:j[3],c:(col/2)+1},e:{r:j[3],c:col}});
  
        break
      }
      case 4:{
        worksheet["!merges"].push({s:{r:j[1],c:0},e:{r:j[1],c:col/2}},{s:{r:j[2],c:0},e:{r:j[2],c:col/2}},{s:{r:j[3],c:0},e:{r:j[3],c:col/2}},{s:{r:j[4],c:0},e:{r:j[4],c:col/2}},{s:{r:j[1],c:(col/2)+1},e:{r:j[1],c:col}},{s:{r:j[2],c:(col/2)+1},e:{r:j[2],c:col}},{s:{r:j[3],c:(col/2)+1},e:{r:j[3],c:col}},{s:{r:j[4],c:(col/2)+1},e:{r:j[4],c:col}});
  
        break
      }
      case 5:{
        worksheet["!merges"].push({s:{r:j[1],c:0},e:{r:j[1],c:col/2}},{s:{r:j[2],c:0},e:{r:j[2],c:col/2}},{s:{r:j[3],c:0},e:{r:j[3],c:col/2}},{s:{r:j[4],c:0},e:{r:j[4],c:col/2}},{s:{r:j[5],c:0},e:{r:j[5],c:col/2}},{s:{r:j[1],c:(col/2)+1},e:{r:j[1],c:col}},{s:{r:j[2],c:(col/2)+1},e:{r:j[2],c:col}},{s:{r:j[3],c:(col/2)+1},e:{r:j[3],c:col}},{s:{r:j[4],c:(col/2)+1},e:{r:j[4],c:col}},{s:{r:j[5],c:(col/2)+1},e:{r:j[5],c:col}});
  
        break
      }
      case 6:{
        worksheet["!merges"].push({s:{r:j[1],c:0},e:{r:j[1],c:col/2}},{s:{r:j[2],c:0},e:{r:j[2],c:col/2}},{s:{r:j[3],c:0},e:{r:j[3],c:col/2}},{s:{r:j[4],c:0},e:{r:j[4],c:col/2}},{s:{r:j[5],c:0},e:{r:j[5],c:col/2}},{s:{r:j[6],c:0},e:{r:j[6],c:col/2}},{s:{r:j[1],c:(col/2)+1},e:{r:j[1],c:col}},{s:{r:j[2],c:(col/2)+1},e:{r:j[2],c:col}},{s:{r:j[3],c:(col/2)+1},e:{r:j[3],c:col}},{s:{r:j[4],c:(col/2)+1},e:{r:j[4],c:col}},{s:{r:j[5],c:(col/2)+1},e:{r:j[5],c:col}},{s:{r:j[6],c:(col/2)+1},e:{r:j[6],c:col}});
  
        break
      }
      

      }
      
 }
 var wscols = [
    {wch:0},
    {wch:20},
    {wch:20},
    {wch:20},
    {wch:20},
    {wch:20},
    {wch:20},
    {wch:20},
    {wch:20}
];
if(worksheet1)
worksheet['!cols'] = wscols;

//worksheet["!merges"].push({s:{r:2,c:0},e:{r:1,c:4}}); /* A1:A2 */
//worksheet["!merges"].push({s:{r:3,c:0},e:{r:1,c:4}});
//worksheet["!merges"].push({s:{r:4,c:0},e:{r:1,c:4}});
  for (var key in headers) {
      if (
          headers[key].isVis &&
          headers[key].excel_cell_header != ""
      ) {
          worksheet[headers[key].excel_cell_header].v =
          headers[
              key
          ].title;
         
      }
  } console.log('w=',worksheet)
 
    this.exportAsExcelFile(worksheet, excelLabel,worksheet);
}

getRemovedHeadersArray(rows,headers) {

    let list: string[] = [];
    for (var key in headers) {

        if (headers[key].isVis == false) {
            list.push(key);
        }
    }

    for(var keyRow in rows[0]){
        for(var keyHeader in headers){
            if(keyRow === keyHeader ){
                break
            }
        }
    }
    return list;
}
 private getHeadersArray(headers ) {

    let list: string[] = [];
    for (var key in headers) {

        if (headers[key].isVis == true) {
            list.push(key);
        }
    }
    return list;
}


getOrderedHeadersArray(headers) {
    let list: string[] = [];
    let counter: number = 1;
    while (true) {
        let isFounded: boolean = false;
        for (var key in headers) {
            if (headers[key].order == counter) {
                list.push(key);
                isFounded = true;
                break;
            }
        }
        if (!isFounded) {
            break;
        }
        counter++;
    }
    return list;
}
   


}