import { DefaultSession } from "next-auth";

declare module "next-auth" {
    interface User {
        accessLevel: number
        id: number | string
    }

    interface Session extends DefaultSession {
        user?: User;
    }
}
declare module "next-auth/jwt" {
    interface JWT {
      accessLevel: number
      id: number | string
    }
}