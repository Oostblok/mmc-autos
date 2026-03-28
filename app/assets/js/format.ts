export const formatMileage = (value: unknown) => {
	if (!value) return value

	const number = Number(value)

	if (Number.isNaN(number)) return value

	return new Intl.NumberFormat('nl-NL').format(number)
}

export const formatPrice = (value: unknown) => {
	if (!value) return value

	const number = Number(value)

	if (Number.isNaN(number)) return value

	return new Intl.NumberFormat('nl-NL', {
		style: 'currency',
		currency: 'EUR',
		maximumFractionDigits: 0
	}).format(number)
}
