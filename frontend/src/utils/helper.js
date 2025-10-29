export const validateEmail = (email) => {
    const regrex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regrex.test(email);
}

export const getInitials = (name)=> {
    if(!name) return "";

    const words = name.split(" ");
    let initals = "";

    for(let i=0;i<Math.min(words.length,2);i++) {
        initals+=words[i][0];
    }

    return initals.toUpperCase();
}

