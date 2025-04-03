export async function handleFetchErrors<T = any>(
  response: Response
): Promise<T> {
  if (!response.ok) {
    const errorText = await response.text(); // intenta obtener el error del backend
    const message = `⚠️ ${response.status} ${response.statusText}: ${errorText}`;
    throw new Error(message);
  }
  return response.json();
}
