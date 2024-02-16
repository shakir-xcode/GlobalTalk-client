function getFileExtension(filename) {
    // Use a regular expression to match the file extension
    const extensionMatch = /\.([^.]+)$/.exec(filename);

    // Check if a match is found
    if (extensionMatch && extensionMatch.length > 1) {
        // Return the matched file extension (group at index 1)
        return extensionMatch[1];
    } else {
        // If no match is found or the filename has no extension, return undefined
        return 'file';
    }
}

const imageExtensions = ['jpg', 'jpeg', 'png', 'gif', 'bmp', 'svg', 'webp', 'tiff', 'ico'];


export const isImageFile = function (filename) {
    const extension = getFileExtension(filename);
    return imageExtensions.includes(extension.toLowerCase());
}

export const getFileName = function (filename, len = 10) {
    const nameArr = filename.split('-');
    nameArr.shift();
    const name = nameArr.join('').trim();
    if (name.length <= len)
        return name;

    return name.slice(0, len) + '...'
}

export default getFileExtension;