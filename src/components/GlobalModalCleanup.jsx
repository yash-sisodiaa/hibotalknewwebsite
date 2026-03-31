import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import $ from 'jquery';

const GlobalModalCleanup = () => {
  const location = useLocation();

  // Handle cleanup on route changes
  useEffect(() => {
    window.scrollTo(0, 0);

    // If jQuery is available, tell all open modals to hide properly
    if (typeof window.$ !== 'undefined') {
      window.$('.modal.show').modal('hide');
    }

    // Force cleanup just in case
    setTimeout(() => {
      document.body.classList.remove('modal-open');
      document.body.style.overflow = '';
      document.body.style.paddingRight = '';

      const backdrops = document.querySelectorAll('.modal-backdrop');
      backdrops.forEach((backdrop) => {
        backdrop.remove();
      });
    }, 100);

  }, [location.pathname]);

  // Handle global modal overlapping issues
  useEffect(() => {
    if (typeof window.$ === 'undefined') return;

    const enforceCleanup = () => {
      // If no modals are supposedly open, but the body is still locked, unlock it!
      if (document.querySelectorAll('.modal.show').length === 0) {
        document.body.classList.remove('modal-open');
        document.body.style.overflow = '';
        document.body.style.paddingRight = '';
        document.querySelectorAll('.modal-backdrop').forEach(b => b.remove());
      }
    };

    // Listen to Bootstrap's native hide event
    window.$(document).on('hidden.bs.modal', enforceCleanup);

    return () => {
      window.$(document).off('hidden.bs.modal', enforceCleanup);
    };
  }, []);

  return null;
};

export default GlobalModalCleanup;
