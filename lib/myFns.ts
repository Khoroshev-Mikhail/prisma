export async function createApi(url, {arg}) {
    await fetch(url, {
        method: 'POST',
        // body: JSON.stringify(arg)
        body: arg //Внимание, не используется JSON.stringify - этот фетчер для отправки типа new FormData()
    })
}
export async function updateApi(url, {arg}) {
    await fetch(url, {
        method: 'PUT',
       // body: JSON.stringify(arg)
       body: arg //Внимание, не используется JSON.stringify - этот фетчер для отправки типа new FormData()
    })
}
export async function deleteApi(url, {arg}) {
    await fetch(url, {
        method: 'DELETE',
        // body: JSON.stringify(arg)
       body: arg //Внимание, не используется JSON.stringify - этот фетчер для отправки типа new FormData()
    })
}

export async function sendGoogle(file: any) { //исправь на file
    await fetch('https://script.google.com/macros/s/AKfycbyKzIQW9nWMi_oDCwUP5abKpuRNG1NzXHAaSzjai42nAXBkJmeJdrACE8HdNGspy0e4wA/exec', {
        method: 'POST',
        body: file
    })
}