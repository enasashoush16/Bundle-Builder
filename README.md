# Product Configurator & Checkout Flow - Bundle Builder

A responsive React application built with Vite, featuring a dynamic product selection interface, variant management, and a simplified checkout experience.

## Features
- **Dynamic Product Selection:** Toggle between different variants with real-time UI updates.
- **Responsive Layout:** Optimized for mobile, tablet, and desktop using CSS rem units and media queries.
- **Checkout Notifications:** Interactive feedback using `react-hot-toast`.
- **User Guarantees:** Includes a satisfaction guarantee section that adapts to screen size.
- **Cart Summary:** Real-time calculation of totals, savings, and monthly pricing.

###  Decisions & Tradeoff
- **Decision 1:** I chose to store the product data in a local JSON file rather than building a backend database to keep the project lightweight and easily cloneable.
- **Tradeoff 1:**  I used standard CSS instead of a library like Tailwind, which meant writing more custom code, but it gave me absolute control over the branding colors.

### Future Improvements / Unfinished Items
[*] Connect to a live payment gateway like Stripe

## Getting Started
Follow these steps to run the project locally from a clean clone.

### Prerequisites
- [Node.js](https://nodejs.org/) installed (v24 recommended)
- npm (comes with Node.js)

### Installation
1. Clone the repository:
   ```bash
   git clone https://github.com/enasashoush16/Bundle-Builder.git

### Navigate into the project directory:
cd <My-Bundle-Builder-Folder >
(`Note: If you opened your project folder directly in VS Code, you might already be in the right folder and can skip this step!`)

### Install the dependencies:
npm install

### Start the development server:
npm run dev

