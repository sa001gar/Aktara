// Common functionality for navbar, footer, search, and wishlist

// Search functionality with debouncing only
let searchTimeout
const searchCache = new Map()

// Dummy search data
const dummySearchData = [
  {
    id: 1,
    name: "Royal Red Silk Saree",
    category: "Silk",
    image: "https://lajreedesigner.com/cdn/shop/files/KP-Karishma-Red_5_900x1350_crop_center@2x.jpg?v=1745495600",
  },
  {
    id: 2,
    name: "Blue Cotton Saree",
    category: "Cotton",
    image:
      "https://encrypted-tbn2.gstatic.com/shopping?q=tbn:ANd9GcSOasMiGNdg35aA_gedyxtQrTdiqiD9CkOB84MO-PfrA5jT7KywRbaBYaYv3K-aai2hUUjG0ds8hdgSliDfV8Tcmp20v_5yjWRTYM_PqL8HyPN2-MbhLUqG",
  },
  {
    id: 3,
    name: "Green Designer Saree",
    category: "Designer",
    image:
      "https://encrypted-tbn1.gstatic.com/shopping?q=tbn:ANd9GcSxsA-rILRGxU6gC2sCdj0FcqyLFgQRUWS_ISaaYzN_j1rSF5kjNUkIV6VD9fwF6dHHY6ZkCjsUKRp97x5E4Dg_WrIWbNWV0BSzSC9b1wk",
  },
  {
    id: 4,
    name: "Pink Bridal Saree",
    category: "Bridal",
    image: "https://www.banarasee.in/cdn/shop/files/IMG_9630_940x.jpg?v=1683428505",
  },
  {
    id: 5,
    name: "Yellow Chiffon Saree",
    category: "Chiffon",
    image: "https://www.lavanyathelabel.com/cdn/shop/files/lbl101ks886_1_700x.jpg?v=1752668380",
  },
  {
    id: 6,
    name: "Purple Georgette Saree",
    category: "Georgette",
    image:
      "https://diwalistyle.com/wp-content/uploads/2024/03/Madhuri-Dixit-Purple-Color-60-Gram-Georgette-Sequins-Work-Saree-4.jpeg",
  },
  {
    id: 7,
    name: "Maroon Silk Traditional",
    category: "Silk",
    image: "https://resources.indianclothstore.com/productimages/Maroon-Silk-Saree-With-Blouse-18710418042024.jpg",
  },
  {
    id: 8,
    name: "Orange Festival Cotton",
    category: "Cotton",
    image: "https://arvisaa.com/cdn/shop/products/KP-Kalyani-Orange_1_720x.jpg?v=1737618305",
  },
]

// Debounced search function
function debounceSearch(func, delay) {
  return (query, isDesktop) => {
    clearTimeout(searchTimeout)
    searchTimeout = setTimeout(() => func(query, isDesktop), delay)
  }
}

