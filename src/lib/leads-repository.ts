import type PocketBase from 'pocketbase'
import type { SiteStatus } from './site-checker'

export interface Lead {
  id: string
  name: string
  address: string
  websiteUrl?: string
  siteStatus: SiteStatus | 'pendente'
  lastCheckedAt?: string
}

const OPPORTUNITY_FILTER = 'siteStatus = "sem_site" || siteStatus = "quebrado"'

export async function getOpportunityLeads(pb: PocketBase): Promise<Lead[]> {
  return pb.collection('leads').getFullList<Lead>({
    filter: OPPORTUNITY_FILTER,
  })
}
