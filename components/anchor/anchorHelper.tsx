import getScroll from '../_util/getScroll';
import getRequestAnimationFrame from '../_util/getRequestAnimationFrame';

export const reqAnimFrame = getRequestAnimationFrame();

export const easeInOutCubic = (t, b, c, d) => {
  const cc = c - b;
  t /= d / 2;
  if (t < 1) {
    return cc / 2 * t * t * t + b;
  }
  return cc / 2 * ((t -= 2) * t * t + 2) + b;
};

export function getDefaultTarget() {
  return typeof window !== 'undefined' ?
    window : null;
}

export function getOffsetTop(element): number {
  if (!element) {
    return 0;
  }

  if (!element.getClientRects().length) {
    return 0;
  }

  const rect = element.getBoundingClientRect();

  if ( rect.width || rect.height ) {
    const doc = element.ownerDocument;
    const docElem = doc.documentElement;
    return  rect.top - docElem.clientTop;
  }

  return rect.top;
}

export function scrollTo(href, target = getDefaultTarget) {
  const scrollTop = getScroll(target(), true);
  const offsetTop = getOffsetTop(document.querySelector(href));
  const targetScrollTop = scrollTop + offsetTop;
  const startTime = Date.now();
  const frameFunc = () => {
    const timestamp = Date.now();
    const time = timestamp - startTime;
    document.body.scrollTop = easeInOutCubic(time, scrollTop, targetScrollTop, 450);
    if (time < 450) {
      reqAnimFrame(frameFunc);
    }
  };
  reqAnimFrame(frameFunc);
  history.pushState(null, undefined, href);
}

class AnchorHelper {
  private links: Array<string>;
  private currentAnchor: HTMLElement | null;

  constructor() {
    this.links = [];
    this.currentAnchor = null;
  }

  addLink(link) {
    if (this.links.indexOf(link) === -1) {
      this.links.push(link);
    }
  }

  getCurrentActiveAnchor(): HTMLElement | null {
    return this.currentAnchor;
  }

  setActiveAnchor(component) {
    this.currentAnchor = component;
  }

  getCurrentAnchor(bounds = 5) {
    let activeAnchor = '';
    this.links.forEach(section => {
      const target = document.querySelector(section);
      if (target) {
        const top = getOffsetTop(target);
        const bottom = top + target.clientHeight;
        if ((top <= bounds) && (bottom >= -bounds)) {
          activeAnchor = section;
        }
      }
    });
    return activeAnchor;
  }

  scrollTo(href, target = getDefaultTarget) {
    scrollTo(href, target);
  }
}

export default AnchorHelper;