// API call example - Real implementation
async function callSearchAPI(query) {
  try {
    const response = await fetch(`/api/search?q=${encodeURIComponent(query)}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer your-token-here",
      },
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const data = await response.json()
    return data.results || []
  } catch (error) {
    console.error("API call failed:", error)
    return dummySearchData.filter(
      (item) =>
        item.name.toLowerCase().includes(query.toLowerCase()) ||
        item.category.toLowerCase().includes(query.toLowerCase()),
    )
  }
}

// Search function with API simulation
async function performSearch(query, isDesktop = true) {
  if (!query || query.length < 2) {
    hideSearchResults(isDesktop)
    return
  }

  const resultsContainer = isDesktop ? "searchResults" : "mobileSearchResults"
  const loadingContainer = isDesktop ? "searchLoading" : "mobileSearchLoading"

  const loadingEl = document.getElementById(loadingContainer)
  const resultsEl = document.getElementById(resultsContainer)

  if (!loadingEl || !resultsEl) return

  // Show loading
  loadingEl.classList.remove("hidden")
  resultsEl.classList.add("show")

  try {
    // Check cache first
    if (searchCache.has(query)) {
      displaySearchResults(searchCache.get(query), isDesktop)
      return
    }

    // Simulate API call delay
    await new Promise((resolve) => setTimeout(resolve, 300))

    // Use API call (falls back to dummy data if API fails)
    const results = await callSearchAPI(query)

    // Cache results
    searchCache.set(query, results)
    displaySearchResults(results, isDesktop)
  } catch (error) {
    console.error("Search error:", error)
    hideSearchResults(isDesktop)
  }
}

// Display search results
function displaySearchResults(results, isDesktop = true) {
  const loadingContainer = isDesktop ? "searchLoading" : "mobileSearchLoading"
  const listContainer = isDesktop ? "searchResultsList" : "mobileSearchResultsList"

  const loadingEl = document.getElementById(loadingContainer)
  const listEl = document.getElementById(listContainer)

  if (loadingEl) loadingEl.classList.add("hidden")
  if (!listEl) return

  if (results.length === 0) {
    listEl.innerHTML = `
            <div class="search-result-item text-center py-4">
                <i class="fas fa-search text-gray-400 text-2xl mb-2"></i>
                <p class="text-gray-500">No results found</p>
            </div>
        `
  } else {
    listEl.innerHTML = results
      .map(
        (item) => `
            <div class="search-result-item flex items-center space-x-3" onclick="selectSearchResult(${item.id})">
                <img src="${item.image}" alt="${item.name}" class="w-12 h-12 object-cover rounded-lg">
                <div class="flex-1">
                    <h4 class="font-medium text-aktara-black text-sm">${item.name}</h4>
                    <p class="text-xs text-gray-500">${item.category}</p>
                </div>
                <i class="fas fa-arrow-right text-gray-400 text-sm"></i>
            </div>
        `,
      )
      .join("")
  }
}

// Hide search results
function hideSearchResults(isDesktop = true) {
  const resultsContainer = isDesktop ? "searchResults" : "mobileSearchResults"
  const resultsEl = document.getElementById(resultsContainer)
  if (resultsEl) resultsEl.classList.remove("show")
}

// Select search result
function selectSearchResult(productId) {
  window.location.href = `product.html?id=${productId}`
}

// Create debounced search function
const debouncedSearch = debounceSearch(performSearch, 300)

// Setup search event listeners
function setupSearchListeners() {
  const desktopSearch = document.getElementById("searchInput")
  const mobileSearch = document.getElementById("mobileSearchInput")

  if (desktopSearch) {
    desktopSearch.addEventListener("input", (e) => {
      const query = e.target.value.trim()
      debouncedSearch(query, true)
    })

    desktopSearch.addEventListener("focus", (e) => {
      const query = e.target.value.trim()
      if (query.length >= 2) {
        performSearch(query, true)
      }
    })
  }

  if (mobileSearch) {
    mobileSearch.addEventListener("input", (e) => {
      const query = e.target.value.trim()
      debouncedSearch(query, false)
    })

    mobileSearch.addEventListener("focus", (e) => {
      const query = e.target.value.trim()
      if (query.length >= 2) {
        performSearch(query, false)
      }
    })
  }

  // Hide results when clicking outside
  document.addEventListener("click", (e) => {
    if (!e.target.closest("#searchInput") && !e.target.closest("#searchResults")) {
      hideSearchResults(true)
    }
    if (!e.target.closest("#mobileSearchInput") && !e.target.closest("#mobileSearchResults")) {
      hideSearchResults(false)
    }
  })
}

// Wishlist functionality
const wishlist = JSON.parse(localStorage.getItem("wishlist")) || []

function updateWishlistCount() {
  const countEl = document.getElementById("wishlistCount")
  if (countEl) countEl.textContent = wishlist.length
}

function toggleWishlistItem(productId) {
  const index = wishlist.indexOf(productId)
  const button = document.querySelector(`button[onclick="toggleWishlistItem(${productId})"] i`)

  if (index > -1) {
    wishlist.splice(index, 1)
    if (button) {
      button.classList.remove("text-aktara-red")
      button.classList.add("text-gray-400")
    }
  } else {
    wishlist.push(productId)
    if (button) {
      button.classList.remove("text-gray-400")
      button.classList.add("text-aktara-red")
    }
  }

  localStorage.setItem("wishlist", JSON.stringify(wishlist))
  updateWishlistCount()
  updateWishlistModal()
}

function toggleWishlist() {
  const modal = document.getElementById("wishlistModal")
  if (modal) {
    modal.classList.toggle("hidden")
    modal.classList.toggle("flex")
    updateWishlistModal()
  }
}

function updateWishlistModal() {
  const wishlistItems = document.getElementById("wishlistItems")
  const emptyWishlist = document.getElementById("emptyWishlist")

  if (!wishlistItems || !emptyWishlist) return

  if (wishlist.length === 0) {
    wishlistItems.classList.add("hidden")
    emptyWishlist.classList.remove("hidden")
  } else {
    wishlistItems.classList.remove("hidden")
    emptyWishlist.classList.add("hidden")

    wishlistItems.innerHTML = wishlist
      .map(
        (id) => `
            <div class="flex items-center space-x-4 p-4 border rounded-lg">
                <img src="/placeholder.svg?height=60&width=60&text=Product${id}" alt="Product" class="w-15 h-15 object-cover rounded">
                <div class="flex-1">
                    <h4 class="font-medium text-aktara-black">Sample Product ${id}</h4>
                    <p class="text-sm text-gray-600">Premium Quality</p>
                </div>
                <button onclick="toggleWishlistItem(${id})" class="text-aktara-red hover:text-red-700">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        `,
      )
      .join("")
  }
}

// Add to cart functionality
function addToCart(productId) {
  const button = event.target
  const originalText = button.innerHTML

  button.innerHTML = '<i class="fas fa-check mr-2"></i>Added!'
  button.classList.add("bg-green-500")
  button.classList.remove("bg-aktara-red")

  setTimeout(() => {
    button.innerHTML = originalText
    button.classList.remove("bg-green-500")
    button.classList.add("bg-aktara-red")
  }, 2000)

  console.log("Added product", productId, "to cart")
}

// Newsletter subscription
function subscribeNewsletter(event) {
  event.preventDefault()
  const emailInput = document.getElementById("newsletterEmail")
  const button = event.target.querySelector("button")

  if (!emailInput || !button) return

  const email = emailInput.value
  const originalText = button.innerHTML

  button.innerHTML = '<i class="fas fa-spinner fa-spin mr-2"></i>Subscribing...'
  button.disabled = true

  setTimeout(() => {
    button.innerHTML = '<i class="fas fa-check mr-2"></i>Subscribed!'
    button.classList.add("bg-green-500")
    setTimeout(() => {
      button.innerHTML = originalText
      button.classList.remove("bg-green-500")
      button.disabled = false
      emailInput.value = ""
    }, 3000)
  }, 2000)

  console.log("Newsletter subscription for:", email)
}

// Mobile menu toggle
function toggleMobileMenu() {
  const mobileMenu = document.getElementById("mobileMenu")
  if (mobileMenu) mobileMenu.classList.toggle("hidden")
}

// Initialize common functionality
function initCommon() {
  console.log("Initializing common functionality...")

  // Scroll progress
  const scrollProgress = document.getElementById("scrollProgress")
  if (scrollProgress) {
    window.addEventListener("scroll", () => {
      const winScroll = document.body.scrollTop || document.documentElement.scrollTop
      const height = document.documentElement.scrollHeight - document.documentElement.clientHeight
      const scrolled = (winScroll / height) * 100
      scrollProgress.style.transform = `scaleX(${scrolled}%)`
    })
  }

  // Back to top functionality
  const backToTopButton = document.getElementById("backToTop")
  if (backToTopButton) {
    window.addEventListener("scroll", () => {
      if (window.scrollY > 300) {
        backToTopButton.classList.remove("opacity-0", "invisible")
        backToTopButton.classList.add("opacity-100", "visible")
      } else {
        backToTopButton.classList.add("opacity-0", "invisible")
        backToTopButton.classList.remove("opacity-100", "visible")
      }
    })

    backToTopButton.addEventListener("click", () => {
      window.scrollTo({ top: 0, behavior: "smooth" })
    })
  }

  // Lazy loading for images
  const images = document.querySelectorAll('img[loading="lazy"]')
  if (images.length > 0) {
    const imageObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const img = entry.target
          img.classList.remove("skeleton")
          observer.unobserve(img)
        }
      })
    })
    images.forEach((img) => imageObserver.observe(img))
  }

  // Setup search
  setupSearchListeners()
  updateWishlistCount()

  // Update wishlist button states
  wishlist.forEach((productId) => {
    const button = document.querySelector(`button[onclick="toggleWishlistItem(${productId})"] i`)
    if (button) {
      button.classList.remove("text-gray-400")
      button.classList.add("text-aktara-red")
    }
  })

  // Wishlist modal click outside to close
  const wishlistModal = document.getElementById("wishlistModal")
  if (wishlistModal) {
    wishlistModal.addEventListener("click", (e) => {
      if (e.target === e.currentTarget) {
        toggleWishlist()
      }
    })
  }

  // Clear search cache periodically
  setInterval(() => searchCache.clear(), 5 * 60 * 1000)

  console.log("Common functionality initialized successfully")
}

// Initialize when DOM is loaded
document.addEventListener("DOMContentLoaded", initCommon)
