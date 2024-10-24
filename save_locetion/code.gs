// ตั้งชื่อ Sheet ที่จะใช้เก็บข้อมูล
const SHEET_NAME = "Locations";

// ฟังก์ชันสำหรับการตั้งค่าเริ่มต้น
function setup() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName(SHEET_NAME);
  
  // ถ้ายังไม่มี sheet ให้สร้างใหม่
  if (!sheet) {
    sheet = ss.insertSheet(SHEET_NAME);
  }
  
  // ตั้งค่าหัวตาราง
  sheet.getRange("A1:E1").setValues([["Timestamp", "User ID", "Display Name", "Latitude", "Longitude"]]);
  sheet.setFrozenRows(1);
}

// ฟังก์ชันสำหรับรับข้อมูลและบันทึกลง Sheet
function doPost(e) {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEET_NAME);
  var data = JSON.parse(e.postData.contents);
  
  // ตรวจสอบว่ามีข้อมูลครบหรือไม่
  if (!data.user_id || !data.display_name || !data.latitude || !data.longitude) {
    return ContentService.createTextOutput(JSON.stringify({status: "error", message: "Missing required fields"}))
      .setMimeType(ContentService.MimeType.JSON);
  }
  
  // บันทึกข้อมูลลง Sheet
  sheet.appendRow([
    new Date(),
    data.user_id,
    data.display_name,
    data.latitude,
    data.longitude
  ]);
  
  return ContentService.createTextOutput(JSON.stringify({status: "success", message: "Data saved successfully"}))
    .setMimeType(ContentService.MimeType.JSON);
}

// ฟังก์ชันสำหรับดึงข้อมูลทั้งหมดจาก Sheet
function doGet() {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEET_NAME);
  var data = sheet.getDataRange().getValues();
  var headers = data.shift();
  
  var jsonData = data.map(function(row) {
    var obj = {};
    headers.forEach(function(header, index) {
      obj[header] = row[index];
    });
    return obj;
  });
  
  return ContentService.createTextOutput(JSON.stringify(jsonData))
    .setMimeType(ContentService.MimeType.JSON);
}

// ฟังก์ชันสำหรับสร้างหน้า HTML สำหรับบันทึกตำแหน่ง
function doGet() {
  return HtmlService.createHtmlOutputFromFile('Index')
      .setTitle('Location Logger');
}

// ฟังก์ชันสำหรับสร้างหน้า HTML สำหรับ Admin
function doGetAdmin() {
  return HtmlService.createHtmlOutputFromFile('Admin')
      .setTitle('Admin - Location Data');
}
