import "server-only";

export default function Template(magicLink) {
  return `<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
  <html dir="ltr" lang="en">
    <head>
      <meta content="text/html; charset=UTF-8" http-equiv="Content-Type" />
      <meta name="x-apple-disable-message-reformatting" />
    </head>
  
    <body style="background-color:#ffffff">
      <table align="center" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="max-width:37.5em;padding-left:12px;padding-right:12px;margin:0 auto">
        <tbody>
          <tr style="width:100%">
            <td>
              <h1 style="color:#333;font-family:-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif;font-size:24px;font-weight:bold;margin:40px 0;padding:0">
                Admin Randomlandia
              </h1>
              <a href="${magicLink}" style="color:#2754C5;text-decoration:underline;font-family:-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif;font-size:14px;display:block;margin-bottom:16px" target="_blank">
                Click here to log in with this magic link
              </a>
            </td>
          </tr>
        </tbody>
      </table>
    </body>
  </html>
  `;
}
