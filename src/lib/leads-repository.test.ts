import { describe, expect, it, vi } from 'vitest'
import type PocketBase from 'pocketbase'
import { getOpportunityLeads } from './leads-repository'

function createMockPb(getFullList: ReturnType<typeof vi.fn>) {
  return {
    collection: vi.fn(() => ({ getFullList })),
  } as unknown as PocketBase
}

describe('getOpportunityLeads', () => {
  it('retorna apenas leads sem_site e quebrado, usando o filtro correto no SDK', async () => {
    const leads = [
      { id: '1', siteStatus: 'sem_site' },
      { id: '2', siteStatus: 'quebrado' },
    ]
    const getFullList = vi.fn().mockResolvedValue(leads)
    const pb = createMockPb(getFullList)

    const result = await getOpportunityLeads(pb)

    expect(result).toEqual(leads)
    expect(pb.collection).toHaveBeenCalledWith('leads')
    expect(getFullList).toHaveBeenCalledWith({
      filter: 'siteStatus = "sem_site" || siteStatus = "quebrado"',
    })
  })

  it('retorna array vazio quando não há leads de oportunidade', async () => {
    const getFullList = vi.fn().mockResolvedValue([])
    const pb = createMockPb(getFullList)

    const result = await getOpportunityLeads(pb)

    expect(result).toEqual([])
  })

  it('propaga o erro quando o SDK rejeita (erro de conexão)', async () => {
    const getFullList = vi.fn().mockRejectedValue(new Error('network error'))
    const pb = createMockPb(getFullList)

    await expect(getOpportunityLeads(pb)).rejects.toThrow('network error')
  })
})
