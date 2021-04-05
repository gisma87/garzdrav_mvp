export function scrollToElement(options: { element: HTMLElement, offset?: number, smooth?: boolean }) {
    const {element, offset, smooth} = options
    window.scrollTo({
        top: element.getBoundingClientRect().top + window.pageYOffset + (offset ? offset : 0),
        left: 0,
        behavior: smooth ? 'smooth' : 'auto'
    });
}