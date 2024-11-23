export interface UserInfo {
  id: number;
  username: string;
  nickName: string;
  userType: string;
  email: string;
  phonenumber: string;
  sex: string;
  avatar: string;
  loginIp: string;
  loginDate: number;
  createTime: number;
  updateTime: number;
}

export class LoginUserVo {
  userInfo: UserInfo;
  accessToken: string;
  refreshToken: string;
}