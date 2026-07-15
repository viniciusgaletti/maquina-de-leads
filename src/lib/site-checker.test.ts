import { describe, expect, it, vi, beforeEach, afterEach } from 'vitest'
import { checkSiteStatus } from './site-checker'

describe('checkSiteStatus', () => {
  beforeEach(() => {
    vi.stubGlobal('fetch', vi.fn())
  })

  afterEach(() => {
    vi.unstubAllGlobals()
    vi.restoreAllMocks()
  })

  it('retorna "sem_site" e não chama fetch quando url é undefined', async () => {
    const result = await checkSiteStatus(undefined)

    expect(result).toBe('sem_site')
    expect(fetch).not.toHaveBeenCalled()
  })

  it('retorna "ok" quando HEAD responde 200', async () => {
    vi.mocked(fetch).mockResolvedValueOnce(new Response(null, { status: 200 }))

    const result = await checkSiteStatus('https://exemplo.com')

    expect(result).toBe('ok')
  })

  it('retorna "quebrado" quando HEAD responde 404', async () => {
    vi.mocked(fetch).mockResolvedValueOnce(new Response(null, { status: 404 }))

    const result = await checkSiteStatus('https://exemplo.com')

    expect(result).toBe('quebrado')
  })

  it('retorna "quebrado" quando HEAD responde 500', async () => {
    vi.mocked(fetch).mockResolvedValueOnce(new Response(null, { status: 500 }))

    const result = await checkSiteStatus('https://exemplo.com')

    expect(result).toBe('quebrado')
  })

  it('retorna "ok" quando HEAD responde 405 e GET responde 200 (fallback)', async () => {
    vi.mocked(fetch)
      .mockResolvedValueOnce(new Response(null, { status: 405 }))
      .mockResolvedValueOnce(new Response(null, { status: 200 }))

    const result = await checkSiteStatus('https://exemplo.com')

    expect(result).toBe('ok')
    expect(fetch).toHaveBeenCalledTimes(2)
    expect(vi.mocked(fetch).mock.calls[0]?.[1]?.method).toBe('HEAD')
    expect(vi.mocked(fetch).mock.calls[1]?.[1]?.method).toBe('GET')
  })

  it('retorna "quebrado" quando a requisição estoura o timeout de 8s', async () => {
    vi.mocked(fetch).mockImplementationOnce((_url, init) => {
      return new Promise((_resolve, reject) => {
        const signal = (init as RequestInit)?.signal
        signal?.addEventListener('abort', () => {
          reject(new DOMException('The operation timed out.', 'TimeoutError'))
        })
      })
    })

    const promise = checkSiteStatus('https://exemplo.com')

    await expect(promise).resolves.toBe('quebrado')
  }, 10000)

  it('retorna "quebrado" quando fetch rejeita com TypeError (domínio inválido)', async () => {
    vi.mocked(fetch).mockRejectedValueOnce(new TypeError('Failed to fetch'))

    const result = await checkSiteStatus('https://dominio-invalido-xyz.test')

    expect(result).toBe('quebrado')
  })

  it('retorna "ok" quando a url redireciona (30x) para página que responde 200', async () => {
    vi.mocked(fetch).mockResolvedValueOnce(new Response(null, { status: 301 }))

    const result = await checkSiteStatus('https://exemplo.com/antiga')

    expect(result).toBe('ok')
  })
})
