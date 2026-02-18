'use strict';

/**
 * element toggle function
 */

const elemToggleFunc = function (elem) { elem.classList.toggle("active"); }



/**
 * header sticky & go to top
 */

const header = document.querySelector("[data-header]");
const goTopBtn = document.querySelector("[data-go-top]");

window.addEventListener("scroll", function () {

  if (window.scrollY >= 10) {
    header.classList.add("active");
    goTopBtn.classList.add("active");
  } else {
    header.classList.remove("active");
    goTopBtn.classList.remove("active");
  }

});



/**
 * navbar toggle
 */

const navToggleBtn = document.querySelector("[data-nav-toggle-btn]");
const navbar = document.querySelector("[data-navbar]");

navToggleBtn.addEventListener("click", function () {

  elemToggleFunc(navToggleBtn);
  elemToggleFunc(navbar);
  elemToggleFunc(document.body);

});



/**
 * skills toggle
 */

const toggleBtnBox = document.querySelector("[data-toggle-box]");
const toggleBtns = document.querySelectorAll("[data-toggle-btn]");
const skillsBox = document.querySelector("[data-skills-box]");

for (let i = 0; i < toggleBtns.length; i++) {
  toggleBtns[i].addEventListener("click", function () {

    elemToggleFunc(toggleBtnBox);
    for (let i = 0; i < toggleBtns.length; i++) { elemToggleFunc(toggleBtns[i]); }
    elemToggleFunc(skillsBox);

  });
}



/**
 * dark & light theme toggle
 */

const themeToggleBtn = document.querySelector("[data-theme-btn]");

themeToggleBtn.addEventListener("click", function () {

  elemToggleFunc(themeToggleBtn);

  if (themeToggleBtn.classList.contains("active")) {
    document.body.classList.remove("dark_theme");
    document.body.classList.add("light_theme");

    localStorage.setItem("theme", "light_theme");
  } else {
    document.body.classList.add("dark_theme");
    document.body.classList.remove("light_theme");

    localStorage.setItem("theme", "dark_theme");
  }

});

/**
 * check & apply last time selected theme from localStorage
 */

if (localStorage.getItem("theme") === "light_theme") {
  themeToggleBtn.classList.add("active");
  document.body.classList.remove("dark_theme");
  document.body.classList.add("light_theme");
} else {
  themeToggleBtn.classList.remove("active");
  document.body.classList.remove("light_theme");
  document.body.classList.add("dark_theme");
}

/**
 * Contact Form Handler with PHPMailer
 */

const contactForm = document.getElementById('contactForm');
const submitLoader = document.getElementById('submit-loader');
const formFeedback = document.getElementById('form-feedback');
const messageInput = document.getElementById('message');
const messageWarning = document.getElementById('message-warning');
const attachmentInput = document.getElementById('attachment');
const attachmentName = document.getElementById('attachment-name');
const attachmentWarning = document.getElementById('attachment-warning');
const imagesInput = document.getElementById('images');
const imagePreviews = document.getElementById('image-previews');
const imagesWarning = document.getElementById('images-warning');

// File size limits
const MAX_ATTACHMENT_SIZE = 15 * 1024 * 1024; // 15 MB
const MAX_IMAGE_SIZE = 10 * 1024 * 1024; // 10 MB per image
const MAX_IMAGE_COUNT = 5; // max number of images
const MAX_IMAGES_TOTAL = 10 * 1024 * 1024; // 10 MB total for images

// Warning shown on submit (handled in submit listener)

