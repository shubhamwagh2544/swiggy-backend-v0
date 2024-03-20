import { auth } from "express-oauth2-jwt-bearer";

export const jwtCheck = auth({
    audience: "swiggy-api",
    issuerBaseURL: "https://dev-26pvwwybpf61vcgj.us.auth0.com/",
    tokenSigningAlg: 'RS256'
});