const fetchApi = async (url, options) => {
    let error = null;
    let code= null;
    let data = null;
    try{
        const response = await fetch(url, options);
        code = response.status;
        if(!response.ok){
            throw new Error(response.statusText);
        }
        data = await response.json();
        return {error,code,data};
    }
    catch(e){
        error = e;
        console.log("Error: ", error)
        return {error,code,data};
    }
}

export default fetchApi;