const TextPreview = ({ channel }) => {
    const { text } = channel
    return text[0] ? text[0].text : null
}

export default TextPreview