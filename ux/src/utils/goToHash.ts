function goToHash(hash: string, enablePrevious: boolean = false) {
    if (enablePrevious)
        window.history.pushState(null, 'Labelisator', window.location.href);
    window.location.replace(`#${hash}`);
}

export default goToHash;