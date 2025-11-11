const observer = new PerformanceObserver((list) => {
  for (const entry of list.getEntries()) {
    if (entry.entryType === 'layout-shift') {
      console.log('Reflow occurs:', entry);
    }
  }
});
observer.observe({ entryTypes: ['layout-shift'] });