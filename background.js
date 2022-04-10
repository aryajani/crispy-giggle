//chrome.identity.getAuthToken({interactive: true}, function(token) {
    //console.log('got the token', token);
 // })

  const API_KEY = 'AIzaSyDCeGmpWRm52e5ygGaj-aQvZLgbxLuPcX0';
  const DISCOVERY_DOCS = ["https://sheets.googleapis.com/$discovery/rest?version=v4"];
  const SPREADSHEET_ID = '1ONiFiFr74j4WG_pQoK69Io6Jiom4X8hBXgIfYLUkgSo';
  const SPREADSHEET_TAB_NAME = 'Sheet1'; //could be sheet 1
  
  function onGAPILoad() {
    gapi.client.init({
      // Don't pass client nor scope as these will init auth2, which we don't want
    apiKey: API_KEY,
    discoveryDocs: DISCOVERY_DOCS,
    })

    console.log('gapi initialized')
    chrome.identity.getAuthToken({interactive: true}, function(token) {
      gapi.auth.setToken({
        'access_token': token,
      });

      gapi.client.sheets.spreadsheets.values.get({
        spreadsheetId: SPREADSHEET_ID,
        range: SPREADSHEET_TAB_NAME,
      }).then(function(response) {
        console.log(`Got ${response.result.values.length} rows back`)
      });
    })


    //Listen for messages from inject.js
chrome.extension.onMessage.addListener(
    function(request, sender, sendResponse) {
      // Get the token
      chrome.identity.getAuthToken({interactive: true}, function(token) {
        // Set GAPI auth token
        gapi.auth.setToken({
          'access_token': token,
        });
  
        const body = {values: [[
          new Date(), // Timestamp
          request.title, // Page title
          request.url, // Page URl
          
        ]]};
  
        // Append values to the spreadsheet
        gapi.client.sheets.spreadsheets.values.append({
          spreadsheetId: SPREADSHEET_ID,
          range: SPREADSHEET_TAB_NAME,
          valueInputOption: 'USER_ENTERED',
          resource: body
        }).then((response) => {
          // On success
          console.log(`${response.result.updates.updatedCells} cells appended.`)
          sendResponse({success: true});
        });
      })
  
      // Wait for response
      return true;
    }
  );
  
    
  /*
    .then(function () {
      console.log('gapi initialized')
      chrome.identity.getAuthToken({interactive: true}, function(token) {
        gapi.auth.setToken({
          'access_token': token,
        });
  
        gapi.client.sheets.spreadsheets.values.get({
          spreadsheetId: SPREADSHEET_ID,
          range: SPREADSHEET_TAB_NAME,
        }).then(function(response) {
          console.log(`Got ${response.result.values.length} rows back`)
        });
      })
    }, function(error) {
      console.log('error', error)
    });

    */
  }




