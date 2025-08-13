// 1-1 핸드폰 인증번호 요청 바디값
export interface RequestOtpBody {
  phoneNumber: string;
}

// 1-1핸드폰 인증번호 요청 응답값
export interface RequestOtpResponse {
  message: string;
}

// 1-2 핸드폰 인증번호 전송 바디값
export interface VerifyOtpBody {
  phoneNumber: string;
  otp: string;
}
//1-2 핸드폰 인증번호 전송 응답값
export interface VerifyOtpResponse {
  signupToken: string;
  accessToken: string;
}
