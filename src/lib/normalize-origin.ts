/**
 * normalize allowed origins string set
 * @param {any} allowedOrigins
 * @returns
 */
const normalizeOrigins = (lineDelimetedAllowedOrigins: string) => {
  const allowedOrigins = lineDelimetedAllowedOrigins.split('\n')
  if (!Array.isArray(allowedOrigins) || 0 === allowedOrigins.length) {
    return [];
  }
  const filteredOrigins = allowedOrigins.reduce<Set<string>>((prev, rawOrigin) => {
    const urlPattern = /^(?<protocol>https?):\/\/(?<hostAndPort>[^/]+)(?<directory>(\/.*)?(\?.*)?(#.*)?)$/g
    if (rawOrigin && 'string' === typeof rawOrigin) {
      const origin = rawOrigin.trim()
      if ('*' === origin) {
        prev.add(origin);
      } else {
        try {
          const { groups: { protocol, hostAndPort, directory } } = (urlPattern.exec(origin) || {}) as { groups: { protocol: any, hostAndPort: any, directory: any } }
          if (protocol && hostAndPort) {
            let origin = `${protocol}://${hostAndPort}`;
            if (directory && '/' !== directory) {
              origin += directory
            }
            prev.add(origin);
          }
        } catch (_e) {
          // skip invalid URL
        }
      }
    }
    return prev;
  }, new Set([]));

  if (0 < filteredOrigins.size) {
    return Array.from(filteredOrigins);
  } else {
    return [];
  }
};

export default normalizeOrigins;
