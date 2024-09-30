import { draftMode } from 'next/headers'
import React, { use } from 'react'

import { AdminBarClient } from './index.client'

export function AdminBar() {
  const { isEnabled: isPreviewMode } = use(draftMode())

  return (
    <AdminBarClient
      // id={page?.id} // TODO: is there any way to do this?!
      collection="pages"
      preview={isPreviewMode}
    />
  )
}
