function download(content, fileName, contentType) {
    const a = document.createElement('a');
    const file = new Blob([JSON.stringify(content, null, 4)], {type: contentType});
    a.href = URL.createObjectURL(file);
    a.download = fileName;
    a.click();
}

export default download;
