// export interface ICreateUser {
//        username: string;
//        password: string;
//        role: UserRole;
//        email: string;
//        registeredAt: Date; }

//        export interface IUser extends
//        ICreateUser {   userId: string; }
//        enum Role {   CUSTOMER = "CUSTOMER",   COMPANY = "COMPANY", }
//         // console.log(typeof Role);  export type UserRole = keyof typeof Role;
//  export function mapRole(role: Role): UserRole {   return role; }

enum Gender {
  FEMALE = "FEMALE",
  MALE = "MALE",
  LGBTQ = "LGBTQIA+",
  PREFERNOTTOSAY = "PREFER NOT TO SAY",
}

enum Role {
  USER = "USER",
  ADMIN = "ADMIN",
}

export interface ICreateUser {
  username: string;
  password: string;
  firstname: string;
  lastname: string;
  email: string;
  gender: UserGender;
  role: UserRole;
}

export interface IUser extends ICreateUser {
  id: string;
  registeredAt: Date;
}

export type UserRole = keyof typeof Role;

// export function mapRole(role: Role): UserRole {
//   return role;
// }

export type UserGender = keyof typeof Gender;

// export function mapGender(gender: Gender): UserGender {
//   return gender;
// }

// Remove field password
export interface IUserDto extends Omit<IUser, "password"> {}
