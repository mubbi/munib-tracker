import { Injectable, UnauthorizedException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { JwtService, type JwtSignOptions } from "@nestjs/jwt";
import type { EnvironmentVariables } from "../config/env.schema";

export interface AccessTokenClaims {
  /** User id. */
  sub: string;
  /** Session id, so a session can be revoked server-side. */
  sid: string;
}

export interface SignedAccessToken {
  token: string;
  /** Seconds until expiry. */
  expiresIn: number;
}

@Injectable()
export class TokenService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService<EnvironmentVariables, true>,
  ) {}

  signAccessToken(userId: string, sessionId: string): SignedAccessToken {
    const expiresIn = this.configService.get("JWT_ACCESS_TTL", { infer: true });
    const token = this.jwtService.sign(
      { sub: userId, sid: sessionId } satisfies AccessTokenClaims,
      {
        expiresIn,
      } as JwtSignOptions,
    );
    const decoded = this.jwtService.decode(token) as { exp?: number; iat?: number } | null;
    const ttlSeconds =
      decoded?.exp && decoded.iat ? decoded.exp - decoded.iat : this.fallbackSeconds(expiresIn);
    return { token, expiresIn: ttlSeconds };
  }

  verifyAccessToken(token: string): AccessTokenClaims {
    try {
      const payload = this.jwtService.verify<AccessTokenClaims>(token);
      if (!payload.sub || !payload.sid) {
        throw new Error("missing claims");
      }
      return { sub: payload.sub, sid: payload.sid };
    } catch {
      throw new UnauthorizedException("Invalid or expired access token");
    }
  }

  private fallbackSeconds(ttl: string | undefined): number {
    const match = /^(\d+)([smhd])?$/.exec(ttl?.trim() ?? "");
    if (!match) return 900;
    const amount = Number(match[1]);
    const unit = match[2] ?? "s";
    const multipliers = { s: 1, m: 60, h: 3600, d: 86_400 } as const;
    return amount * multipliers[unit as keyof typeof multipliers];
  }
}
