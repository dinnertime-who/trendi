import { Injectable } from "@nestjs/common";

@Injectable()
export class EmailAuthService {
  // TODO: 이메일, 비밀번호로 회원가입
  // 메서드명: register(dto: RegisterDto): Promise<RegisterResponse>
  //
  // [입력]
  // - RegisterDto: { email: string, password: string, name: string, username: string, phoneNumber?: string }
  //
  // [처리 흐름]
  // 1. 입력 검증
  //    - 이메일 형식 검증 (@IsEmail)
  //    - 비밀번호 최소 길이 검증 (8자 이상, @MinLength(8))
  //    - username 중복 체크 (user 테이블)
  //    - email이 이미 account 테이블에 존재하는지 확인
  //
  // 2. 비밀번호 해싱
  //    - bcrypt.hash(password, 10) 사용
  //    - salt rounds: 10
  //
  // 3. 트랜잭션 시작 (user + account 동시 생성)
  //    a. user 테이블 삽입
  //       - id: cuid() 자동 생성
  //       - name, username, email, phoneNumber
  //       - role: UserRole.USER (기본값)
  //       - status: UserStatus.PROCESSING (기본값, 이메일 인증 전)
  //       - createdAt, updatedAt 자동 생성
  //
  //    b. account 테이블 삽입
  //       - id: cuid() 자동 생성
  //       - accountId: email 값 사용
  //       - providerId: AccountProvider.EMAIL
  //       - email: 입력받은 email
  //       - userId: 방금 생성한 user.id 참조
  //       - password: 해싱된 비밀번호
  //       - accessToken, refreshToken: null (소셜 로그인 전용)
  //       - createdAt, updatedAt 자동 생성
  //
  // 4. 트랜잭션 커밋
  //
  // [에러 처리]
  // - 중복 이메일: ConflictException('이미 사용 중인 이메일입니다')
  // - 중복 username: ConflictException('이미 사용 중인 사용자명입니다')
  // - DB 오류: InternalServerErrorException('회원가입 중 오류가 발생했습니다')
  //
  // [반환값]
  // RegisterResponse: {
  //   success: true,
  //   data: {
  //     id: string,
  //     email: string,
  //     name: string,
  //     username: string,
  //     status: UserStatus.PROCESSING
  //   }
  // }
  //
  // [후속 작업]
  // - 이메일 인증 링크 발송 (선택, MVP에서는 제외)
  // - 가입 환영 이메일 (선택, MVP에서는 제외)
  //
  // TODO: 이메일, 비밀번호로 로그인
  // 메서드명: login(dto: LoginDto, req: Request): Promise<LoginResponse>
  //
  // [입력]
  // - LoginDto: { email: string, password: string }
  // - req: Request (IP 주소, User Agent 추출용)
  //
  // [처리 흐름]
  // 1. 입력 검증
  //    - 이메일 형식 검증 (@IsEmail)
  //    - 비밀번호 존재 여부 확인
  //
  // 2. 사용자 조회
  //    - account 테이블에서 email로 조회
  //      WHERE accountId = dto.email AND providerId = 'EMAIL'
  //    - user 테이블 조인하여 사용자 정보 함께 가져오기
  //
  // 3. 검증
  //    - 사용자 존재 여부 확인
  //    - 비밀번호 일치 확인: bcrypt.compare(dto.password, account.password)
  //    - 계정 상태 확인 (status가 CANCELLED이면 로그인 불가)
  //
  // 4. JWT 토큰 생성
  //    - Payload: { sub: user.id, email: user.email, role: user.role }
  //    - accessToken: 15분 만료 (JWT_EXPIRES_IN)
  //    - refreshToken: 7일 만료 (REFRESH_TOKEN_EXPIRES_IN)
  //
  // 5. 세션 생성
  //    - session 테이블 삽입
  //      * id: cuid() 자동 생성
  //      * token: accessToken 값
  //      * expiresAt: 현재 시간 + 15분
  //      * userId: user.id
  //      * accountId: account.id
  //      * ipAddress: req.ip
  //      * userAgent: req.headers['user-agent']
  //      * createdAt, updatedAt 자동 생성
  //
  // 6. 마지막 로그인 시간 업데이트 (선택)
  //    - user.updatedAt 갱신
  //
  // [에러 처리]
  // - 사용자 없음: UnauthorizedException('이메일 또는 비밀번호가 올바르지 않습니다')
  // - 비밀번호 불일치: UnauthorizedException('이메일 또는 비밀번호가 올바르지 않습니다')
  // - 계정 취소됨: ForbiddenException('탈퇴한 계정입니다')
  // - DB 오류: InternalServerErrorException('로그인 중 오류가 발생했습니다')
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
  //   }
  // }
  //
  // [보안 고려사항]
  // - 비밀번호 틀림/사용자 없음 메시지를 동일하게 처리 (타이밍 공격 방지)
  // - 로그인 실패 횟수 제한 (선택, Redis 사용)
  // - HTTPS 필수 (프로덕션)
  //
  // TODO: 로그아웃
  // 메서드명: logout(userId: string, token: string): Promise<LogoutResponse>
  //
  // [입력]
  // - userId: string (JWT에서 추출한 사용자 ID)
  // - token: string (요청 헤더의 Authorization Bearer 토큰)
  //
  // [처리 흐름]
  // 1. 세션 조회
  //    - session 테이블에서 userId와 token으로 조회
  //      WHERE userId = userId AND token = token
  //
  // 2. 세션 삭제
  //    - 해당 세션 레코드 삭제 (hard delete)
  //    - 또는 expiresAt을 현재 시간으로 설정 (soft expire)
  //
  // 3. 토큰 블랙리스트 추가 (선택, Redis 사용)
  //    - Redis에 token을 키로 저장
  //    - TTL: 토큰 만료 시간까지
  //    - 값: { userId, logoutAt: timestamp }
  //
  // [에러 처리]
  // - 세션 없음: NotFoundException('세션을 찾을 수 없습니다')
  // - DB 오류: InternalServerErrorException('로그아웃 중 오류가 발생했습니다')
  //
  // [반환값]
  // LogoutResponse: {
  //   success: true,
  //   message: '로그아웃되었습니다'
  // }
  //
  // [추가 옵션]
  // - 모든 디바이스 로그아웃: logoutAll(userId: string)
  //   * 해당 userId의 모든 세션 삭제
  //   * WHERE userId = userId
  //
  // - 특정 세션만 로그아웃: logoutSession(sessionId: string)
  //   * 세션 ID로 특정 세션만 삭제
  //   * 다중 디바이스 로그인 관리용
  //
}
