import html2canvas from 'html2canvas';

export const captureAndDownload = async (elementId: string, filename: string) => {
  try {
    const element = document.getElementById(elementId);
    if (!element) {
      console.error(`Element with id ${elementId} not found`);
      return;
    }

    // Store original styles for element and all descendants
    const originalStyles = new Map<HTMLElement, {height: string, maxHeight: string, overflow: string}>();
    
    const storeStyles = (el: HTMLElement) => {
      originalStyles.set(el, {
        height: el.style.height,
        maxHeight: el.style.maxHeight,
        overflow: el.style.overflow,
      });
    };

    // Store main element
    storeStyles(element);
    element.querySelectorAll('*').forEach((child) => {
      storeStyles(child as HTMLElement);
    });

    // Reset ALL height/overflow constraints in the entire tree
    const resetConstraints = (el: HTMLElement) => {
      el.style.height = 'auto';
      el.style.maxHeight = 'none';
      el.style.overflow = 'visible';
      el.querySelectorAll('*').forEach((child) => {
        const c = child as HTMLElement;
        c.style.height = 'auto';
        c.style.maxHeight = 'none';
        c.style.overflow = 'visible';
      });
    };
    
    resetConstraints(element);

    // Reset scroll positions
    element.querySelectorAll('*').forEach((child) => {
      const el = child as HTMLElement;
      if (el.scrollHeight > el.clientHeight) {
        el.scrollTop = 0;
      }
    });

    // Force layout recalculation
    await new Promise(resolve => {
      requestAnimationFrame(() => {
        // Trigger a reflow
        const _ = element.offsetHeight;
        requestAnimationFrame(resolve);
      });
    });

    // Get the full content dimensions after expansion
    const fullHeight = element.scrollHeight + 40; // Add padding
    const fullWidth = element.scrollWidth;

    // Capture with scale 1 to avoid cutting off content
    const canvas = await html2canvas(element, {
      scale: 1,
      useCORS: true,
      allowTaint: true,
      backgroundColor: '#ffffff',
      logging: false,
      windowHeight: fullHeight,
      windowWidth: fullWidth,
      imageTimeout: 0,
      proxy: null,
    });

    // Restore all original styles
    originalStyles.forEach((styles, el) => {
      el.style.height = styles.height;
      el.style.maxHeight = styles.maxHeight;
      el.style.overflow = styles.overflow;
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
