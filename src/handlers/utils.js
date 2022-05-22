export const truncateText = (input, maxSize) =>
input?.length > maxSize ? `${input.substring(0, maxSize)}...` : input;

export const bytesToSize = (bytes) => {
    var sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    if (bytes === 0) return '0 Byte';
    var i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)));
    return (bytes / Math.pow(1024, i)).toFixed(2) + ' ' + sizes[i];
}

export const splitRemoveEmpty = (data, sep) => {
    return data.split(sep).filter(element => element)
}