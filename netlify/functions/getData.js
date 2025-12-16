export async function handler(event) {
	const apiKey = process.env.API_KEY;
	const apiUrl = process.env.API_URL;

	const { lat, lng } = event.queryStringParameters;

	if (!lat || !lng) {
		return {
			statusCode: 400,
			body: JSON.stringify({ message: 'lat und lng müssen gesetzt sein' }),
		};
	}

	try {
		const response = await fetch(`${apiUrl}?lat=${lat}&lng=${lng}&rad=1.5&sort=dist&type=all&apikey=${apiKey}`);
		const data = await response.json();

		return {
			statusCode: 200,
			body: JSON.stringify(data),
		};
	} catch (err) {
		return {
			statusCode: 500,
			body: JSON.stringify({ message: err.message }),
		};
	}
}
