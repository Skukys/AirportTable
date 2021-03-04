export async function request(method, endpoint, data = {}, formData = false) {

    let fetchData = {
        method,
        headers: {
            'Content-Type': 'application/json',
        }
    }
    if (method !== 'GET' && !formData)
        fetchData['body'] = JSON.stringify(data)

    let res = await fetch('http://flights/api' + endpoint, fetchData)
    if (res.status === 202) {
        return res
    }
    let resJson = await res.json()
    return {json: resJson, status: res.status}
}