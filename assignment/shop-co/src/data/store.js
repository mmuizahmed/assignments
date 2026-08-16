export const ASSET = '/assets/'

export const products = {
  tape: {
    id: 'tape', name: 'T-shirt with Tape Details', price: 120, rating: '4.5/5', image: 'products/tape-details-large.png', categoryImage: 'products/tape-details-large.png'
  },
  gradient: {
    id: 'gradient', name: 'Gradient Graphic T-shirt', price: 145, oldPrice: 242, discount: '-20%', rating: '3.5/5', productType: 'T-shirts', colors: ['White'], sizes: ['Small', 'Medium', 'Large', 'X-Large'], style: 'Casual', color: 'White', size: 'Large', image: 'products/gradient.png', cartImage: 'figma/cart-gradient.png'
  },
  tipping: {
    id: 'tipping', name: 'Polo with Tipping Details', price: 180, oldPrice: 242, discount: '-20%', rating: '4.5/5', productType: 'T-shirts', colors: ['Blue'], sizes: ['Medium', 'Large', 'X-Large'], style: 'Casual', image: 'products/polo-tipping.png', cartImage: 'products/polo-tipping.png'
  },
  black: {
    id: 'black', name: 'Black Striped T-shirt', price: 120, oldPrice: 150, discount: '-30%', rating: '5.0/5', productType: 'T-shirts', colors: ['Black'], sizes: ['Small', 'Medium', 'Large'], style: 'Casual', image: 'products/black-striped.png', cartImage: 'products/black-striped.png'
  },
  skinny: {
    id: 'skinny', name: 'Skinny Fit Jeans', price: 240, oldPrice: 260, discount: '-20%', rating: '3.5/5', productType: 'Jeans', colors: ['Blue'], sizes: ['Medium', 'Large', 'X-Large'], style: 'Casual', color: 'Blue', size: 'Large', image: 'products/skinny-jeans-category.png', homeImage: 'products/skinny-jeans-large.png', cartImage: 'figma/cart-jeans.png'
  },
  checkered: {
    id: 'checkered', name: 'Checkered Shirt', price: 180, rating: '4.5/5', productType: 'Shirts', colors: ['Red'], sizes: ['Small', 'Medium', 'Large', 'X-Large'], style: 'Casual', color: 'Red', size: 'Medium', image: 'products/checkered-category.png', cartImage: 'figma/cart-checkered.png'
  },
  sleeve: {
    id: 'sleeve', name: 'Sleeve Striped T-shirt', price: 130, oldPrice: 160, discount: '-30%', rating: '4.5/5', productType: 'T-shirts', colors: ['Orange', 'Black'], sizes: ['Small', 'Medium', 'Large'], style: 'Casual', image: 'products/sleeve-striped-category.png', homeImage: 'products/sleeve-striped-large.png'
  },
  vertical: {
    id: 'vertical', name: 'Vertical Striped Shirt', price: 212, oldPrice: 232, discount: '-20%', rating: '5.0/5', productType: 'Shirts', colors: ['Green'], sizes: ['Medium', 'Large', 'X-Large'], style: 'Casual', image: 'products/vertical-category.png', homeImage: 'products/vertical-striped-large.png'
  },
  courage: {
    id: 'courage', name: 'Courage Graphic T-shirt', price: 145, rating: '4.0/5', productType: 'T-shirts', colors: ['Orange'], sizes: ['Small', 'Medium', 'Large'], style: 'Casual', image: 'products/courage-category.png', homeImage: 'products/courage-large.png'
  },
  bermuda: {
    id: 'bermuda', name: 'Loose Fit Bermuda Shorts', price: 80, rating: '3.0/5', productType: 'Shorts', colors: ['Blue'], sizes: ['Small', 'Medium', 'Large', 'X-Large'], style: 'Casual', image: 'products/bermuda-category.png', homeImage: 'products/bermuda-large.png'
  },
  faded: {
    id: 'faded', name: 'Faded Skinny Jeans', price: 210, rating: '4.5/5', image: 'products/faded-jeans-large.png'
  },
  contrast: {
    id: 'contrast', name: 'Polo with Contrast Trims', price: 212, oldPrice: 242, discount: '-20%', rating: '4.0/5', image: 'products/contrast-polo.png'
  }
}

export const categoryProducts = [products.gradient, products.tipping, products.black, products.skinny, products.checkered, products.sleeve, products.vertical, products.courage, products.bermuda]
export const newArrivals = [products.tape, products.skinny, products.checkered, products.sleeve]
export const topSelling = [products.vertical, products.courage, products.bermuda, products.faded]
export const recommendations = [products.contrast, products.gradient, products.tipping, products.black]

export const oneLifeProduct = {
  id: 'one-life',
  name: 'One Life Graphic T-shirt',
  price: 260,
  oldPrice: 300,
  discount: '-40%',
  rating: '4.5/5',
  image: 'products/one-life-main-mobile.png',
  cartImage: 'products/one-life-front-thumb-mobile.png',
  color: 'Olive',
  size: 'Large',
  description: 'This graphic t-shirt which is perfect for any occasion. Crafted from a soft and breathable fabric, it offers superior comfort and style.'
}

export const reviews = [
  {name: 'Samantha D.', date: 'August 14, 2023', rating: '4.5/5', text: '"I absolutely love this t-shirt! The design is unique and the fabric feels so comfortable. As a fellow designer, I appreciate the attention to detail. It\'s become my favorite go-to shirt."'},
  {name: 'Alex M.', date: 'August 15, 2023', rating: '4.5/5', text: '"The t-shirt exceeded my expectations! The colors are vibrant and the print quality is top-notch. Being a UI/UX designer myself, I\'m quite picky about aesthetics, and this t-shirt definitely gets a thumbs up from me."'},
  {name: 'Ethan R.', date: 'August 16, 2023', rating: '4/5', text: '"This t-shirt is a must-have for anyone who appreciates good design. The minimalistic yet stylish pattern caught my eye, and the fit is perfect. I can see the designer\'s touch in every aspect of this shirt."'},
  {name: 'Olivia P.', date: 'August 17, 2023', rating: '4/5', text: '"As a UI/UX enthusiast, I value simplicity and functionality. This t-shirt not only represents those principles but also feels great to wear. It\'s evident that the designer poured their creativity into making this t-shirt stand out."'},
  {name: 'Liam K.', date: 'August 18, 2023', rating: '4/5', text: '"This t-shirt is a fusion of comfort and creativity. The fabric is soft, and the design speaks volumes about the designer\'s skill. It\'s like wearing a piece of art that reflects my passion for both design and fashion."'},
  {name: 'Ava H.', date: 'August 19, 2023', rating: '4.5/5', text: '"I\'m not just wearing a t-shirt; I\'m wearing a piece of design philosophy. The intricate details and thoughtful layout of the design make this shirt a conversation starter."'}
]

export const dressStyles = [
  {name: 'Casual', image: 'home/dress-casual.png', mobileImage: 'home/dress-casual-mobile.png'},
  {name: 'Formal', image: 'home/dress-formal.png', mobileImage: 'home/dress-formal-mobile.png'},
  {name: 'Party', image: 'home/dress-party.png', mobileImage: 'home/dress-party-mobile.png'},
  {name: 'Gym', image: 'home/dress-gym.png', mobileImage: 'home/dress-gym-mobile.png'}
]
