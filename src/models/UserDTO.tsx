export interface LoginDTO {
  email: string;
  password: string;
}

export interface isLoggedDTO {
  user: {
    username: string;
    fullName: string;
    token: string;
    profile: string;
    isLogged: boolean;
    profileImage?: string;
  };
}
export interface RegisterDTO {
  username: string;
  fullName: string;
  password: string;
  profileImage?: any;
  confirmPassword?: string;
}


export interface UsersAdmDTO {
  userId: number;
  fullName: string;
  groups: string;
  email: string;
  image?: string;
}