function createCookie(un, authId, time) {
    let expires = "";
    if (time >= 0) {
        let date = new Date();
        let newDate = new Date(date.getTime()+time*24*60*60*1000).toGMTString();
        expires = `expires=${newDate}`;
    }
    document.cookie = `username=${un}; ${expires}; path=/`;
    document.cookie = `authId=${authId}; ${expires}; path=/`;
}