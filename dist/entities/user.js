"use strict";
// export interface ICreateUser {
//        username: string;
//        password: string;
//        role: UserRole;
//        email: string;
//        registeredAt: Date; }
Object.defineProperty(exports, "__esModule", { value: true });
//        export interface IUser extends
//        ICreateUser {   userId: string; }
//        enum Role {   CUSTOMER = "CUSTOMER",   COMPANY = "COMPANY", }
//         // console.log(typeof Role);  export type UserRole = keyof typeof Role;
//  export function mapRole(role: Role): UserRole {   return role; }
var Gender;
(function (Gender) {
    Gender["FEMALE"] = "FEMALE";
    Gender["MALE"] = "MALE";
    Gender["LGBTQ"] = "LGBTQIA+";
    Gender["PREFERNOTTOSAY"] = "PREFER NOT TO SAY";
})(Gender || (Gender = {}));
//# sourceMappingURL=user.js.map