if (contactForm) {
  contactForm.addEventListener('submit', async function(e) {
    e.preventDefault();

    // Reset feedback
    if (formFeedback) {
      formFeedback.style.display = 'none';
      formFeedback.innerHTML = '';
    }

    // Show loader (if present)
    if (submitLoader) submitLoader.style.display = 'block';
    const submitBtn = contactForm.querySelector('button[type="submit"]');
    const originalBtnText = submitBtn.textContent;
    submitBtn.disabled = true;
    submitBtn.textContent = 'Sending...';

    try {
      // Get form data
      const formData = new FormData(contactForm);

      // Client-side message length check
      const msg = (formData.get('message') || '').toString().trim();
      if (msg.length < 10) {
        if (messageWarning) {
          messageWarning.style.display = 'block';
          messageWarning.textContent = `Message is too short (${msg.length} characters). Please enter at least 10 characters.`;
          // Auto-hide the warning after 2 seconds
          setTimeout(() => { messageWarning.style.display = 'none'; }, 4000);
        }
        if (submitLoader) submitLoader.style.display = 'none';
        submitBtn.disabled = false;
        submitBtn.textContent = originalBtnText;
        return;
      }

      // Include files are automatically part of FormData from the inputs; no change required.

      // Send request
      const response = await fetch('send_email.php', {
        method: 'POST',
        body: formData
      });

      const result = await response.json();

      // Hide loader (if present)
      if (submitLoader) submitLoader.style.display = 'none';

      // Clear warning on success
      if (messageWarning) messageWarning.style.display = 'none';

      if (result.success) {
        // Show success message
        formFeedback.style.backgroundColor = '#d4edda';
        formFeedback.style.color = '#155724';
        formFeedback.style.borderLeft = '4px solid #28a745';
        formFeedback.innerHTML = result.message;
        formFeedback.style.display = 'block';

        // Reset form
        contactForm.reset();

        // Clear uploaded files display
        if (attachmentName) {
          attachmentName.style.display = 'none';
          attachmentName.textContent = '';
        }
        if (attachmentRemoveBtn) {
          attachmentRemoveBtn.style.display = 'none';
        }
        if (imagePreviews) {
          imagePreviews.innerHTML = '';
        }

        // Hide success message after 5 seconds
        setTimeout(() => {
          formFeedback.style.display = 'none';
        }, 5000);
      } else {
        // Show error message
        formFeedback.style.backgroundColor = '#f8d7da';
        formFeedback.style.color = '#721c24';
        formFeedback.style.borderLeft = '4px solid #f5c6cb';
        formFeedback.innerHTML = result.message;
        formFeedback.style.display = 'block';
      }
    } catch (error) {
      // Hide loader (if present)
      if (submitLoader) submitLoader.style.display = 'none';

      // Show error message
      formFeedback.style.backgroundColor = '#f8d7da';
      formFeedback.style.color = '#721c24';
      formFeedback.style.borderLeft = '4px solid #f5c6cb';
      formFeedback.innerHTML = 'An error occurred. Please try again later.';
      formFeedback.style.display = 'block';
    } finally {
      // Re-enable submit button
      submitBtn.disabled = false;
      submitBtn.textContent = originalBtnText;
    }
  });
}

// Attachment button click to open file picker
const attachmentBtn = document.getElementById('attachment-btn');
const attachmentRemoveBtn = document.getElementById('attachment-remove');

if (attachmentBtn && attachmentInput) {
  attachmentBtn.addEventListener('click', function (e) {
    e.preventDefault();
    attachmentInput.click();
  });

  // Handle attachment file selection
  attachmentInput.addEventListener('change', function () {
    if (attachmentInput.files && attachmentInput.files[0]) {
      const f = attachmentInput.files[0];
      // Check size
      if (f.size > MAX_ATTACHMENT_SIZE) {
        if (attachmentWarning) {
          attachmentWarning.style.display = 'block';
          attachmentWarning.textContent = `Attachment is too large (${(f.size/1024/1024).toFixed(2)} MB). Max allowed is ${(MAX_ATTACHMENT_SIZE/1024/1024)} MB.`;
          setTimeout(() => { attachmentWarning.style.display = 'none'; }, 10000);
        }
        // clear selection
        attachmentInput.value = '';
        if (attachmentRemoveBtn) attachmentRemoveBtn.style.display = 'none';
        if (attachmentName) attachmentName.style.display = 'none';
        return;
      }
      if (attachmentWarning) attachmentWarning.style.display = 'none';
      // Show the file name and remove button
      if (attachmentName) {
        attachmentName.textContent = `✓ ${f.name}`;
        attachmentName.style.display = 'block';
      }
      if (attachmentRemoveBtn) {
        attachmentRemoveBtn.style.display = 'inline-block';
      }
    } else {
      // No file selected
      if (attachmentName) attachmentName.style.display = 'none';
      if (attachmentRemoveBtn) attachmentRemoveBtn.style.display = 'none';
    }
  });

  // Handle attachment remove button
  if (attachmentRemoveBtn) {
    attachmentRemoveBtn.addEventListener('click', function (e) {
      e.preventDefault();
      attachmentInput.value = '';
      attachmentName.style.display = 'none';
      attachmentName.textContent = '';
      attachmentRemoveBtn.style.display = 'none';
    });
  }
}

// Images button click to open file picker
const imagesBtn = document.getElementById('images-btn');
if (imagesBtn && imagesInput) {
  imagesBtn.addEventListener('click', function (e) {
    e.preventDefault();
    imagesInput.click();
  });
}

