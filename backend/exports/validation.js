module.exports = {
    isNicknameValid: (nickname) => {
        //eslint-disable-next-line
        const nicknameRegex = /^[A-Za-z][a-z]{3,15}$/;
        return nickname.match(nicknameRegex) !== null;
    },
    isEmailValid: (str) => {
        //eslint-disable-next-line
        const emailRegex = /^[^@]+@[^@]+\.[^@]+$/;
        return str.match(emailRegex) !== null;
    },
    isPasswordValid: (password1,password2) => {
        //eslint-disable-next-line  
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*]).{8,}$/;
        return  password1.match(passwordRegex) && (password1 === password2);
    },
};
