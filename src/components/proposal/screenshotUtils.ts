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

    // Store overflow hidden parent styles
    const parents: Array<{element: HTMLElement, overflow: string, height: string}> = [];
    let parent = element.parentElement;
    while (parent) {
      const computedStyle = window.getComputedStyle(parent);
      if (computedStyle.overflow === 'hidden' || computedStyle.overflow === 'auto') {
        parents.push({
          element: parent,
          overflow: parent.style.overflow,
          height: parent.style.height,
        });
        parent.style.overflow = 'visible';
        parent.style.height = 'auto';
      }
      parent = parent.parentElement;
    }

    // Reset element dimensions to auto for full capture
    element.style.height = 'auto';
    element.style.maxHeight = 'none';
    element.style.overflow = 'visible';
    element.style.width = 'auto';

    // Reset scrollable children
    const allScrollables = element.querySelectorAll('*');
    const scrollPositions: Array<{element: HTMLElement, scrollTop: number}> = [];
    allScrollables.forEach((child) => {
      const el = child as HTMLElement;
      const computedStyle = window.getComputedStyle(el);
      if ((computedStyle.overflow === 'auto' || computedStyle.overflow === 'scroll') && el.scrollTop > 0) {
        scrollPositions.push({element: el, scrollTop: el.scrollTop});
        el.scrollTop = 0;
      }
      // Remove height constraints from scrollable containers
      if (el.classList.contains('handwritten-scroll') || computedStyle.overflow === 'auto') {
        el.style.height = 'auto';
        el.style.maxHeight = 'none';
      }
    });

    // Get bounding rect to capture only visible content
    const rect = element.getBoundingClientRect();
    const contentHeight = element.scrollHeight;
    const contentWidth = element.scrollWidth;

    const canvas = await html2canvas(element, {
      scale: 2,
      useCORS: true,
      allowTaint: true,
      backgroundColor: '#fff',
      logging: false,
      windowHeight: contentHeight,
      windowWidth: contentWidth,
      imageTimeout: 0,
      height: contentHeight,
      width: contentWidth,
    });

    // Restore original styles
    element.style.height = originalStyles.height;
    element.style.maxHeight = originalStyles.maxHeight;
    element.style.overflow = originalStyles.overflow;
    element.style.width = originalStyles.width;

    // Restore parent styles
    parents.forEach(({element: el, overflow, height}) => {
      el.style.overflow = overflow;
      el.style.height = height;
    });

    // Restore scroll positions
    scrollPositions.forEach(({element: el, scrollTop}) => {
      el.scrollTop = scrollTop;
    });

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
