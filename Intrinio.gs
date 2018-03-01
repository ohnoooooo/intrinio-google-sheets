function onInstall(e) {
  onOpen(e);
  getStarted();
}

function onOpen(e) {
  if (e && e.authMode == ScriptApp.AuthMode.NONE) {
    var menu = SpreadsheetApp.getUi().createAddonMenu();
    menu.addItem('Get Started', 'getStarted');   
    menu.addToUi(); 
  } else {
    var properties = PropertiesService.getDocumentProperties();
    var userProperties = PropertiesService.getUserProperties();
    
    try {
      var test = IntrinioVerify("ORCL");
    } catch(e) {
      var test = "na";
    }
    
    if(test === "ORCL") {
      var menu = SpreadsheetApp.getUi().createAddonMenu();
      var properties = PropertiesService.getDocumentProperties();
      menu.addItem('Intrinio Functions', 'showFunctionsSidebar');
      menu.addItem('Refresh Data', 'IntrinioResetDocCache');
      menu.addItem('Sign Out', 'signOut');
      menu.addToUi();    
    } else {
      var menu = SpreadsheetApp.getUi().createAddonMenu();
      var properties = PropertiesService.getDocumentProperties();
      menu.addItem('Get Started', 'getStarted');   
      menu.addToUi(); 
    }
  }
}

function getStarted() {
  var properties = PropertiesService.getDocumentProperties();
  var userProperties = PropertiesService.getUserProperties();
  
  try {
    var test = IntrinioVerify("ORCL");
  } catch(e) {
    var test = "na";
  }  
  if(test === "ORCL") {
    var menu = SpreadsheetApp.getUi().createAddonMenu();
    var properties = PropertiesService.getDocumentProperties();
    menu.addItem('Intrinio Functions', 'showFunctionsSidebar');
    menu.addItem('Refresh Data', 'IntrinioResetDocCache');
    menu.addItem('Sign Out', 'signOut');
    menu.addToUi();
    showFunctionsSidebar();
  } else {
    var html = HtmlService.createHtmlOutputFromFile('intrinio-getting-started')
    .setSandboxMode(HtmlService.SandboxMode.IFRAME)
    .setTitle('Get Started')
    .setWidth(300);
    SpreadsheetApp.getUi() 
    .showSidebar(html);
  }
}

function showFunctionsSidebar() {
  var html = HtmlService.createHtmlOutputFromFile('intrinio-functions')
      .setSandboxMode(HtmlService.SandboxMode.IFRAME)
      .setTitle('Intrinio Functions')
      .setWidth(300);
  SpreadsheetApp.getUi() 
      .showSidebar(html);
}

function processForm(formObject) {
  var userProperties = PropertiesService.getUserProperties();

  var input_username = formObject.userAPIKey;
  var input_password = formObject.collaboratorAPIKey;
  

  
  var username = userProperties.getProperty('INTRINIO_USER_API_KEY');
  if(username != null){
    userProperties.deleteProperty('INTRINIO_USER_API_KEY');
    userProperties.setProperty('INTRINIO_USER_API_KEY', input_username);
  }
  if (username === null) {
    userProperties.setProperty('INTRINIO_USER_API_KEY', input_username);
  }  
  
  var password = userProperties.getProperty('INTRINIO_COLLABORATOR_KEY');
  if(password != null){
    userProperties.deleteProperty('INTRINIO_COLLABORATOR_KEY');
    userProperties.setProperty('INTRINIO_COLLABORATOR_KEY', input_password);
  }
  if (password === null) {
    userProperties.setProperty('INTRINIO_COLLABORATOR_KEY', input_password);
  }
  
  var documentProperties = PropertiesService.getDocumentProperties();
  documentProperties.deleteAllProperties();
  
  var test = IntrinioVerify("ORCL");
  if(test === "ORCL") {
    var menu = SpreadsheetApp.getUi().createAddonMenu();
    var properties = PropertiesService.getDocumentProperties();
    menu.addItem('Intrinio Functions', 'showFunctionsSidebar');
    menu.addItem('Refresh Data', 'IntrinioResetDocCache');
    menu.addItem('Sign Out', 'signOut');
    menu.addToUi();    
  } else {
    var menu = SpreadsheetApp.getUi().createAddonMenu();
    var properties = PropertiesService.getDocumentProperties();
    menu.addItem('Get Started', 'getStarted');   
    menu.addToUi(); 
  }
}

/**
 * Retrieve a specific data point for a company (i.e. the last close price for GOOGL was $538.00)
 *
 * @param {"GOOGL"} ticker The company's ticker symbol (i.e. "AAPL")
 * @param {"close_price"} item The data field requested for the company (i.e. "trailing_dividend_yield" returns the current dividend yield, "current_yr_ave_eps_est" returns the current fiscal year average Wall Street consensus EPS estimate)
 * @customfunction
 */
