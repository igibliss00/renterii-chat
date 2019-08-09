    // if the description of the post is longer than 30 words, trim it
    const trimmedString = words => {
        let trimmedString = words.substr(0, 30)
        trimmedString = trimmedString.substr(0, Math.min(trimmedString.length, trimmedString.lastIndexOf(" ")))
        if(trimmedString.length >= 25) {
            return trimmedString + "..."
        } else {
            return trimmedString
        }
    }

    export default trimmedString