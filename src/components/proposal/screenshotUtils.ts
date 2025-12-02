import html2canvas from 'html2canvas';

export const captureAndDownload = async (elementId: string, filename: string) => {
  try {
    const element = document.getElementById(elementId);
    if (!element) {
      console.error(`Element with id ${elementId} not found`);
      return;
    }

    // Store original styles
    const originalStyles = {
      height: element.style.height,
      maxHeight: element.style.maxHeight,
      overflow: element.style.overflow,
      width: element.style.width,
    };

    // Store all parent styles that might clip content
    const parents: Array<{element: HTMLElement, overflow: string, height: string, maxHeight: string}> = [];
    let parent = element.parentElement;
    while (parent) {
      const computedStyle = window.getComputedStyle(parent);
      if (computedStyle.overflow === 'hidden' || computedStyle.overflow === 'auto' || computedStyle.overflow === 'scroll') {
        parents.push({
          element: parent,
          overflow: parent.style.overflow,
          height: parent.style.height,
          maxHeight: parent.style.maxHeight,
        });
        parent.style.overflow = 'visible';
        parent.style.height = 'auto';
        parent.style.maxHeight = 'none';
      }
      parent = parent.parentElement;
    }

    // Store and reset all scrollable children
    const allChildren = element.querySelectorAll('*');
    const scrollPositions: Array<{element: HTMLElement, scrollTop: number}> = [];
    const childStyles: Array<{element: HTMLElement, height: string, maxHeight: string, overflow: string}> = [];
    
    allChildren.forEach((child) => {
      const el = child as HTMLElement;
      const computedStyle = window.getComputedStyle(el);
      
      // Store scroll position
      if (el.scrollHeight > el.clientHeight && el.scrollTop > 0) {
        scrollPositions.push({element: el, scrollTop: el.scrollTop});
        el.scrollTop = 0;
      }
      
      // Reset height constraints for scrollable/handwritten areas
      if (el.classList.contains('handwritten-scroll') || 
          el.classList.contains('handwritten-content') ||
          computedStyle.overflow === 'auto' || 
          computedStyle.overflow === 'scroll') {
        childStyles.push({
          element: el,
          height: el.style.height,
          maxHeight: el.style.maxHeight,
          overflow: el.style.overflow,
        });
        el.style.height = 'auto';
        el.style.maxHeight = 'none';
        el.style.overflow = 'visible';
      }
    });

    // Reset main element dimensions
    element.style.height = 'auto';
    element.style.maxHeight = 'none';
    element.style.overflow = 'visible';
    element.style.width = '100%';

    // Get full content dimensions
    const fullHeight = element.scrollHeight;
    const fullWidth = Math.min(element.scrollWidth, 1200); // Max reasonable width

    // Capture with proper dimensions
    const canvas = await html2canvas(element, {
      scale: 1.5,
      useCORS: true,
      allowTaint: true,
      backgroundColor: '#ffffff',
      logging: false,
      windowHeight: fullHeight,
      windowWidth: fullWidth,
      imageTimeout: 0,
    });

    // Restore all original styles
    element.style.height = originalStyles.height;
    element.style.maxHeight = originalStyles.maxHeight;
    element.style.overflow = originalStyles.overflow;
    element.style.width = originalStyles.width;

    // Restore parent styles
    parents.forEach(({element: el, overflow, height, maxHeight}) => {
      el.style.overflow = overflow;
      el.style.height = height;
      el.style.maxHeight = maxHeight;
    });

    // Restore child styles
    childStyles.forEach(({element: el, height, maxHeight, overflow}) => {
      el.style.height = height;
      el.style.maxHeight = maxHeight;
      el.style.overflow = overflow;
    });

    // Restore scroll positions
    scrollPositions.forEach(({element: el, scrollTop}) => {
      el.scrollTop = scrollTop;
    });

    // Download the image
    const link = document.createElement('a');
    link.href = canvas.toDataURL('image/png');
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  } catch (error) {
    console.error('Failed to capture screenshot:', error);
  }
};