function IntrinioDataPoint(ticker, item) { 
  if(ticker){
    if(ticker && item){
      var documentProperties = PropertiesService.getDocumentProperties();
      
      var Key = "DP" + "_" + ticker + "_" + item;
      
      var value = documentProperties.getProperty(Key);
      
      if(value){
        var randnumber = Math.max(250, Math.random()*500);
        Utilities.sleep(randnumber);
        Utilities.sleep(randnumber);
        
        var data = JSON.parse(value);
        return data["value"];
      } else {
        var userProperties = PropertiesService.getUserProperties();
        var username = userProperties.getProperty('INTRINIO_USER_API_KEY');
        var password = userProperties.getProperty('INTRINIO_COLLABORATOR_KEY');
        
        var url = 'https://api.intrinio.com/data_point?'
        + 'identifier=' + ticker
        + '&item=' + item;
        var headers = {
          "headers": {
            "Authorization": "Basic " + Utilities.base64Encode(username + ":" + password)
          },
        };
        
        var response = UrlFetchApp.fetch(url, headers);
        
        var randnumber = Math.max(500, Math.random()*1000);
        Utilities.sleep(randnumber);
        Utilities.sleep(randnumber);
        
        var json = response.getContentText();
        documentProperties.setProperty(Key, json);
        var data = JSON.parse(json);
        return data["value"];
      }
    }else{
      return ""
    }
  }else{
    return ""
  }
};

/**
 * Retrieve historical fundamentals for a company (i.e. the last fiscal year income statement for GOOGL is 2014)
 *
 * @param {"GOOGL"} ticker The company's ticker symbol (i.e. "AMZN")
 * @param {"income_statement"} statement The financial statement selected ("income_statement","balance_sheet","cash_flow_statement","calculations")
 * @param {"FY"} period_type The period type ("FY","QTR","TTM","YTD")
 * @param {0} sequence The sequence order of the fundamental from newest to oldest (0..last available)
 * @param {"fiscal_year"} item The item you are selecting (i.e. "fiscal_year" returns 2014, "fiscal_period" returns "FY", "end_date" returns the last date of the period)
 * @customfunction
 */
function IntrinioFundamentals(ticker,statement,period_type,sequence,item) { 
  if(ticker){
    if(ticker && statement && period_type){
    
      var documentProperties = PropertiesService.getDocumentProperties();
      
      var Key = "F" + "_" + ticker + "_" + statement + "_" + period_type;
      
      var value = documentProperties.getProperty(Key);
      
      if(value){
        var randnumber = Math.max(250, Math.random()*500);
        Utilities.sleep(randnumber);
        Utilities.sleep(randnumber);
        
        var data = JSON.parse(value);
        return data["data"][sequence][item];
      } else {
        var userProperties = PropertiesService.getUserProperties();
        var username = userProperties.getProperty('INTRINIO_USER_API_KEY');
        var password = userProperties.getProperty('INTRINIO_COLLABORATOR_KEY');
        
        var url = 'https://api.intrinio.com/fundamentals/standardized?'
        + 'ticker=' + ticker
        + '&statement=' + statement
        + '&type=' + period_type;
        var headers = {
          "headers": {
            "Authorization": "Basic " + Utilities.base64Encode(username + ":" + password)
          },
        };
        
        var response = UrlFetchApp.fetch(url, headers);
        var randnumber = Math.max(500, Math.random()*1000);
        Utilities.sleep(randnumber);
        Utilities.sleep(randnumber);
        
        var json = response.getContentText();
        documentProperties.setProperty(Key, json);
        var data = JSON.parse(json);
        return data["data"][sequence][item];
      }
    }else{
      return ""
    }
  }else{
    return ""
  }  
}

/**
 * Retrieve historical financial data for a company (i.e. the total revenue for GOOGL fiscal year 2014 in millions is $66,001)
 *
 * @param {"GOOGL"} ticker The company's ticker symbol (i.e. "FB")
 * @param {"income_statement"} statement The statement selected ("income_statement","balance_sheet","cash_flow_statement","calculations")
 * @param {2014} fiscal_year The selected fiscal year for the chosen statement (i.e. 2014, 2013, 2012) or the sequence order of the fundamental from newest to oldest (0..last available)
 * @param {"FY"} fiscal_period The selected fiscal period for the chosen statement ("FY","Q1","Q2","Q3","Q4","Q1TTM","Q2TTM","Q3TTM","Q2YTD","Q3YTD") or the period type ("FY","QTR","TTM","YTD")
 * @param {"totalrevenue"} tag The selected tag contained within the statement (i.e. "totalrevenue", "netppe", "totalequity","purchaseofplantpropertyandequipment", "netchangeincash")
 * @param {"M"} rounding Round the value (blank or "A" for actuals, "K" for thousands, "M" for millions, "B" for billions)
 * @customfunction
 */
