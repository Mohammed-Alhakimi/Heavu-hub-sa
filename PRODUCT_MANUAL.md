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
7. [Creating a Listing](#creating-a-listing)
8. [Managing Your Fleet](#managing-your-fleet)
9. [Language & Accessibility](#language--accessibility)
10. [User Journeys](#user-journeys)
11. [Technical Stack](#technical-stack)
12. [Frequently Asked Questions](#frequently-asked-questions)

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
   - Set up your `GEMINI_API_KEY` in the `.env.local` file

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
- **My Fleet** section to manage your equipment
- **User Profile** dropdown with **Edit Profile** and sign-out options

### Editing Your Profile

1. Click on your avatar/email in the header
2. Select **"Edit Profile"** from the dropdown menu
3. You can update the following information:
   - **Full Name** - Appears in the header and on your listings
   - **Phone Number** - Required for potential buyers/renters to contact you
   - **Company Name** (Optional) - For professional dealers and rental companies
   - **Location** - Select your base city from the list of Saudi Arabian cities
   - **Profile Picture** - Upload a photo to personalize your account

> 💡 **Tip:** Your name initial appears as your avatar when no profile photo is set. Changes to your profile are reflected immediately across the platform.

---

## Browsing Equipment

### Search Functionality

The search screen provides powerful filtering options to help you find the right equipment:

#### Search Filters

| Filter | Description |
|--------|-------------|
| **Keywords** | Enter equipment names, makes, or models |
| **Category** | Select from equipment categories (All, Excavator, Bulldozer, etc.) |
| **Location** | Filter by equipment location |
| **Radius** | Specify search radius in miles |
| **Price Range** | Set minimum and maximum price limits |
| **Conditions** | Filter by equipment condition |

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
   - Multiple high-resolution images
   - Click to browse through photos

2. **Equipment Specifications**
   - Year of manufacture
   - Make and model
   - Serial number
   - Operating hours (Hidden if 0)
   - Weight (Hidden if 0)
   - Net power
   - Engine model
   - Maximum dig depth (for excavators)

> 💡 **Note:** Technical specifications like **Operating Hours** and **Weight** only appear if the seller has provided this information. If these fields are left blank during listing creation, they will be hidden from the public view.

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

### Navigation

- Use the **Back** button to return to search results
- The header remains accessible for quick navigation

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

### Fleet Overview

The My Fleet screen displays all your listings with:
- Equipment thumbnail image
- Title, year, make, model, and category
- Current status badge
- Pricing information

### Listing Actions

Use the fleet dashboard to monitor your listing progress:
- **Pending** 🟡 - Waiting for admin review (not visible to public)
- **Active** 🟢 - Approved and live in search results
- **Rejected** 🔴 - Did not meet requirements (see notes/contact support)
- **Draft** ⚪ - Saved but not yet submitted for review

#### Delete Listing

1. Click the trash icon
2. Confirm deletion when prompted
3. Click "Yes" to permanently delete

> ⚠️ **Warning:** Deleting a listing cannot be undone.

### Empty Fleet

If you haven't created any listings yet, you'll see a prompt to create your first listing.

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
2. **Apply Filters**: Use the sidebar to filter by category (e.g., Excavator), price range, or location.
3. **Explore Results**: Scroll through equipment cards to see high-level pricing and verification badges.
4. **Deep Dive**: Click a card to view the full specification list, gallery, and seller information.
5. **Switch Context**: Use the language switcher to view details in a preferred language.

### 🚜 The Seller/Dealer Journey
1. **Authentication**: Sign up for a new account or log in to an existing one.
2. **Setup Profile**: Access "Edit Profile" from the avatar menu to set contact details and a profile picture.
3. **Start Listing**: Click **"List Item"** in the header to open the multi-step listing form.
4. **Provide Specs**: Enter make, model, year, and optional hours/weight. Upload high-res photos.
5. **Wait for Approval**: Submit the listing and view its "Pending" status in **My Fleet**.
6. **Go Live**: Once an admin approves, the listing automatically moves to "Active" and appears in public search.

### 🛡️ The Administrator Journey
1. **Admin Access**: Log in with an administrator account to see the **"Admin Panel"** link in the header.
2. **Queue Review**: Open the Admin Panel to see all listings currently in "Pending" status.
3. **Verification**: Review listing details and images for quality and policy compliance.
4. **Moderation**: Click **"Approve"** to publish the listing or **"Reject"** if it fails to meet platform standards.

### ⚙️ The Global Experience
- **Accessibility**: Toggle **Dark Mode** at any time for better visibility in different environments.
- **Localization**: Change the language between **English, Arabic, or Urdu** to localize all UI text and currency formatting.
- **Fleet Management**: Return to **My Fleet** to monitor performance or remove equipment that has been sold/rented.

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
> No, you can browse all listings without an account. However, creating a listing requires registration.

**Q: How do I reset my password?**
> Use the "Forgot Password" link on the login screen to receive a password reset email.

### Listings

**Q: How many images can I upload per listing?**
> You can upload up to 10 images per equipment listing.

**Q: Can I sell AND rent the same equipment?**
> Yes! When creating a listing, select "For Sale & Rent" to offer both options.

**Q: How do I edit an existing listing?**
> Access My Fleet, locate your listing, and update the status. Full editing features are coming soon.

**Q: Are "Hours" and "Weight" mandatory for every listing?**
> No, these fields are now optional. If you don't provide this information, the fields will be hidden on the equipment detail page to keep the listing clean.

### Technical

**Q: Which browsers are supported?**
> Heavy Hub works on all modern browsers including Chrome, Firefox, Safari, and Edge.

**Q: Is Heavy Hub available as a mobile app?**
> Currently, Heavy Hub is a web application optimized for mobile browsers. A dedicated app may be released in the future.

---

## Support & Contact

For technical support or inquiries:

- 📧 **Email:** support@heavyhub.com
- 🌐 **Website:** www.heavyhub.com

---

<div align="center">

**© 2024 Heavy Hub Inc. All rights reserved.**

*Built with React, TypeScript, and Firebase*

</div>
