import puppeteer from 'puppeteer'
import fs from 'node:fs'
import path from 'node:path'
import slugify from 'slugify'

const setupPage = async (page) => {
	await page.setRequestInterception(true)
	page.on('request', (req) => {
		if (['image', 'stylesheet', 'font'].includes(req.resourceType())) req.abort()
		else req.continue()
	})
}

const scrape = async () => {
	let browser
	const cars = []
	let pageIndex = 0
	let hasNextPage = true

	try {
		browser = await puppeteer.launch({
			headless: true,
			args: [
				'--no-sandbox',
				'--disable-setuid-sandbox',
        '--disable-dev-shm-usage'
			]
		})

		const page = await browser.newPage()
		await setupPage(page)

		while (hasNextPage) {
			const url = `https://www.schadeautos.nl/nl/voorraad/schade/alle-voertuigsoorten/m-van-den-eijnden-bv-mmc+someren/15/1/0/0/0/1/${pageIndex}`

			await page.goto(url, {
				waitUntil: 'networkidle2',
				timeout: 60000
			})

			const data = await page.evaluate(() => {
				const $cars = Array.from(document.querySelectorAll('.car'))

				return $cars
					.map($car => {
						const link = $car.getAttribute('data-href')

						if (!link) return

						const image = $car.querySelector('.car-image > a > img')?.getAttribute('src')
						const title = $car.querySelector('h2 > a')?.textContent?.trim()
						const type = $car.querySelector('.model-type')?.textContent?.trim()
						const price = $car.querySelector('.price')?.textContent?.trim()
						const year = $car.querySelector('.details > [title="1ste toelating"]')?.textContent?.trim()
						const fuelType = $car.querySelector('.details > [title="brandstof"]')?.textContent?.trim()
						const mileage = $car.querySelector('.details > [title="tellerstand"]')?.textContent?.trim()

						const labels = []
						$car.querySelectorAll('.label > *').forEach($label => {
							labels.push($label.textContent?.trim())
						})

						return {
							id: link.split('/').pop(),
							link: new URL(link, location.origin).href,
							image: image?.startsWith('/') ? `https://www.schadeautos.nl${image}` : image,
							labels: labels.filter(Boolean),
							title,
							type,
							price,
							year,
							fuelType,
							mileage
						}
					})
					.filter(car => !!car?.link)
			})

			if (data.length === 0) {
				hasNextPage = false
			} else {
				cars.push(...data)
				pageIndex++

				await new Promise(r => setTimeout(r, 1000))
			}
		}

		if (!cars.length) {
			console.error('\x1b[35m%s\x1b[0m', '❌ No cars found, exiting.')
			process.exit(0)
		}

		console.info('\x1b[36m%s\x1b[0m', `Found ${cars.length} cars, start enriching data..`)

		const P_LIMIT = 3

		const pages = await Promise.all(
			Array.from({ length: P_LIMIT }, () => browser.newPage())
		)

		await Promise.all(pages.map(setupPage))

		for (let i = 0; i < cars.length; i++) {
			const page = pages[i % P_LIMIT]
			const car = cars[i]

			await page.goto(car.link, { waitUntil: 'networkidle2', timeout: 30000 })

			const details = await page.evaluate((car) => {
				const images = []

				for (const $img of Array.from(document.querySelectorAll('#thumbs img[onclick]'))) {
					const onclick = $img.getAttribute('onclick')

					const match = onclick?.match(/showPicture\(\d+,'([^']+)'\)/)

					if (match) {
						images.push(new URL(match[1], location.origin).href)
					}
				}

				const data = {}
				const rows = document.querySelectorAll('.specifications table tr')

				for (const row of rows) {
					const cells = row.querySelectorAll('td')
					if (cells.length < 2) continue

					const key = cells[0].innerText
						.trim()
						.toLowerCase()
						.replace(':', '')
						.replace(/\s+/g, ' ')

					data[key] = cells[1].innerText.trim()
				}

				return {
					images: [...new Set(images)],
					make: data['merk'] || null,
					model: data['model'] || null,
					fuelType: data['brandstof'] || car.fuelType || null,
					gearbox: data['transmissie'] || null,
					mileage: data['tellerstand']?.replace(/[^\d]/g, '') || car.mileage || null,
					price: data['verkoopprijs']?.replace(/[^\d]/g, '') || car.price || null,
					exportPrice: data['exportprijs netto']?.replace(/[^\d]/g, '') || null,
					description: [
						data['schades'],
						data['bijzonderheden']
					].filter(Boolean).join('\n\n')
				}
			}, car)

			Object.assign(car, details)
		}

		const slugMap = new Map()

		for (const car of cars) {
			const baseSlug = slugify(`${car.model || ''}-${car.type || ''}`, { lower: true, strict: true })

			car.slug = slugMap.has(baseSlug)
				? `${baseSlug}-${car.id}`
				: baseSlug

			slugMap.set(baseSlug, (slugMap.get(baseSlug) || 0) + 1)
		}

		const contentDir = path.join(process.cwd(), 'content', 'cars')
		if (!fs.existsSync(contentDir)) fs.mkdirSync(contentDir, { recursive: true })

		for (const car of cars) {
			fs.writeFileSync(
				path.join(contentDir, `${car.slug}.json`),
				JSON.stringify(car, null, 2)
			)
		}

		const outputDir = path.join(process.cwd(), 'public')
		if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir)

		fs.writeFileSync(
			path.join(outputDir, 'cars.json'),
			JSON.stringify({
				updated: new Date().toISOString(),
				cars: cars.map(car => {
					const { images, description, ...rest } = car

					return {
						...rest,
						...images?.length
							? {
								lazyImage: car.image,
								image: images[0]
							}
							: {}
					}
				})
			}, null, 2)
		)

		console.log('\x1b[32m%s\x1b[0m', `✅ Success: Scraped ${cars.length} cars.`)
	}catch (err) {
		console.error('\x1b[31m%s\x1b[0m', '❌ Scraper failed:', err)
		process.exit(1)
	} finally {
		if (browser) await browser.close()
	}
}

scrape().catch((error) => {
	console.error(error?.message || error.toString())
	process.exit(1)
})