function IntrinioFinancials(ticker,statement,fiscal_year,fiscal_period,tag,rounding) {
  if(ticker){
    if(ticker && statement && fiscal_period && tag){      
      if(fiscal_year === "#ERROR!" || fiscal_period === "#ERROR!"){
        return "test"
      } else{
        if(fiscal_year < 1900){
          var fundamental_sequence = fiscal_year;
          var fundamental_type = fiscal_period;
          fiscal_year = IntrinioFundamentals(ticker, statement, fundamental_type, fundamental_sequence, "fiscal_year");
          fiscal_period = IntrinioFundamentals(ticker, statement, fundamental_type, fundamental_sequence, "fiscal_period");
        }
        var documentProperties = PropertiesService.getDocumentProperties();
        
        var Key = "SF" + "_" + ticker + "_" + statement + "_" + fiscal_year + "_" + fiscal_period;
        
        var value = documentProperties.getProperty(Key);
        
        if(value){
          var randnumber = Math.max(250, Math.random()*500);
          Utilities.sleep(randnumber);
          Utilities.sleep(randnumber);
          
          var data = JSON.parse(value);
          for (var i=0; i < data["data"].length; i++) {
            if(data["data"][i]["tag"] === tag){
              var tag_value = data["data"][i]["value"]
              }
          }
          
          if(tag_value){
            if (rounding === "K"){
              var rounder = 1000
              } else if (rounding === "M") {
                var rounder = 1000000
                } else if (rounding === "B") {
                  var rounder = 1000000000
                  } else {
                    var rounder = 1
                    };
            return tag_value / rounder;
          }
        } else {
          var userProperties = PropertiesService.getUserProperties();
          var username = userProperties.getProperty('INTRINIO_USER_API_KEY');
          var password = userProperties.getProperty('INTRINIO_COLLABORATOR_KEY');
          
          var url = 'https://api.intrinio.com/financials/standardized?'
          + 'ticker=' + ticker
          + '&statement=' + statement
          + '&fiscal_year=' + fiscal_year
          + '&fiscal_period=' + fiscal_period;
          var headers = {
            "headers": {
              "Authorization": "Basic " + Utilities.base64Encode(username + ":" + password)
            },
          };
          
          var response = UrlFetchApp.fetch(url, headers);
          
          var randnumber = Math.max(500, Math.random()*1000);
          Utilities.sleep(randnumber);
          Utilities.sleep(randnumber);

          var json = response.getContentText();
          
          documentProperties.setProperty(Key, json);
          
          var data = JSON.parse(json);
          for (var i=0; i < data["data"].length; i++) {
            if(data["data"][i]["tag"] === tag){
              var tag_value = data["data"][i]["value"]
              }
          }
          
          if(tag_value){
            if (rounding === "K"){
              var rounder = 1000
              } else if (rounding === "M") {
                var rounder = 1000000
                } else if (rounding === "B") {
                  var rounder = 1000000000
                  } else {
                    var rounder = 1
                    };
            return tag_value / rounder;
          } else {
            
            var tag_value = "";
            return tag_value;
          }
        }
      }
    }else{
      return ""
    }
  }else{
    return ""
  }
}
function IntrinioStandardizedFinancials(ticker,statement,fiscal_year,fiscal_period,tag,rounding) {
  return IntrinioFinancials(ticker,statement,fiscal_year,fiscal_period,tag,rounding)
}

function IntrinioVerify(ticker) { 
  if(ticker){
    if(ticker){
      var documentProperties = PropertiesService.getDocumentProperties();
      
      var Key = "IV" + "_" + ticker;
      
      var value = documentProperties.getProperty(Key);
      
      if(value){
        var randnumber = Math.max(250, Math.random()*500);
        Utilities.sleep(randnumber);
        Utilities.sleep(randnumber);
        
        var data = JSON.parse(value);
        return data["value"];
      } else {
        var userProperties = PropertiesService.getUserProperties();
        var username = userProperties.getProperty('INTRINIO_USER_API_KEY');
        var password = userProperties.getProperty('INTRINIO_COLLABORATOR_KEY');
        
        var url = 'https://api.intrinio.com/companies/verify?'
        + 'ticker=' + ticker;
        var headers = {
          "headers": {
            "Authorization": "Basic " + Utilities.base64Encode(username + ":" + password)
          },
        };
        
        var response = UrlFetchApp.fetch(url, headers);
        var randnumber = Math.max(500, Math.random()*1000);
        Utilities.sleep(randnumber);
        Utilities.sleep(randnumber);
        
        var json = response.getContentText();
        documentProperties.setProperty(Key, json);
        var data = JSON.parse(json);
        return data["ticker"];
      }
    }else{
      return ""
    }
  }else{
    return ""
  }
};

function IntrinioResetDocCache() {
  var documentProperties = PropertiesService.getDocumentProperties();
  documentProperties.deleteAllProperties();
  SpreadsheetApp.flush();
  showAlert();
}


function signOut() {
  var userProperties = PropertiesService.getUserProperties();
  userProperties.deleteAllProperties();
  var documentProperties = PropertiesService.getDocumentProperties();
  documentProperties.deleteAllProperties();
  
  var menu = SpreadsheetApp.getUi().createAddonMenu();
  menu.addItem('Get Started', 'getStarted');   
  menu.addToUi();
}

function showAlert() {
  var ui = SpreadsheetApp.getUi();

  var result = ui.alert('The data in this spreadsheet will refresh shortly',ui.ButtonSet.OK);
}

function refresh(input) {
  
  var randnumber = Math.max(100, Math.random()*1000);
  Utilities.sleep(randnumber);
  
  return input;
  
}