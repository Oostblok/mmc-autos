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
			  lazyImage: z.string().optional(),
			  image: z.string().optional(),
			  labels: z.array(z.string()).default([]),
			  title: z.string().optional(),
			  make: z.string().optional(),
			  model: z.string().optional(),
			  type: z.string().optional(),
			  price: z.string().optional(),
			  exportPrice: z.string().optional(),
			  year: z.string().optional(),
			  fuelType: z.string().optional(),
			  mileage: z.string().optional(),
			  gearbox: z.string().optional(),
			  images: z.array(z.string()).default([]),
			  engineSize: z.string().optional(),
			  power: z.string().optional(),
			  color: z.string().optional(),
			  damage: z.string().optional(),
			  description: z.string().optional()
		  })
	  })
  }
})
