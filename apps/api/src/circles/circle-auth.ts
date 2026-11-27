import {
  type CanActivate,
  createParamDecorator,
  type ExecutionContext,
  ForbiddenException,
  Injectable,
  SetMetadata,
  UnauthorizedException,
} from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { InjectRepository } from "@nestjs/typeorm";
import type { Request } from "express";
import { Repository } from "typeorm";
import { AuthService } from "../auth/auth.service";
import { resolveAccessToken } from "../auth/resolve-access-token";
import { ChildProfileEntity } from "../database/entities";
import { isChildSessionToken, sha256Hex } from "./circle-tokens";

/**
 * Who is calling a circles endpoint: a signed-in user (existing JWT session,
 * guest or linked) or a scoped child session (D7: no email, no password —
 * a device linked by QR that can only write its own salah status and read its
 * own signals).
 */
export type CircleActor =
  | { kind: "user"; userId: string; accountType: "guest" | "user" }
  | { kind: "child"; childId: string; circleId: string };

export function actorMemberId(actor: CircleActor): string {
  return actor.kind === "user" ? actor.userId : actor.childId;
}

type RequestWithActor = Request & { circleActor?: CircleActor };

const ALLOW_CHILD_SESSION = "circles:allowChildSession";

/** Opt an endpoint in to scoped child sessions (default: users only). */
export const AllowChildSession = () => SetMetadata(ALLOW_CHILD_SESSION, true);

/** The actor resolved by `CircleAuthGuard`. */
export const CurrentCircleActor = createParamDecorator(
  (_data: unknown, context: ExecutionContext): CircleActor => {
    const actor = context.switchToHttp().getRequest<RequestWithActor>().circleActor;
    if (!actor) throw new UnauthorizedException("Missing circle session");
    return actor;
  },
);

@Injectable()
export class CircleActorService {
  constructor(
    private readonly authService: AuthService,
    @InjectRepository(ChildProfileEntity)
    private readonly children: Repository<ChildProfileEntity>,
  ) {}

  async resolve(token: string, allowChild: boolean): Promise<CircleActor> {
    if (isChildSessionToken(token)) {
      if (!allowChild) throw new ForbiddenException("Not available in a child session");
      const child = await this.resolveChildToken(token);
      return { kind: "child", childId: child.id, circleId: child.circleId };
    }
    const user = await this.authService.getCurrentUser(token);
    return { kind: "user", userId: user.userId, accountType: user.accountType };
  }

  /** Child-session token → profile, or 401 (revoked / unknown). */
  async resolveChildToken(token: string): Promise<ChildProfileEntity> {
    const child = await this.children.findOne({
      where: { deviceTokenHash: sha256Hex(token) },
    });
    if (!child) throw new UnauthorizedException("Child session revoked or unknown");
    return child;
  }
}

/** Resolves the caller once per request and attaches it for `@CurrentCircleActor()`. */
@Injectable()
export class CircleAuthGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly actors: CircleActorService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<RequestWithActor>();
    const allowChild =
      this.reflector.getAllAndOverride<boolean>(ALLOW_CHILD_SESSION, [
        context.getHandler(),
        context.getClass(),
      ]) === true;
    const header = request.headers.authorization;
    const token = resolveAccessToken(request, typeof header === "string" ? header : undefined);
    request.circleActor = await this.actors.resolve(token, allowChild);
    return true;
  }
}
