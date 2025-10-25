import { AccountProvider, BcryptHashedSchema } from "@internal/schemas";
import { tryCatch } from "@internal/utils";
import { Injectable } from "@nestjs/common";
import { eq } from "drizzle-orm";
import { BcryptService } from "src/common/bcrypt/bcrypt.service";
import { DbService } from "src/common/db/db.service";
import { account, session, user } from "src/common/db/schema";
import { JwtService } from "src/common/jwt/services/jwt.service";
import { DuplicateEmailError, UserNotFoundError } from "../errors";
import {
  EmailSignInParams,
  EmailSignUpParams,
} from "../types/email-password.type";

@Injectable()
export class EmailPasswordService {
  constructor(
    private readonly db: DbService,
    private readonly jwtService: JwtService, //
    private readonly bcryptService: BcryptService,
  ) {}

  /*
   * 이메일 회원가입
   */
  async emailSignUp(params: EmailSignUpParams) {
    const { email, password, name, username, ip, userAgent } = params;

    // 이메일 중복확인
    const count = await this.db.drizzle.$count(
      account,
      eq(account.email, email),
    );
    if (count > 0) {
      throw new DuplicateEmailError("이미 존재하는 이메일입니다.");
    }

    // 비밀번호 해시화
    const hashedPassword = await this.bcryptService.hash(password);

    // 사용자 생성
    const newUserAndAccount = await this.db.drizzle.transaction(async (tx) => {
      const [newUser] = await tx
        .insert(user)
        .values({
          name,
          username,
          email,
        })
        .returning();

      const [newAccount] = await tx
        .insert(account)
        .values({
          userId: newUser.id,
          password: hashedPassword,
          accountId: email,
          providerId: AccountProvider.EMAIL,
          email,
        })
        .returning();

      return { user: newUser, account: newAccount };
    });

    const { accessToken, refreshToken } = this.jwtService.generateJwts({
      sub: newUserAndAccount.user.id,
      email: newUserAndAccount.user.email || email,
      role: newUserAndAccount.user.role,
      status: newUserAndAccount.user.status,
    });

    await this.db.drizzle.insert(session).values({
      userId: newUserAndAccount.user.id,
      accountId: newUserAndAccount.account.id,
      token: refreshToken.token,
      expiresAt: new Date(refreshToken.expiresIn),
      ipAddress: ip,
      userAgent,
    });

    return {
      accessToken: accessToken.token,
      refreshToken: refreshToken.token,
      expiresAt: new Date(accessToken.expiresIn),
    };
  }

  /*
   * 이메일 로그인
   */
  async emailSignIn(params: EmailSignInParams) {
    const { email, password, ip, userAgent } = params;

    const [accountInfo] = await this.db.drizzle
      .select({
        account: {
          id: account.id,
          accountId: account.accountId,
          providerId: account.providerId,
          password: account.password,
        },
        user: {
          id: user.id,
          email: user.email,
          role: user.role,
          status: user.status,
        },
      })
      .from(account)
      .leftJoin(user, eq(account.userId, user.id))
      .where(eq(account.accountId, email))
      .limit(1);

    if (!accountInfo || !accountInfo.user || !accountInfo.account) {
      throw new UserNotFoundError("사용자를 찾을 수 없습니다.");
    }

    const {
      data: isPasswordValid, //
      error: passwordError,
    } = await tryCatch(async () => {
      return await this.bcryptService.compare(
        password,
        BcryptHashedSchema.parse(accountInfo.account.password),
      );
    });

    if (passwordError) {
      throw new UserNotFoundError("비밀번호가 정상적으로 설정되지 않았습니다.");
    }
    if (!isPasswordValid) {
      throw new UserNotFoundError("비밀번호가 올바르지 않습니다.");
    }

    const { accessToken, refreshToken } = this.jwtService.generateJwts({
      sub: accountInfo.user.id,
      email: accountInfo.user.email || email,
      role: accountInfo.user.role,
      status: accountInfo.user.status,
    });

    await this.db.drizzle.insert(session).values({
      userId: accountInfo.user.id,
      accountId: accountInfo.account.id,
      token: refreshToken.token,
      expiresAt: new Date(refreshToken.expiresIn),
      ipAddress: ip,
      userAgent,
    });

    return {
      accessToken: accessToken.token,
      refreshToken: refreshToken.token,
      expiresAt: new Date(accessToken.expiresIn),
    };
  }
}
