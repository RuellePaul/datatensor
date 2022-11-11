function requestFullScreen(element: HTMLElement) {
    if (!element) return;

    if (element.requestFullscreen) element.requestFullscreen();

    // @ts-ignore
    if (element.webkitRequestFullScreen) element.webkitRequestFullScreen();

    // @ts-ignore
    if (element.mozRequestFullScreen) element.mozRequestFullScreen();
}

export default requestFullScreen;
