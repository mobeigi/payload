import { cookies as getCookies } from 'next/headers'
import React, { use } from 'react'

import { TenantSelector } from './index.client'

export const TenantSelectorRSC = () => {
  const cookies = use(getCookies())
  return <TenantSelector initialCookie={cookies.get('payload-tenant')?.value} />
}
