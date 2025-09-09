import jwt from "jsonwebtoken";

export function signJwt() {
    return jwt.sign({}, process.env.JWT_SECRET!, { expiresIn: "5m" });
}
