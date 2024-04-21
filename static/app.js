// Austen smooth animation  
document.addEventListener("DOMContentLoaded", function () {
  
    // Variable to track whether an animation is in progress
    let isAnimating = false;
  
    // Create and append the overlay
    const overlay = document.createElement('div');
    overlay.classList.add('overlay');
    document.body.appendChild(overlay);
  
    // Function to handle the overlay animations
    function handleOverlayAnimation(overlay) {
      // Listen for the transitionend event
      overlay.addEventListener('transitionend', function () {
        // Hide the overlay after the transition ends
        overlay.style.display = 'none';
  
        // Set a timeout before allowing the next animation
        setTimeout(function () {
          isAnimating = false;
        }, 1000); // Set your desired delay in milliseconds
      });
  
      // Ensure the transition is triggered by changing the opacity in the next frame
      requestAnimationFrame(function () {
        overlay.style.opacity = 0;
      });
  
      // Disable pointer events during the transition
      overlay.style.pointerEvents = 'none';
    }
  
    // Create a function that adds the click event listener to each link
    function addLinkListener() {
      // Get all the links with the class 'ajax-link'
      const ajaxLinks = document.querySelectorAll('.ajax-link');
  
      // Remove existing click event listeners from all links
      ajaxLinks.forEach(function (link) {
        link.removeEventListener('click', ajaxLinkClick);
      });
  
      // Add click event listener to each link
      ajaxLinks.forEach(function (link) {
        link.addEventListener('click', ajaxLinkClick);
      });
    }
  
    // Separate the click event handling function for clarity
    function ajaxLinkClick(event) {
      event.preventDefault();
  
      // Check if an animation is already in progress
      if (isAnimating) {
        return;
      }
  
      isAnimating = true;
  
      // Show the overlay
      overlay.style.display = 'block';
      overlay.style.opacity = 1;
  
      // Fetch the content of the target URL using AJAX and return a promise
      fetch(this.href)
        .then(response => response.text())
        .then(html => {
          const content = document.getElementById('content');
          content.innerHTML = html;
  
          // Update the state object with the new content
          history.replaceState({url: this.href, html: html}, '', this.href);
  
          // Handle overlay animations
          handleOverlayAnimation(overlay);
  
          // Re-attach the event listeners to the links
          addLinkListener();
        })
        .catch(error => {
          console.error(error);
          alert('Something went wrong. Please try again.');
          // Handle overlay animations
          handleOverlayAnimation(overlay);
        });
    }
  
    // Call the function to add the initial event listeners
    addLinkListener();
  
    // Add popstate event listener to handle the back and forward buttons
    window.addEventListener('popstate', function (event) {
      // Check if the event has a state object
      if (event.state) {
        // Get the URL and the HTML from the state object
        const url = event.state.url;
        const html = event.state.html;
  
        // Update the content element with the HTML
        const content = document.getElementById('content');
        content.innerHTML = html;
  
        // Re-attach the event listeners to the links
        addLinkListener();
      }
    });
  });
