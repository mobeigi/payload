import type { Metadata } from 'next'

import { draftMode } from 'next/headers'
import { notFound } from 'next/navigation'
import React from 'react'

import type { Product, Product as ProductType } from '../../../../payload/payload-types'

import { fetchDoc } from '../../../_api/fetchDoc'
import { fetchDocs } from '../../../_api/fetchDocs'
import { Blocks } from '../../../_components/Blocks'
import { PaywallBlocks } from '../../../_components/PaywallBlocks'
import { ProductHero } from '../../../_heros/Product'
import { generateMeta } from '../../../_utilities/generateMeta'

// Force this page to be dynamic so that Next.js does not cache it
// See the note in '../../../[slug]/page.tsx' about this
export const dynamic = 'force-dynamic'

export default async function Product({ params: { slug } }) {
  const { isEnabled: isDraftMode } = await draftMode()

  let product: Product | null = null

  try {
    product = await fetchDoc<Product>({
      slug,
      collection: 'products',
      draft: isDraftMode,
    })
  } catch (error) {
    console.error(error) // eslint-disable-line no-console
  }

  if (!product) {
    notFound()
  }

  const { layout, relatedProducts } = product

  return (
    <React.Fragment>
      <ProductHero product={product} />
      <Blocks blocks={layout} />
      {product?.enablePaywall && <PaywallBlocks disableTopPadding productSlug={slug as string} />}
      <Blocks
        blocks={[
          {
            blockName: 'Related Product',
            blockType: 'relatedProducts',
            docs: relatedProducts,
            introContent: [
              {
                type: 'h4',
                children: [
                  {
                    text: 'Related Products',
                  },
                ],
              },
              {
                type: 'p',
                children: [
                  {
                    text: 'The products displayed here are individually selected for this page. Admins can select any number of related products to display here and the layout will adjust accordingly. Alternatively, you could swap this out for the "Archive" block to automatically populate products by category complete with pagination. To manage related posts, ',
                  },
                  {
                    type: 'link',
                    children: [
                      {
                        text: 'navigate to the admin dashboard',
                      },
                    ],
                    url: `/admin/collections/products/${product.id}`,
                  },
                  {
                    text: '.',
                  },
                ],
              },
            ],
            relationTo: 'products',
          },
        ]}
        disableTopPadding
      />
    </React.Fragment>
  )
}

export async function generateStaticParams() {
  try {
    const products = await fetchDocs<ProductType>('products')
    return products?.map(({ slug }) => slug)
  } catch (error) {
    return []
  }
}

export async function generateMetadata({ params: { slug } }): Promise<Metadata> {
  const { isEnabled: isDraftMode } = draftMode()

  let product: Product | null = null

  try {
    product = await fetchDoc<Product>({
      slug,
      collection: 'products',
      draft: isDraftMode,
    })
  } catch (error) {}

  return generateMeta({ doc: product })
}
