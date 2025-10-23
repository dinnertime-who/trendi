import { Injectable } from "@nestjs/common";

@Injectable()
export class OauthService {
  // TODO: 소셜 로그인 인증 URL 생성
  // 메서드명: getAuthorizationUrl(provider: AccountProvider, state?: string): Promise<string>
  //
  // [입력]
  // - provider: AccountProvider ('GOOGLE' | 'NAVER' | 'KAKAO')
  // - state: string (선택, CSRF 방지용 랜덤 문자열)
  //
  // [처리 흐름]
  // 1. Provider별 OAuth 설정 가져오기
  //    - 환경 변수에서 CLIENT_ID, CLIENT_SECRET, REDIRECT_URI 로드
  //    - GOOGLE: process.env.GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, GOOGLE_REDIRECT_URI
  //    - NAVER: process.env.NAVER_CLIENT_ID, NAVER_CLIENT_SECRET, NAVER_REDIRECT_URI
  //    - KAKAO: process.env.KAKAO_CLIENT_ID, KAKAO_REDIRECT_URI (REST API 키 사용)
  //
  // 2. State 값 생성 (제공되지 않은 경우)
  //    - crypto.randomBytes(32).toString('hex')
  //    - Redis에 저장 (키: `oauth:state:${state}`, TTL: 5분)
  //    - 값: { provider, createdAt: timestamp }
  //
  // 3. Provider별 인증 URL 생성
  //    Google:
  //    - Base URL: https://accounts.google.com/o/oauth2/v2/auth
  //    - Query params:
  //      * client_id: GOOGLE_CLIENT_ID
  //      * redirect_uri: GOOGLE_REDIRECT_URI
  //      * response_type: code
  //      * scope: openid email profile
  //      * state: state 값
  //      * access_type: offline (refresh token 받기 위해)
  //
  //    Naver:
  //    - Base URL: https://nid.naver.com/oauth2.0/authorize
  //    - Query params:
  //      * client_id: NAVER_CLIENT_ID
  //      * redirect_uri: NAVER_REDIRECT_URI
  //      * response_type: code
  //      * state: state 값
  //
  //    Kakao:
  //    - Base URL: https://kauth.kakao.com/oauth/authorize
  //    - Query params:
  //      * client_id: KAKAO_CLIENT_ID (REST API 키)
  //      * redirect_uri: KAKAO_REDIRECT_URI
  //      * response_type: code
  //      * state: state 값
  //
  // [에러 처리]
  // - 지원하지 않는 provider: BadRequestException('지원하지 않는 소셜 로그인입니다')
  // - 환경 변수 누락: InternalServerErrorException('소셜 로그인 설정이 올바르지 않습니다')
  //
  // [반환값]
  // string: 인증 URL (사용자를 리다이렉트할 URL)
  //
  // [사용 예시]
  // 프론트엔드에서 "구글로 로그인" 버튼 클릭 시:
  // 1. GET /auth/oauth/google/url 호출
  // 2. 반환된 URL로 window.location.href = url 실행
  // 3. 사용자가 소셜 로그인 동의 후 REDIRECT_URI로 돌아옴
  //
  // TODO: 소셜 로그인 콜백 처리
  // 메서드명: handleCallback(provider: AccountProvider, code: string, state: string): Promise<LoginResponse>
  //
  // [입력]
  // - provider: AccountProvider ('GOOGLE' | 'NAVER' | 'KAKAO')
  // - code: string (OAuth provider가 반환한 authorization code)
  // - state: string (CSRF 검증용)
  //
  // [처리 흐름]
  // 1. State 검증
  //    - Redis에서 `oauth:state:${state}` 조회
  //    - 존재하지 않거나 만료됨: UnauthorizedException('유효하지 않은 요청입니다')
  //    - provider가 일치하는지 확인
  //    - 검증 후 Redis에서 state 삭제
  //
  // 2. Authorization Code를 Access Token으로 교환
  //    Google:
  //    - POST https://oauth2.googleapis.com/token
  //    - Body: {
  //        code,
  //        client_id: GOOGLE_CLIENT_ID,
  //        client_secret: GOOGLE_CLIENT_SECRET,
  //        redirect_uri: GOOGLE_REDIRECT_URI,
  //        grant_type: 'authorization_code'
  //      }
  //    - 응답: { access_token, refresh_token, expires_in, id_token }
  //
  //    Naver:
  //    - POST https://nid.naver.com/oauth2.0/token
  //    - Query: client_id, client_secret, grant_type=authorization_code, code
  //    - 응답: { access_token, refresh_token, expires_in }
  //
  //    Kakao:
  //    - POST https://kauth.kakao.com/oauth/token
  //    - Body: {
  //        grant_type: 'authorization_code',
  //        client_id: KAKAO_CLIENT_ID,
  //        redirect_uri: KAKAO_REDIRECT_URI,
  //        code
  //      }
  //    - 응답: { access_token, refresh_token, expires_in }
  //
  // 3. Access Token으로 사용자 정보 조회
  //    Google:
  //    - GET https://www.googleapis.com/oauth2/v2/userinfo
  //    - Header: Authorization: Bearer {access_token}
  //    - 응답: { id, email, name, picture }
  //
  //    Naver:
  //    - GET https://openapi.naver.com/v1/nid/me
  //    - Header: Authorization: Bearer {access_token}
  //    - 응답: { response: { id, email, name, profile_image } }
  //
  //    Kakao:
  //    - GET https://kapi.kakao.com/v2/user/me
  //    - Header: Authorization: Bearer {access_token}
  //    - 응답: { id, kakao_account: { email, profile: { nickname, profile_image_url } } }
  //
  // 4. 사용자 확인 및 생성/업데이트 (트랜잭션)
  //    a. account 테이블에서 기존 계정 조회
  //       WHERE accountId = {소셜 ID} AND providerId = {provider}
  //
  //    b. 계정이 존재하는 경우:
  //       - account 테이블의 accessToken, refreshToken, expiresAt 업데이트
  //       - 이메일이 변경되었다면 account.email도 업데이트
  //       - user 테이블 조회 (userId로)
  //
  //    c. 계정이 없는 경우 (신규 가입):
  //       1) username 자동 생성
  //          - 소셜 이름에서 공백 제거 + 랜덤 숫자 4자리
  //          - 예: "홍길동" -> "홍길동1234"
  //          - 중복 체크 후 고유한 값 생성
  //
  //       2) user 테이블 삽입
  //          - id: cuid() 자동 생성
  //          - name: 소셜에서 받은 이름
  //          - username: 생성한 username
  //          - email: 소셜에서 받은 email
  //          - role: UserRole.USER
  //          - status: UserStatus.COMPLETED (소셜 로그인은 이메일 인증 생략)
  //
  //       3) account 테이블 삽입
  //          - id: cuid() 자동 생성
  //          - accountId: 소셜 ID (Google/Naver/Kakao의 고유 ID)
  //          - providerId: provider
  //          - email: 소셜에서 받은 email
  //          - userId: 방금 생성한 user.id
  //          - accessToken: 받은 access_token
  //          - refreshToken: 받은 refresh_token
  //          - accessTokenExpiresAt: 현재 시간 + expires_in
  //          - password: null (소셜 로그인은 비밀번호 없음)
  //
  // 5. JWT 토큰 생성
  //    - Payload: { sub: user.id, email: user.email, role: user.role }
  //    - accessToken: 15분 만료
  //    - refreshToken: 7일 만료
  //
  // 6. 세션 생성
  //    - session 테이블 삽입
  //      * token: 생성한 JWT accessToken
  //      * expiresAt: 현재 시간 + 15분
  //      * userId: user.id
  //      * accountId: account.id
  //      * ipAddress, userAgent
  //
  // [에러 처리]
  // - State 검증 실패: UnauthorizedException('유효하지 않은 요청입니다')
  // - 토큰 교환 실패: UnauthorizedException('소셜 로그인에 실패했습니다')
  // - 사용자 정보 조회 실패: InternalServerErrorException('사용자 정보를 가져올 수 없습니다')
  // - 이메일 없음: BadRequestException('이메일 제공 동의가 필요합니다')
  //
  // [반환값]
  // LoginResponse: {
  //   accessToken: string,
  //   refreshToken: string,
  //   user: {
  //     id: string,
  //     email: string,
  //     name: string,
  //     username: string,
  //     role: UserRole,
  //     status: UserStatus
  //   },
  //   isNewUser: boolean  // 신규 가입 여부 (프론트엔드에서 환영 메시지 표시용)
  // }
  //
  // [보안 고려사항]
  // - State는 반드시 검증 (CSRF 공격 방지)
  // - Access Token은 안전하게 저장 (DB에서만, 프론트엔드로 전달하지 않음)
  // - Refresh Token도 안전하게 저장
  // - 소셜 제공자의 토큰 만료 시간을 DB에 기록하여 자동 갱신 구현
  //
  // TODO: 소셜 로그인 토큰 갱신
  // 메서드명: refreshSocialToken(userId: string, provider: AccountProvider): Promise<RefreshTokenResponse>
  //
  // [입력]
  // - userId: string (현재 로그인한 사용자 ID)
  // - provider: AccountProvider ('GOOGLE' | 'NAVER' | 'KAKAO')
  //
  // [처리 흐름]
  // 1. account 테이블에서 소셜 계정 정보 조회
  //    WHERE userId = userId AND providerId = provider
  //
  // 2. Refresh Token 존재 여부 확인
  //    - refreshToken이 null이면: BadRequestException('갱신할 토큰이 없습니다')
  //
  // 3. Provider별 토큰 갱신 요청
  //    Google:
  //    - POST https://oauth2.googleapis.com/token
  //    - Body: {
  //        refresh_token: account.refreshToken,
  //        client_id: GOOGLE_CLIENT_ID,
  //        client_secret: GOOGLE_CLIENT_SECRET,
  //        grant_type: 'refresh_token'
  //      }
  //    - 응답: { access_token, expires_in } (새 refresh_token은 선택적)
  //
  //    Naver:
  //    - POST https://nid.naver.com/oauth2.0/token
  //    - Query: client_id, client_secret, grant_type=refresh_token, refresh_token
  //    - 응답: { access_token, expires_in } (새 refresh_token은 선택적)
  //
  //    Kakao:
  //    - POST https://kauth.kakao.com/oauth/token
  //    - Body: {
  //        grant_type: 'refresh_token',
  //        client_id: KAKAO_CLIENT_ID,
  //        refresh_token: account.refreshToken
  //      }
  //    - 응답: { access_token, expires_in, refresh_token }
  //
  // 4. account 테이블 업데이트
  //    - accessToken: 새로 받은 access_token
  //    - refreshToken: 새로 받은 refresh_token (있는 경우만)
  //    - accessTokenExpiresAt: 현재 시간 + expires_in
  //    - refreshTokenExpiresAt: 새 refresh_token이 있다면 현재 시간 + 60일 (Kakao)
  //    - updatedAt: 현재 시간
  //
  // [에러 처리]
  // - 계정 없음: NotFoundException('연동된 소셜 계정을 찾을 수 없습니다')
  // - Refresh Token 없음: BadRequestException('갱신할 토큰이 없습니다')
  // - 토큰 만료/무효: UnauthorizedException('소셜 로그인 재인증이 필요합니다')
  // - API 오류: InternalServerErrorException('토큰 갱신에 실패했습니다')
  //
  // [반환값]
  // RefreshTokenResponse: {
  //   success: true,
  //   message: '토큰이 갱신되었습니다',
  //   expiresAt: Date  // 새 토큰 만료 시간
  // }
  //
  // [사용 시나리오]
  // - 사용자가 소셜 프로필 정보 수정 시 (소셜 API 호출 전)
  // - 소셜 토큰 만료 임박 시 (자동 갱신 배치 작업)
  // - 외부 API 호출 시 401 에러 발생 후 재시도
  //
  // [자동 갱신 전략]
  // - Cron Job으로 매일 만료 3일 전 토큰들을 자동 갱신
  // - 또는 API 호출 시 만료 체크 후 필요시 갱신 (Lazy Refresh)
  //
  // TODO: 소셜 로그인 연동 해제
  // 메서드명: unlinkSocialAccount(userId: string, provider: AccountProvider): Promise<UnlinkResponse>
  //
  // [입력]
  // - userId: string (현재 로그인한 사용자 ID)
  // - provider: AccountProvider ('GOOGLE' | 'NAVER' | 'KAKAO')
  //
  // [처리 흐름]
  // 1. 사용자의 모든 계정 조회
  //    - account 테이블에서 userId로 모든 계정 가져오기
  //    - 계정 개수 확인
  //
  // 2. 안전성 검증
  //    - 계정이 1개뿐이면: BadRequestException('마지막 로그인 방법은 해제할 수 없습니다')
  //    - 최소 1개의 로그인 방법은 남아있어야 함
  //    - 이메일 로그인도 없고 소셜 1개만 있으면 해제 불가
  //
  // 3. Provider의 토큰 해지 (선택, Best Practice)
  //    Google:
  //    - POST https://oauth2.googleapis.com/revoke
  //    - Body: token={access_token}
  //    - 사용자의 앱 접근 권한 완전 해지
  //
  //    Naver:
  //    - POST https://nid.naver.com/oauth2.0/token
  //    - Query: grant_type=delete, client_id, client_secret, access_token
  //    - 앱 연동 해제
  //
  //    Kakao:
  //    - POST https://kapi.kakao.com/v1/user/unlink
  //    - Header: Authorization: Bearer {access_token}
  //    - 카카오 계정 연결 끊기
  //
  // 4. 데이터베이스 정리 (트랜잭션)
  //    a. session 테이블에서 해당 account의 세션 삭제
  //       DELETE FROM session WHERE accountId = account.id
  //
  //    b. account 테이블에서 계정 삭제
  //       DELETE FROM account WHERE userId = userId AND providerId = provider
  //
  // [에러 처리]
  // - 계정 없음: NotFoundException('연동된 소셜 계정을 찾을 수 없습니다')
  // - 마지막 계정: BadRequestException('마지막 로그인 방법은 해제할 수 없습니다')
  // - Provider API 오류: 로그 기록만 하고 계속 진행 (DB는 삭제)
  // - DB 오류: InternalServerErrorException('연동 해제 중 오류가 발생했습니다')
  //
  // [반환값]
  // UnlinkResponse: {
  //   success: true,
  //   message: '소셜 로그인 연동이 해제되었습니다',
  //   remainingAccounts: number  // 남은 로그인 방법 개수
  // }
  //
  // [사용 시나리오]
  // - 마이페이지 > 계정 설정 > 소셜 로그인 관리
  // - 사용자가 개인정보 보호를 위해 특정 소셜 연동 해제
  //
  // [주의사항]
  // - 해제 전 사용자에게 경고 메시지 표시 (프론트엔드)
  //   "이 소셜 로그인을 해제하시겠습니까? 다른 로그인 방법이 있는지 확인하세요."
  // - 마지막 로그인 방법 보호는 필수
  // - 해제 후에는 해당 소셜로 재로그인 시 새 계정으로 간주됨
  //
}
