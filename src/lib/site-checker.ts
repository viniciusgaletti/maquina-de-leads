export type SiteStatus = 'sem_site' | 'quebrado' | 'ok'

const TIMEOUT_MS = 8000

function isSuccess(status: number): boolean {
  return (status >= 200 && status < 300) || (status >= 300 && status < 400)
}

export async function checkSiteStatus(url: string | undefined): Promise<SiteStatus> {
  if (!url) {
    return 'sem_site'
  }

  try {
    let res = await fetch(url, { method: 'HEAD', signal: AbortSignal.timeout(TIMEOUT_MS) })

    if (res.status === 405) {
      res = await fetch(url, { method: 'GET', signal: AbortSignal.timeout(TIMEOUT_MS) })
    }

    return isSuccess(res.status) ? 'ok' : 'quebrado'
  } catch {
    return 'quebrado'
  }
}
