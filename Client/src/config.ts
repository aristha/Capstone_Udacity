// TODO: Once your application is deployed, copy an API id here so that the frontend could interact with it
const apiId = 'wr2es4czbi'
export const apiEndpoint = `https://${apiId}.execute-api.us-east-1.amazonaws.com/dev`
// export const apiEndpoint = `http://localhost:3000/dev`
export const authConfig = {
  // TODO: Create an Auth0 application and copy values from it into this map. For example:
  // domain: 'dev-nd9990-p4.us.auth0.com',
  domain: 'dev-dh8lpj82.us.auth0.com',            // Auth0 domain
  clientId: 'iFQJ8xhzi1y97hUfv6h1JCV3i0sbceQS',          // Auth0 client id
  callbackUrl: 'http://localhost:3000/callback'
}
