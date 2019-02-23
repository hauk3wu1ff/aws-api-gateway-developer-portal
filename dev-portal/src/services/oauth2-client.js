// Copied from oauth2-redirect.html of swagger-ui project 
// to support testing apis with oauth2 security

export function oauth2Redirect() {
    console.log(window.location);
    let oauth2 = window.opener.swaggerUIRedirectOauth2;
    let sentState = oauth2.state;
    let redirectUrl = oauth2.redirectUrl;
    let isValid, qp, arr;
  
    if (/code|token|error/.test(window.location.hash)) {
        qp = window.location.hash.substring(1);
    } else {
        qp = window.location.search.substring(1);
    }
  
    arr = qp.split("&")
    arr.forEach(function (v,i,_arr) { _arr[i] = '"' + v.replace('=', '":"') + '"';})
    qp = qp ? JSON.parse('{' + arr.join() + '}',
            function (key, value) {
                return key === "" ? value : decodeURIComponent(value)
            }
    ) : {}
  
    isValid = qp.state === sentState
  
    if ((
      oauth2.auth.schema.get("flow") === "accessCode"||
      oauth2.auth.schema.get("flow") === "authorizationCode"
    ) && !oauth2.auth.code) {
        if (!isValid) {
            oauth2.errCb({
                authId: oauth2.auth.name,
                source: "auth",
                level: "warning",
                message: "Authorization may be unsafe, passed state was changed in server Passed state wasn't returned from auth server"
            });
        }
  
        if (qp.code) {
            delete oauth2.state;
            oauth2.auth.code = qp.code;
            oauth2.callback({auth: oauth2.auth, redirectUrl: redirectUrl});
        } else {
            let oauthErrorMsg
            if (qp.error) {
                oauthErrorMsg = "["+qp.error+"]: " +
                    (qp.error_description ? qp.error_description+ ". " : "no accessCode received from the server. ") +
                    (qp.error_uri ? "More info: "+qp.error_uri : "");
            }
  
            oauth2.errCb({
                authId: oauth2.auth.name,
                source: "auth",
                level: "error",
                message: oauthErrorMsg || "[Authorization failed]: no accessCode received from the server"
            });
        }
    } else {
        oauth2.callback({auth: oauth2.auth, token: qp, isValid: isValid, redirectUrl: redirectUrl});
    }
    window.close();
  }