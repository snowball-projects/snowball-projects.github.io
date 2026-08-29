export function isSafeHttpsUrl(value: string): boolean {
  try {
    const url = new URL(value);
    return (
      url.protocol === "https:" && url.username === "" && url.password === ""
    );
  } catch {
    return false;
  }
}

export function isGitHubRepositoryUrl(value: string): boolean {
  if (!isSafeHttpsUrl(value)) {
    return false;
  }

  const url = new URL(value);
  const pathSegments = url.pathname.split("/").filter(Boolean);

  return (
    url.hostname === "github.com" &&
    url.port === "" &&
    url.search === "" &&
    url.hash === "" &&
    pathSegments.length === 2 &&
    pathSegments.every((segment) => /^[A-Za-z0-9_.-]+$/.test(segment)) &&
    !pathSegments[1].endsWith(".git")
  );
}
