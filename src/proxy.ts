import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";

export default createMiddleware(routing);

export const config = {
  // Exclude Next internals, files, the Sanity Studio and its API routes.
  matcher: ["/((?!_next|_vercel|studio|api|.*\\..*).*)"],
};
