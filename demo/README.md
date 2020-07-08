# PEng GDPR Tracing Demo

## Install
1. Clone the repo
2. Make sure Node is installed
3. Run `npm install`

## Running the demo
1. Make sure [zipkin]() in running in the background.
    - `docker run -d -p 9411:9411 openzipkin/zipkin`
    - then open http://localhost:9411

2. `npm start` starts concurrently some servers and web-clients (that are actually express servers with static frontends)
    - `client-x` run on ports 3000, 3001, 3002...
    - `server-x` run on ports 8080, 8081, 8082... 

3. Try calling some API functions from the clients using button provided on the webpages:
    - The client will forward the API call to the server (server-1, the first server)
    - If the API call path is of the form `/api/profile/*`, the `server-1` will respond (it's the **user profile server**)
    - If the API call has any other form (such as `/api/sleepdata/*`), the `server-1` will forward the request to `server-2`
    - If the API call path is of the form `/api/sleepdata/*`, the `server-2` will respond (it's the **sleep data server**)

4. The logic described here may be extended in various ways. 
    - Create other clients, that may simulate different applications (web application, native mobile application etc.)
    - Create other servers, that may be located in a certain physical place, in order to comply with the regulations and then forward the requests (for example from `server-1`) to different servers based on the request's `gdpr.location` header. 
