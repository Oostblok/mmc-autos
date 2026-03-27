import { defineContentConfig, defineCollection, z } from '@nuxt/content'

export default defineContentConfig({
  collections: {
    content: defineCollection({
      type: 'page',
	    source: {
		    include: '**/*.md',
		    exclude: ['cars/**']
	    }
    }),
	  cars: defineCollection({
		  type: 'page',
		  source: 'cars/*.json',
		  schema: z.object({
			  id: z.string(),
			  slug: z.string(),
			  link: z.string().url(),
			  lazyImage: z.string().nullable(),
			  image: z.string().nullable(),
			  labels: z.array(z.string()).default([]),
			  title: z.string().nullable(),
			  make: z.string().nullable(),
			  model: z.string().nullable(),
			  type: z.string().nullable(),
			  price: z.string().nullable(),
			  exportPrice: z.string().nullable(),
			  year: z.string().nullable(),
			  fuelType: z.string().nullable(),
			  mileage: z.string().nullable(),
			  gearbox: z.string().nullable(),
			  images: z.array(z.string()).default([]),
			  description: z.string().nullable()
		  })
	  })
  }
})
