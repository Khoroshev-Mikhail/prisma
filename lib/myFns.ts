export async function createApi(url, {arg}) {
    await fetch(url, {
        method: 'POST',
        body: arg //Внимание, не используется JSON.stringify - этот фетчер для отправки типа new FormData()
    })
}
export async function updateApi(url, {arg}) {
    await fetch(url, {
        method: 'PUT',
        body: JSON.stringify(arg)
    })
}
export async function deleteApi(url, {arg}) {
    await fetch(url, {
        method: 'DELETE',
        body: JSON.stringify(arg)
    })
}