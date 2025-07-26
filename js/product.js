// Product page specific functionality

// Initialize product page functionality
function initProductPage() {
//   console.log("Initializing product page...")

  // Image gallery functionality (if not using Alpine.js)
  const thumbnails = document.querySelectorAll(".thumbnail-image")
  const mainImage = document.querySelector(".main-product-image")

  if (thumbnails.length > 0 && mainImage) {
    thumbnails.forEach((thumbnail, index) => {
      thumbnail.addEventListener("click", () => {
        // Remove active class from all thumbnails
        thumbnails.forEach((thumb) => thumb.classList.remove("border-aktara-red"))

        // Add active class to clicked thumbnail
        thumbnail.classList.add("border-aktara-red")

        // Update main image
        mainImage.src = thumbnail.src
        mainImage.alt = thumbnail.alt
      })
    })
  }

  // Quantity controls (if not using Alpine.js)
  const quantityInput = document.querySelector(".quantity-input")
  const decreaseBtn = document.querySelector(".quantity-decrease")
  const increaseBtn = document.querySelector(".quantity-increase")

  if (quantityInput && decreaseBtn && increaseBtn) {
    decreaseBtn.addEventListener("click", () => {
      const currentValue = Number.parseInt(quantityInput.value)
      if (currentValue > 1) {
        quantityInput.value = currentValue - 1
      }
    })

    increaseBtn.addEventListener("click", () => {
      const currentValue = Number.parseInt(quantityInput.value)
      if (currentValue < 10) {
        quantityInput.value = currentValue + 1
      }
    })
  }

  // Add to cart functionality
  const addToCartBtn = document.querySelector(".add-to-cart-btn")
  if (addToCartBtn) {
    addToCartBtn.addEventListener("click", () => {
      const quantity = quantityInput ? Number.parseInt(quantityInput.value) : 1
      const productId = addToCartBtn.dataset.productId || 1

      // Update cart count
      const cartCount = document.querySelector(".cart-count")
      if (cartCount) {
        const currentCount = Number.parseInt(cartCount.textContent) || 0
        cartCount.textContent = currentCount + quantity
      }

      // Show success message
      showNotification("Product added to cart!", "success")
    })
  }

  // Buy now functionality
  const buyNowBtn = document.querySelector(".buy-now-btn")
  if (buyNowBtn) {
    buyNowBtn.addEventListener("click", () => {
      // Redirect to checkout or cart page
      window.location.href = "cart.html"
    })
  }

//   console.log("Product page initialized successfully")
}

// Show notification function
function showNotification(message, type = "info") {
  const notification = document.createElement("div")
  notification.className = `fixed top-4 right-4 px-6 py-3 rounded-lg shadow-lg z-50 transition-all duration-300 ${
    type === "success"
      ? "bg-green-500 text-white"
      : type === "error"
        ? "bg-red-500 text-white"
        : "bg-blue-500 text-white"
  }`
  notification.textContent = message

  document.body.appendChild(notification)

  // Auto remove after 3 seconds
  setTimeout(() => {
    notification.style.opacity = "0"
    notification.style.transform = "translateX(100%)"
    setTimeout(() => {
      if (notification.parentNode) {
        notification.parentNode.removeChild(notification)
      }
    }, 300)
  }, 3000)
}

// Initialize when DOM is loaded
document.addEventListener("DOMContentLoaded", initProductPage)
