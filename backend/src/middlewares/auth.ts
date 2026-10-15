import type { Request, Response, NextFunction } from "express";
import type { AuthUser } from "../models/model_list";
import type { Resource, Action } from "../services/rbac";
import { canAccess } from "../services/rbac";
import { decodeSession } from "../services/jwt";

export function requireAuth(req: Request, res: Response, next: NextFunction): void {
  const [scheme, token] = (req.headers.authorization ?? "").split(" ");

  if (scheme !== "Bearer" || !token) {
    res.status(401).json({ message: "Missing or malformed Authorization header" });
    return;
  }

  const result = decodeSession(token);

  if (result.type === "expired") {
    res.status(401).json({ message: "Token expired" });
    return;
  }
  if (result.type === "invalid_tokens") {
    res.status(401).json({ message: "Invalid token" });
    return;
  }

  const { userId, username, role } = result.session;
  req.authUser = { userId, username, role };
  next();
}

export function requireRole(...roles: AuthUser["role"][]) {
  return (req: Request, res: Response, next: NextFunction): void => {
    if (!req.authUser) {
      res.status(401).json({ message: "Not authenticated" });
      return;
    }
    if (!roles.includes(req.authUser.role)) {
      res.status(403).json({ message: "Insufficient permissions" });
      return;
    }
    next();
  };
}

export function requirePermission(resource: Resource, action: Action) {
  return (req: Request, res: Response, next: NextFunction): void => {
    if (!req.authUser) {
      res.status(401).json({ message: "Not authenticated" });
      return;
    }
    if (!canAccess(req.authUser.role, resource, action)) {
      res.status(403).json({ message: "Insufficient permissions" });
      return;
    }

    next();
  }
}