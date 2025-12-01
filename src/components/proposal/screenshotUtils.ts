import html2canvas from 'html2canvas';

export const captureAndDownload = async (elementId: string, filename: string) => {
  try {
    const element = document.getElementById(elementId);
    if (!element) {
      console.error(`Element with id ${elementId} not found`);
      return;
    }

    // Find scrollable elements and store their original scroll position
    const scrollableElements = element.querySelectorAll('[style*="overflow"]');
    const originalScrollPositions = new Map();
    
    scrollableElements.forEach((el: any) => {
      originalScrollPositions.set(el, el.scrollTop);
      el.scrollTop = 0;
    });

    // Get full height including scrollable content
    const originalHeight = element.style.height;
    const originalOverflow = element.style.overflow;
    
    // For scrollable containers, temporarily adjust to show all content
    const scrollArea = element.querySelector('.handwritten-scroll') as HTMLElement;
    if (scrollArea) {
      scrollArea.style.height = 'auto';
      scrollArea.style.maxHeight = 'none';
    }

    const canvas = await html2canvas(element, {
      scale: 2,
      useCORS: true,
      allowTaint: true,
      backgroundColor: '#fff',
      logging: false,
      windowHeight: element.scrollHeight || element.offsetHeight,
    });

    // Restore original styles
    if (scrollArea) {
      scrollArea.style.height = '';
      scrollArea.style.maxHeight = '';
    }
    element.style.height = originalHeight;
    element.style.overflow = originalOverflow;
    
    // Restore scroll positions
    originalScrollPositions.forEach((scrollTop, el) => {
      (el as any).scrollTop = scrollTop;
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
