# Heavy Hub - Product Manual

<div align="center">
<img src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" width="600" alt="Heavy Hub Banner"/>

**The Premier Marketplace for Heavy Equipment Rental & Sales**

*Version 1.0 | Last Updated: January 2026*
</div>

---

## Table of Contents

1. [Introduction](#introduction)
2. [Getting Started](#getting-started)
3. [User Authentication](#user-authentication)
4. [Browsing Equipment](#browsing-equipment)
5. [Equipment Categories](#equipment-categories)
6. [Viewing Equipment Details](#viewing-equipment-details)
7. [Booking Equipment](#booking-equipment)
8. [Creating a Listing](#creating-a-listing)
9. [Managing Your Fleet](#managing-your-fleet)
10. [Administrator Features](#administrator-features)
11. [Language & Accessibility](#language--accessibility)
12. [User Journeys](#user-journeys)
13. [Technical Stack](#technical-stack)
14. [Frequently Asked Questions](#frequently-asked-questions)

---

## Introduction

**Heavy Hub** is a modern, web-based marketplace designed to connect buyers, sellers, and renters of heavy construction equipment. Whether you're looking to purchase an excavator, rent a crane, or sell your fleet of equipment, Heavy Hub provides an intuitive platform to meet your needs.

### Key Features

| Feature | Description |
|---------|-------------|
| 🔍 **Smart Search** | Find equipment by keywords, category, location, and price range |
| 📋 **Equipment Categories** | Browse excavators, bulldozers, cranes, loaders, lifts, and dump trucks |
| 💰 **Flexible Options** | Equipment available for purchase or rental (daily/weekly/monthly) |
| 📱 **Responsive Design** | Works seamlessly on desktop, tablet, and mobile devices |
| 🌓 **Dark Mode** | Toggle between light and dark themes for comfortable viewing |
| 🌍 **Multi-language** | Available in English, Arabic, and Urdu |
| ✅ **Verified Dealers** | Trust badges for verified equipment dealers |

---

## Getting Started

### System Requirements

- Modern web browser (Chrome, Firefox, Safari, Edge)
- Stable internet connection
- JavaScript enabled

### Running the Application Locally

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Configure Environment**
   - Set up your `.env.local` file with necessary API keys (Firebase, etc.)

3. **Start the Application**
   ```bash
   npm run dev
   ```

---

## User Authentication

### Creating an Account

1. Click the **"Sign Up"** button in the top-right corner of the header
2. Fill in your details:
   - Email address
   - Password (minimum requirements apply)
3. Click **"Create Account"** to complete registration
4. You will be automatically logged in upon successful registration

### Logging In

1. Click the **"Log In"** button in the header
2. Enter your registered email and password
3. Click **"Sign In"** to access your account

### Account Features

Once logged in, you gain access to:
- **List Item** button to create new equipment listings
- **My Fleet** section to manage your equipment sales and rentals
- **User Profile** dropdown with **Edit Profile** and sign-out options

### Editing Your Profile

1. Click on your avatar/email in the header
2. Select **"Edit Profile"** from the dropdown menu
3. You can update the following information:
   - **Full Name** - Appears in the header and on your listings
   - **Phone Number** - Required for creating listings or requesting bookings
   - **Company Name** (Optional) - For professional dealers and rental companies
   - **Location** - Select your base city from the list of Saudi Arabian cities
   - **Profile Picture** - Upload a photo to personalize your account

### Account Deletion

1. Navigate to "Edit Profile"
2. Scroll to the "Danger Zone" at the bottom
3. Click **"Delete My Account"**
4. Confirm your intention and re-enter your password
5. A deletion request will be sent to our administrators for approval. Once approved, your data will be permanently removed.

> 💡 **Tip:** Your name initial appears as your avatar when no profile photo is set. Changes to your profile are reflected immediately across the platform.

---

## Browsing Equipment

### Search Functionality

The search screen provides powerful filtering strategies to help you find the right equipment.

#### Search Filters Panel

| Filter | Description |
|--------|-------------|
| **Keywords** | Enter equipment names, makes, or models |
| **Category** | Select from equipment categories (All, Excavator, Bulldozer, etc.) |
| **Location** | Filter by equipment location (Saudi Cities) |
| **Radius** | Adjust search radius (10 - 500 miles) |
| **Price Range** | Set minimum and maximum price limits (SAR) |

#### Feed Controls

- **Buy / Rent Toggle**: Switch between items for sale or for rent
- **Items Per Page**: Select how many listings to view at once (5, 10, or 20)
- **Sort By**: Order results by "Recommended", "Price: Low to High", or "Price: High to Low"

### Pagination

Heavy Hub uses dynamic pagination to browse large catalogs of equipment:
- Use the **Next/Previous** arrows to navigate pages
- Click specific **page numbers** to jump directly
- Use the **Items Per Page** selector to control information density

### Equipment Cards

Each listing card displays:
- **Equipment Image** - Primary photo of the equipment
- **Name & Year** - Equipment title with manufacturing year
- **Location** - Where the equipment is located
- **Price Options** - Buy price and/or rental rates
- **Badges** - Verification status, availability, and sale/rent indicators
- **Seller Info** - Dealer name and rating

---

## Equipment Categories

Heavy Hub supports the following equipment categories:

| Category | Description | Example |
|----------|-------------|---------|
| 🚜 **Excavator** | Digging and earthmoving machines | Caterpillar 320 GC |
| 🚧 **Bulldozer** | Heavy-duty pushing and grading | Komatsu D61PX |
| 🏗️ **Mobile Crane** | Lifting and hoisting equipment | Liebherr LTM 1060 |
| 🚛 **Skid Steer** | Compact loaders for various tasks | Bobcat S650 |
| ⬆️ **Scissor Lift** | Aerial work platforms | JLG 1930ES |
| 🚚 **Dump Truck** | Hauling and transportation | Volvo A40G |

---

## Viewing Equipment Details

Click on any equipment card to view detailed information:

### Detail Page Sections

1. **Image Gallery**
   - Large main image for detailed inspection
   - Placeholder for future 3D Tour features

2. **Equipment Specifications**
   - Year of manufacture
   - Make and model
   - Operating hours (Hidden if 0)
   - Weight (Hidden if 0)
   - Net power
   - Engine model
   - Maximum dig depth (for excavators)

> 💡 **Note:** Technical specifications like **Operating Hours** and **Weight** only appear if the seller has provided this information.

3. **Pricing Information**
   - **Buy Price** - Purchase cost
   - **Daily Rate** - Short-term rental
   - **Weekly Rate** - 7-day rental period
   - **Monthly Rate** - 30-day rental period

4. **Seller Information**
   - Company name
   - Rating and review count
   - Seller description
   - Contact options

5. **Status Badges**
   - ✅ Ready to Work
   - 🔵 Verified Dealer
   - 🟢 Available / 🔴 Unavailable
   - 💰 For Sale / 🔄 For Rent

---

## Booking Equipment

You can request to book equipment directly from the detail page.

### How to Request a Booking

1. Ensure you are **logged in** and have a **phone number** saved in your profile.
2. Select your **Start Date** and **End Date** on the calendar.
3. The system will automatically calculate the estimated cost based on available Daily/Weekly/Monthly rates.
4. Click **"Request Booking"**.
5. The system performs a conflict check to ensure the dates are available.
6. If successful, your booking request is created.

> ℹ️ **Note:** Currently, booking history is stored in our database, but a user-facing "My Bookings" screen is under development. Please contact the seller directly to confirm details.

---

## Creating a Listing

> ⚠️ **Note:** You must be logged in to create a listing.

### Step-by-Step Guide

1. **Access the Listing Form**
   - Click **"List Item"** button in the header
   - Or click **"Create Listing"** from My Fleet

2. **Basic Information** *(Required fields marked with *)*
   - **Title*** - Descriptive name (e.g., "2020 CAT 320 Excavator")
   - **Description** - Detailed equipment description
   - **Category*** - Select equipment type
   - **Listing Type** - For Sale, For Rent, or Both

3. **Equipment Details**
   - **Make*** - Manufacturer (e.g., Caterpillar). Select from suggested makes or enter a new one.
   - **Model*** - Model number (e.g., 320GC)
   - **Year*** - Manufacturing year (Select from 1900 to 2026)
   - **Hours** (Optional) - Operating hours. Leave blank or enter 0 if not applicable.
   - **Weight** (Optional) - Equipment weight in kg.
   - **Power** - Engine power rating (e.g., "150 HP" or "110 kW")

4. **Pricing (SAR)**
   - **Buy Price** - Sale price (if for sale)
   - **Daily Rate** - Daily rental rate (if for rent)
   - **Weekly Rate** - Weekly rental rate
   - **Monthly Rate** - Monthly rental rate

5. **Location**
   - **Address** - Equipment location (e.g., "Riyadh, Saudi Arabia")

6. **Photos**
   - Click the upload area to select images
   - Maximum 10 images per listing
   - Remove images by hovering and clicking the X

7. **Submit for Approval**
   - Click **"Publish Listing"** to submit your equipment
   - Listings enter **"Pending"** status by default
   - Our team reviews all listings to ensure quality and authenticity
   - Once approved, the status changes to **"Active"** and becomes visible to all users

> [!IMPORTANT]
> **Manual Approval:** To maintain platform quality, all new listings require manual approval before they appear in public search results. This process typically takes less than 24 hours.

---

## Managing Your Fleet

Access **My Fleet** from the header navigation to manage your equipment listings.

### Fleet Dashboard

The My Fleet screen displays all your listings with:
- Equipment thumbnail image
- Title, year, make, model, and category
- Current status badge
- Pricing information
- **Controls**: Change status or delete listing

### Listing Actions

1. **Change Status**: Use the dropdown to switch between:
   - **Active**: Visible to public (if approved)
   - **Hidden**: Temporarily remove from search results
   - **Sold**: Mark as sold (removes from active search)

2. **Delete Listing**:
   - Click the **Trash Icon**
   - Confirm deletion
   - **Note:** Deletion is blocked if the equipment has active future bookings.

---

## Administrator Features

Admins have exclusive access to the **Admin Panel** to moderate the platform.

### Admin Panel Sections

1. **Listings Management**
   - **Pending Tab**: Review new submissions waiting for approval.
   - **All Listings**: Browse the entire platform inventory.
   - **Actions**:
     - **Approve**: Publishes the listing to the live site.
     - **Reject**: Returns the listing to the seller with a rejected status.
     - **Delete**: Permanently removes a listing.

2. **Deletion Requests**
   - Review pending account deletion requests from users.
   - **Approve**: Confirm the request (requires manual data cleanup in Firebase Console).
   - **Reject**: Deny the request if necessary.

---

## Language & Accessibility

### Language Options

Heavy Hub supports multiple languages:

| Language | Code |
|----------|------|
| 🇺🇸 English | en |
| 🇸🇦 Arabic | ar |
| 🇵🇰 Urdu | ur |

**To switch languages:**
1. Locate the language switcher in the header
2. Click to select your preferred language
3. The interface will update immediately

### Dark Mode

Toggle dark mode for comfortable viewing in low-light conditions:
1. Click the sun/moon icon in the header
2. The theme switches instantly
3. Your preference is remembered for future visits

### Currency Display

- Prices are displayed in **SAR (Saudi Riyal)** by default
- Currency formatting adapts based on language selection

---

## User Journeys

Heavy Hub is designed around specific user workflows to ensure a seamless experience for buyers, sellers, and administrators.

### 💰 The Buyer/Renter Journey
1. **Land on Search**: Start at the homepage with a full list of available equipment.
2. **Apply Filters**: Use the sidebar to filter by category, price, and location.
3. **Sort & View**: Adjust sorting and items per page for optimal browsing.
4. **Deep Dive**: View full specifications and gallery on the detail page.
5. **Book**: Select dates and request a booking directly from the calendar.

### 🚜 The Seller/Dealer Journey
1. **Authentication**: Sign up and complete your profile with phone and company details.
2. **List Equipment**: Use the "List Item" form to upload details and photos.
3. **Wait for Approval**: Listings start as "Pending" until an admin reviews them.
4. **Manage Fleet**: Use "My Fleet" to update status (Active/Hidden/Sold) or delete listings.

### 🛡️ The Administrator Journey
1. **Admin Access**: Log in with an admin account to access the **"Admin Panel"**.
2. **Moderation**: Review "Pending" listings and approve valid ones.
3. **Compliance**: Handle user deletion requests and ensure platform quality.

---

## Technical Stack

The Heavy Hub platform is built using modern, industry-standard technologies to ensure performance, scalability, and cross-platform compatibility.

### Core Technologies

| Technology | Usage |
|------------|-------|
| ⚛️ **React 19** | Modern UI library for building a fast, component-based user interface |
| 🛡️ **TypeScript** | Static typing to ensure code quality and prevent runtime errors |
| ⚡ **Vite** | Blazing fast build tool and development server |

### Backend & Infrastructure (Firebase)

| Service | Purpose |
|---------|---------|
| 🔐 **Firebase Auth** | Secure user registration and authentication flow |
| 🔥 **Cloud Firestore** | NoSQL database for real-time equipment and user data storage |
| ☁️ **Cloud Storage** | Secure storage and delivery of high-quality equipment images |
| 🛡️ **Security Rules** | Granular access control for data integrity and user privacy |

### Libraries & APIs

| Library | Role |
|---------|------|
| 🌐 **i18next** | Comprehensive internationalization framework for multi-language support |
| 🎨 **Tailwind CSS** | Utility-first CSS framework for custom, responsive designs |
| 🅰️ **Google Fonts** | Inter typography for a clean, professional aesthetic |
| 💎 **Material Symbols** | Modern icon system for intuitive navigation |
| 📦 **ESM.sh** | Direct ESM module provider for React and other dependencies |

---

## Frequently Asked Questions

### Account & Registration

**Q: Is registration required to browse equipment?**
> No, you can browse all listings without an account. However, creating a listing or booking equipment requires registration.

**Q: How do I delete my account?**
> Go to "Edit Profile" and select "Delete My Account" from the Danger Zone to submit a request.

### Listings

**Q: How many images can I upload per listing?**
> You can upload up to 10 images per equipment listing.

**Q: Can I sell AND rent the same equipment?**
> Yes! When creating a listing, select "For Sale & Rent" to offer both options.

**Q: Are "Hours" and "Weight" mandatory?**
> No, these fields are optional. If unspecified, they remain hidden to keep the listing clean.

### Technical

**Q: Which browsers are supported?**
> Heavy Hub works on all modern browsers including Chrome, Firefox, Safari, and Edge.

**Q: Is Heavy Hub available as a mobile app?**
> Currently, Heavy Hub is a web application optimized for mobile browsers.

---

<div align="center">

**© 2026 Heavy Hub Inc. All rights reserved.**

*Built with React, TypeScript, and Firebase*

</div>
