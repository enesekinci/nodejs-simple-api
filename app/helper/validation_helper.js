class Validation {

    static emailVerify(email) {
        let regex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
        if (email.match(regex))
            return true;
        return false;
    }
}

module.exports = Validation