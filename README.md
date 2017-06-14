# Overview

The Intrinio Google Sheets add-on extends the functionality of Google Sheets by enabling you to access the Intrinio API without any programming experience.  This Google Sheets add-on works on all devices that support Google Sheets - smart phone, tablet, Chrome OS, Mac OS, Windows OS, etc.  With the power of Google Sheets, Intrinio offers the most flexible access to financial data - anywhere, anytime.

With the Intrinio Google Sheets add-on, you can access your Intrinio Data Feeds through Intrinio Data Point and Intrinio Financials.  This allows you to pull in all types of current data for any company, security, bank, or index.

# Chrome Store
**[Intrinio Financial Data](https://chrome.google.com/webstore/detail/intrinio-financial-data/pknhlgmhmipaklmkpbfiondbgopiepge)**


# GitHub

The Intrinio Google Sheets add-on is released open source on [github](https://github.com/intrinio/intrinio-google-sheets).  If you have any questions, find bugs, or wish to improve the functionality, please feel free to contribute in the [intrinio-google-sheets](https://github.com/intrinio/intrinio-google-sheets) repository.

# Quick Installation
1.  Visit [intrinio.com](https://intrinio.com)
2.  Click sign up and enter your email
3.  You will receive a verification email with a link to follow
4.  Click the link in the email and complete your account details
5.  In your Account Page, scroll down and note your Access Key username and password
6.  In Google Sheets, install the [Google Sheets add-on](https://chrome.google.com/webstore/detail/intrinio-financial-data/pknhlgmhmipaklmkpbfiondbgopiepge?authuser=0)
7. Open a sheet
8. In the top menu, go to Add-ons -> Intrinio Financial Data -> Get Started
9. Enter your Access Key username and password (that you saw on your Account page at [intrinio.com/account](https://intrinio.com/account))
10. Click Submit
11. Click in a cell and try a sample function: `=IntrinioDataPoint("AAPL","pricetoearnings")`, hit Enter, wait a few moments for it to load, and you should see Intrinio data populated in the cell

# Intrinio Google Sheets Functions

Below are all of the Google Sheets custom functions for accessing the Intrinio API through the Google Sheets add-on.

## IntrinioDataPoint

**=`IntrinioDataPoint(identifier,item)`**  
Returns that most recent data point for a selected identifier (ticker symbol, CIK ID, Federal Reserve Economic Data Series ID, etc.) for a selected tag. The complete list of tags available through this function are available **<a href="http://docs.intrinio.com/tags/intrinio-public#data-point" target="_blank">Intrinio Data Point Tags</a>. Income statement, cash flow statement, and ratios are returned as trailing twelve months values. All other data points are returned as their most recent value, either as of the last release financial statement or the most recent reported value.

### Parameters

```
=IntrinioDataPoint("AAPL","name")

Apple Inc.

=IntrinioDataPoint("0000320193","ticker")

AAPL

=IntrinioDataPoint("AAPL","pricetoearnings")`

17.8763

=IntrinioDataPoint("AAPL","totalrevenue")`

199800000000.0

=IntrinioDataPoint("FRED.GDP","value")

18,034.8

=IntrinioDataPoint("DMD.ERP","ttm_erp")

0.0612
```

*   **identifier** - an identifier for the company or data point, including the SEC CIK ID, FRED Series ID, or Damodaran ERP: **<a href="http://docs.intrinio.com/master/us-securities" target="_blank">TICKER SYMBOL</a> | <a href="http://docs.intrinio.com/master/stock-indices" target="_blank">STOCK MARKET INDICES</a> | <a href="http://docs.intrinio.com/master/economic-indices" target="_blank">ECONOMIC INDICES</a> | <a href="http://docs.intrinio.com/master/sic-indices" target="_blank">SIC SYMBOL</a> | <a href="https://www.ffiec.gov/nicpubweb/nicweb/SearchForm.aspx" target="_blank">RSSD ID</a>**
*   **item** - the specified standardized tag or series ID requested: **<a href="http://docs.intrinio.com/tags/intrinio-public#data-point" target="_blank">INTRINIO DATA POINT TAGS</a> | <a href="http://docs.intrinio.com/tags/economic#home" target="_blank">ECONOMIC TAGS</a> | <a href="http://docs.intrinio.com/tags/intrinio-public#dmd-erp" target="_blank">DAMODARAN ERP</a> | <a href="http://docs.intrinio.com/tags/intrinio-banks#bank-data-point" target="_blank">BANK DATA POINT TAGS</a> | <a href="http://docs.intrinio.com/tags/intrinio-banks#call-report031" target="_blank">CALL REPORT 031 TAGS</a> | <a href="http://docs.intrinio.com/tags/intrinio-banks#call-report041" target="_blank">CALL REPORT 041 TAGS</a> | <a href="http://docs.intrinio.com/tags/intrinio-banks#ubpr-report" target="_blank">UBPR TAGS</a> | <a href="http://docs.intrinio.com/tags/intrinio-banks#y9c-report" target="_blank">Y9-C REPORT TAGS</a>**

## IntrinioFundamentals

**`=IntrinioFundamentals(ticker, statement, type, sequence, item)`**  
Returns a list of available standardized fundamentals (fiscal year and fiscal period) for a given ticker and statement. Also, you may add a date and type parameter to specify the fundamentals you wish to be returned in the response.

### Parameters

```
=IntrinioFundamentals("AAPL","income_statement","FY",0,"end_date")

2014-09-27

=IntrinioFundamentals("AAPL","balance_sheet","QTR",0,"fiscal_period")

Q3

=IntrinioFundamentals("AAPL","balance_sheet","QTR",0,"fiscal_year")

2015
```

*   **ticker** - the stock market ticker symbol associated with the companies common stock securities: **<a href="http://docs.intrinio.com/master/us-securities#home" target="_blank">TICKER SYMBOL</a>**
*   **statement** - the financial statement requested, options include the income statement, balance sheet, statement of cash flows and calculated metrics and ratios : **`income_statement | balance_sheet | cash_flow_statement | calculations`**
*   **type** - the type of periods requested - includes fiscal years for annual data, quarters for quarterly data and trailing twelve months for annual data on a quarterly basis: **`FY | QTR | TTM | YTD`**
*   **sequence** - an integer 0 or greater for calling a single fundamental from the first entry:**`0..last available`**
*   **item** - the return value for the fundamental: **`fiscal_year | fiscal_period | end_date | start_date`**


## IntrinioFinancials

**`=IntrinioFinancials(ticker, statement, fiscal_year/sequence, fiscal_period/type, tag,rounding)`**  
Returns professional-grade historical financial data. This data is standardized, cleansed and verified to ensure the highest quality data sourced directly from the XBRL financial statements. The primary purpose of standardized financials are to facilitate comparability across a single company's fundamentals and across all companies fundamentals.

For example, it is possible to compare total revenues between two companies as of a certain point in time, or within a single company across multiple time periods. This is not possible using the as reported financial statements because of the inherent complexity of reporting standards.

### Parameters

```
=IntrinioFinancials("AAPL","income_statement",2014,"FY","operatingrevenue","A")

182,795,000,000

=IntrinioFinancials("AAPL","balance_sheet",2,"QTR","totalequity","B")

123.328

=IntrinioFinancials("AAPL","income_statement",7,"TTM","netincometocommon","M")

37,037
```

*   **ticker** - the stock market ticker symbol associated with the companies common stock securities: **<a href="http://docs.intrinio.com/master/us-securities#home" target="_blank">TICKER SYMBOL</a>**
*   **statement** - the financial statement requested, options include the income statement, balance sheet, statement of cash flows and calculated metrics and ratios : **`income_statement | balance_sheet | cash_flow_statement | calculations`**
*   **fiscal_year** - the fiscal year associated with the fundamental OR the sequence of the requested fundamental (i.e. 0 is the first available fundamental associated with the fiscal period type):**`YYYY`** OR **`0..last available`**
*   **fiscal_period** - the fiscal period associated with the fundamental, or the fiscal period type in association with the sequence selected in the fiscal year parameter: **`FY | Q1 | Q2 | Q3 | Q4 | Q1TTM | Q2TTM | Q3TTM | Q2YTD | Q3YTD `** OR **`FY | QTR | YTD | TTM`**
*   **tag** - the specified standardized tag requested: **<a href="http://docs.intrinio.com/tags/intrinio-public#industrial" target="_blank">STANDARDIZED INDUSTRIAL TAGS</a> | <a href="http://docs.intrinio.com/tags/intrinio-public#financial" target="_blank">STANDARDIZED FINANCIAL TAGS</a>**
*   **rounding** (optional, actuals by default) - round the returned value (actuals, thousands, millions, billions):**`A | K | M | B`**
