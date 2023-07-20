enum Gender {
  FEMALE = "FEMALE",
  MALE = "MALE",
  LGBTQ = "LGBTQIA+",
  PREFERNOTTOSAY = "PREFER NOT TO SAY",
}

// enum Role {
//   USER = "USER",
//   ADMIN = "ADMIN",
// }

export interface ICreateUser {
  username: string;
  password: string;
  firstname: string;
  lastname: string;
  email: string;
  gender: UserGender;
}

export interface IUser extends ICreateUser {
  id: string;
  registeredAt: Date;
}

// export type UserRole = keyof typeof Role;

// export function mapRole(role: Role): UserRole {
//   return role;
// }

export type UserGender = keyof typeof Gender;

// export function mapGender(gender: Gender): UserGender {
//   return gender;
// }

// Remove field password
export interface IUserDto extends Omit<IUser, "password"> {}
