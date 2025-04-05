const APIs = async (endPoint, id = null, method, headers = {}, reqData = {}, formData = false) => {
    try {

        console.log({reqData});
        let data = null;
        let backendUrl = process.env.NEXT_PUBLIC_BACKEND_ADDRESS;
        id ? backendUrl += `/${endPoint}/${id}` : backendUrl += `/${endPoint}`;
        let headersData = {
            // 'Content-Type': 'application/json',
            ...(headers && headers), // Merge additional headers if provided
        };

        const response = await fetch(`${backendUrl}`, {
            method: method,
            headers: headersData,
            ...(method !== 'GET' && { body: formData ? reqData : JSON.stringify(reqData) })
        });

        if (response.ok) {
            data = await response.json();
            const status = response.status;
            return { status, data };
        }
        else {
            throw new Error(response.error);
        }
    }
    catch (err) {
        console.error(err);
    }
}
export default APIs;