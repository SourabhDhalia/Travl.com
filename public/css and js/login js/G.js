import React from 'react';

function G(){
    return(
        <div className="App">
        <div className="col-md-6 offset-md-3 text-center">
     <h1>HI goog</h1>
              <GoogleLogin
    clientId="810815498953-0vdj4up0bmd2rao9sfjcof3cvgjatrcr.apps.googleusercontent.com"
    buttonText="G"
    onSuccess={responseGoogle}
    onFailure={responseGoogle}
    cookiePolicy={'single_host_origin'}
  />,
        </div>
        </div>

    );
}