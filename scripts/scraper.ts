import puppeteer from 'puppeteer'
import fs from 'node:fs'
import path from 'node:path'

const scrape = async () => {
	const browser = await puppeteer.launch({
		headless: true,
		args: ['--no-sandbox', '--disable-setuid-sandbox']
	})

	const cars = []
	let pageIndex = 0
	let hasNextPage = true

	const page = await browser.newPage()

	await page.setRequestInterception(true)
	page.on('request', (req) => {
		if (['image', 'stylesheet', 'font'].includes(req.resourceType())) req.abort()
		else req.continue()
	})

	try {
		while (hasNextPage) {
			const url = `https://www.schadeautos.nl/nl/voorraad/schade/alle-voertuigsoorten/m-van-den-eijnden-bv-mmc+someren/15/1/0/0/0/1/${pageIndex}`;

			await page.goto(url, {
				waitUntil: 'networkidle2',
				timeout: 60000
			})

			const data = await page.evaluate(() => {
				const $cars = Array.from(document.querySelectorAll('.car'));

				return $cars
					.map($car => {
						const link = $car.getAttribute('data-href')
						const image = $car.querySelector('.car-image > a > img')?.getAttribute('src')
						const model = $car.querySelector('h2 > a')?.textContent?.trim()
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
							link: link?.startsWith('/') ? `https://www.schadeautos.nl${link}` : link,
							image: image?.startsWith('/') ? `https://www.schadeautos.nl${image}` : image,
							labels: labels.filter(Boolean),
							model,
							type,
							price,
							year,
							fuelType,
							mileage
						}
					})
					.filter(car => !!car.model)
			})

			if (data.length === 0) {
				hasNextPage = false
			} else {
				cars.push(...data)
				pageIndex++

				await new Promise(r => setTimeout(r, 1000))
			}
		}

		const outputDir = path.join(process.cwd(), 'public');
		if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir);

		fs.writeFileSync(
			path.join(outputDir, 'cars.json'),
			JSON.stringify({
				updated: new Date().toISOString(),
				cars
			}, null, 2)
		)

		console.log('\x1b[36m%s\x1b[0m', `✅ Success: Scraped ${cars.length} cars.`)
	}catch (err) {
		console.error('\x1b[31m%s\x1b[0m', '❌ Scraper failed:', err)
		process.exit(1)
	} finally {
		await browser.close()
	}
}

scrape().catch(() => process.exit(1))