// Image previews for selected images
if (imagesInput && imagePreviews) {
  imagesInput.addEventListener('change', function () {
    imagePreviews.innerHTML = '';
    const files = Array.from(imagesInput.files || []);
    // Basic checks: count, per-file size, total size
    if (files.length > MAX_IMAGE_COUNT) {
      if (imagesWarning) {
        imagesWarning.style.display = 'block';
        imagesWarning.textContent = `You selected ${files.length} images. Maximum allowed is ${MAX_IMAGE_COUNT}.`;
        setTimeout(() => { imagesWarning.style.display = 'none'; }, 10000);
      }
      imagesInput.value = '';
      return;
    }

    let total = 0;
    for (const file of files) {
      if (!file.type.startsWith('image/')) continue;
      if (file.size > MAX_IMAGE_SIZE) {
        if (imagesWarning) {
          imagesWarning.style.display = 'block';
          imagesWarning.textContent = `Image ${file.name} is too large (${(file.size/1024/1024).toFixed(2)} MB). Max per image is ${(MAX_IMAGE_SIZE/1024/1024)} MB.`;
          setTimeout(() => { imagesWarning.style.display = 'none'; }, 10000);
        }
        imagesInput.value = '';
        imagePreviews.innerHTML = '';
        return;
      }
      total += file.size;
      if (total > MAX_IMAGES_TOTAL) {
        if (imagesWarning) {
          imagesWarning.style.display = 'block';
          imagesWarning.textContent = `Total images size exceeds ${(MAX_IMAGES_TOTAL/1024/1024)} MB.`;
          setTimeout(() => { imagesWarning.style.display = 'none'; }, 10000);
        }
        imagesInput.value = '';
        imagePreviews.innerHTML = '';
        return;
      }
    }

    // Passed checks
    if (imagesWarning) imagesWarning.style.display = 'none';
    imagePreviews.innerHTML = '';
    
    files.forEach((file, index) => {
      if (!file.type.startsWith('image/')) return;
      const reader = new FileReader();
      reader.onload = function (evt) {
        const container = document.createElement('div');
        container.style.position = 'relative';
        container.style.display = 'inline-block';
        
        const img = document.createElement('img');
        img.src = evt.target.result;
        img.style.width = '80px';
        img.style.height = '80px';
        img.style.objectFit = 'cover';
        img.style.borderRadius = '4px';
        img.title = file.name;
        
        const removeBtn = document.createElement('button');
        removeBtn.type = 'button';
        removeBtn.innerHTML = '×';
        removeBtn.style.position = 'absolute';
        removeBtn.style.top = '-8px';
        removeBtn.style.right = '-8px';
        removeBtn.style.width = '20px';
        removeBtn.style.height = '20px';
        removeBtn.style.background = '#dc3545';
        removeBtn.style.color = 'white';
        removeBtn.style.border = 'none';
        removeBtn.style.borderRadius = '50%';
        removeBtn.style.cursor = 'pointer';
        removeBtn.style.fontSize = '16px';
        removeBtn.style.padding = '0';
        removeBtn.style.lineHeight = '20px';
        
        removeBtn.addEventListener('click', function (e) {
          e.preventDefault();
          container.remove();
          
          // Remove from images input
          const dt = new DataTransfer();
          const currentFiles = Array.from(imagesInput.files);
          currentFiles.forEach((f, i) => {
            if (i !== index) dt.items.add(f);
          });
          imagesInput.files = dt.files;
        });
        
        container.appendChild(img);
        container.appendChild(removeBtn);
        imagePreviews.appendChild(container);
      };
      reader.readAsDataURL(file);
    });
  });
}

// Final check on submit for files as well
if (contactForm) {
  contactForm.addEventListener('submit', function (e) {
    // attachment
    if (attachmentInput && attachmentInput.files && attachmentInput.files[0]) {
      const f = attachmentInput.files[0];
      if (f.size > MAX_ATTACHMENT_SIZE) {
        e.preventDefault();
        if (attachmentWarning) {
          attachmentWarning.style.display = 'block';
          attachmentWarning.textContent = `Attachment is too large (${(f.size/1024/1024).toFixed(2)} MB). Max allowed is ${(MAX_ATTACHMENT_SIZE/1024/1024)} MB.`;
          setTimeout(() => { attachmentWarning.style.display = 'none'; }, 10000);
        }
        return false;
      }
    }
    // images
    if (imagesInput && imagesInput.files && imagesInput.files.length > 0) {
      const files = Array.from(imagesInput.files);
      if (files.length > MAX_IMAGE_COUNT) {
        e.preventDefault();
        if (imagesWarning) {
          imagesWarning.style.display = 'block';
          imagesWarning.textContent = `You can upload up to ${MAX_IMAGE_COUNT} images.`;
          setTimeout(() => { imagesWarning.style.display = 'none'; }, 10000);
        }
        return false;
      }
      let total = 0;
      for (const file of files) {
        if (file.size > MAX_IMAGE_SIZE) {
          e.preventDefault();
          if (imagesWarning) {
            imagesWarning.style.display = 'block';
            imagesWarning.textContent = `Image ${file.name} is too large (${(file.size/1024/1024).toFixed(2)} MB). Max per image is ${(MAX_IMAGE_SIZE/1024/1024)} MB.`;
            setTimeout(() => { imagesWarning.style.display = 'none'; }, 10000);
          }
          return false;
        }
        total += file.size;
        if (total > MAX_IMAGES_TOTAL) {
          e.preventDefault();
          if (imagesWarning) {
            imagesWarning.style.display = 'block';
            imagesWarning.textContent = `Total images size exceeds ${(MAX_IMAGES_TOTAL/1024/1024)} MB.`;
            setTimeout(() => { imagesWarning.style.display = 'none'; }, 10000);
          }
          return false;
        }
      }
    }
    return true;
  });
}
