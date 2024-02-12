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

// -----------------------------------------------------------------------------------------------------------


async function getThumbnailForVideo(videoUrl) {
    const video = document.createElement("video");
    const canvas = document.createElement("canvas");
    video.style.display = "none";
    canvas.style.display = "none";

    // Trigger video load
    await new Promise((resolve, reject) => {
        video.addEventListener("loadedmetadata", () => {
            video.width = video.videoWidth;
            video.height = video.videoHeight;
            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;
            // Seek the video to 25%
            video.currentTime = video.duration * 0.25;
        });
        video.addEventListener("seeked", () => resolve());
        video.src = videoUrl;
    });

    // Draw the thumbnailz
    canvas
        .getContext("2d")
        .drawImage(video, 0, 0, video.videoWidth, video.videoHeight);
    const imageUrl = canvas.toDataURL("image/png");
    return imageUrl;
}

// Set up application
// const img = document.querySelector("#img-thumb");
// const fileInput = document.querySelector("#input-video-file");

// fileInput.addEventListener("change", async e => {
//     const [file] = e.target.files;
//     const fileUrl = URL.createObjectURL(file);
//     const thumbUrl = await getThumbnailForVideo(fileUrl);
//     img.src = thumbUrl;
// });

// -----------------------------------------------------------------------------------------------------------

export default getFileExtension;