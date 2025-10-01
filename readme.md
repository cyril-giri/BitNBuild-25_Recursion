# 🎓 GigCampus

**GigCampus** is a hyperlocal, two-sided marketplace designed to connect student freelancers with clients within their university and local community. It provides a complete, end-to-end project lifecycle—from project posting and bidding to secure payments and reputation building—creating a self-sustaining micro-economy for student talent.

---

## 🚀 Backstory

Within any university ecosystem, there exists a wealth of untapped student talent in fields like design, coding, writing, and tutoring. These students are eager for real-world experience and opportunities to earn an income. Simultaneously, there is a constant demand for these skills from other students, campus clubs, and local businesses who need affordable, short-term help. The primary barrier is the lack of a centralized, trusted platform to efficiently connect this supply and demand.

---

## 🏆 Problem Statement

Develop **GigCampus**, a platform that:

- Connects student freelancers with clients (students, clubs, local businesses)
- Provides a trusted, end-to-end project workflow
- Enables secure payments and reputation building
- Fosters a campus micro-economy for student talent

---

## ✨ Key Features

### 1. Project Marketplace & Bidding System
- **Clients** can post detailed project requirements, timelines, and budgets.
- **Student freelancers** can browse projects and place competitive bids, submitting a proposal and price.
- **Bidding UI**: Projects, bids, and proposals are managed via intuitive dashboards.

### 2. Secure On-Chain Payment Escrow (Sepolia Testnet, USDC)
- **Smart contract escrow**: When a bid is accepted, an on-chain escrow contract is deployed for the project.
- **USDC payments**: All milestone payments are handled in USDC on the Sepolia testnet.
- **Release on approval**: Funds are released to the freelancer only after the client marks the milestone as complete.
- **Trust**: Ensures both parties are protected throughout the project lifecycle.

### 3. Integrated Real-Time Chat with File Sharing
- **Messaging system**: Built-in chat supports real-time text and file sharing (designs, code, docs).
- **Centralized communication**: All project-related discussions and files are documented on the platform.

### 4. Dynamic Portfolio & Reputation System
- **Automatic portfolio**: Completed work is added to the student’s public portfolio.
- **Ratings & reviews**: Both client and freelancer can rate and review each other.
- **Reputation score**: Transparent, verifiable scores influence future opportunities.

---

## 🛠️ Tech Stack

- **Frontend**: React (Vite), Tailwind CSS
- **Backend**: Supabase (Postgres, Auth, Storage, Realtime)
- **Smart Contracts**: Solidity (Escrow, Sepolia testnet, USDC)
- **State Management**: React Context API
- **Routing**: React Router
- **Other**: Lucide Icons, Custom Hooks

---

## 📂 Project Structure

```
frontend/
│
├── public/
│   └── vite.svg
├── src/
│   ├── components/
│   │   ├── Bids/                # Bid cards, bid lists, attachments
│   │   ├── Chat/                # Real-time chat UI
│   │   ├── Contracts/           # Contract overview and cards
│   │   ├── Dashboard/           # Dashboards for clients/freelancers
│   │   ├── Deliverables/        # Deliverable cards, list, modal
│   │   ├── Landing/             # Landing page sections
│   │   ├── Milestones/          # Milestone cards, list, creation form
│   │   ├── Profile/             # Profile overview, settings, reviews
│   │   ├── Projects/            # Project posting, details, summary
│   │   ├── Register/            # Registration form components
│   │   └── ui/                  # Shared UI elements (buttons, cards)
│   ├── context/                 # Auth context
│   ├── lib/                     # Supabase client, hooks, utils
│   ├── pages/                   # Main app pages (Login, Register, Dashboard, etc.)
│   ├── App.jsx
│   └── main.jsx
└── ...
```

---

## 🖥️ Main User Flows

### 1. **Client Flow**
- Register/login as a client
- Post a project with requirements and budget
- Review bids from student freelancers
- Accept a bid (escrow contract is deployed, funds are held on-chain)
- Chat with freelancer, manage milestones and deliverables
- Approve work and release payment (on-chain)
- Leave a review

### 2. **Freelancer Flow**
- Register/login as a student freelancer
- Browse available projects
- Place bids with proposals and pricing
- Chat with clients, view milestones
- Submit deliverables for funded milestones
- Get paid upon approval, build portfolio
- Receive reviews and grow reputation

---

## 📦 Key Components

- **Project Marketplace**: Browse, post, and bid on projects
- **Bidding System**: Submit and manage bids
- **Contracts & Milestones**: Track project progress and payments (on-chain)
- **Deliverables**: Upload and review work for each milestone
- **Escrow Payments**: Secure, conditional fund release (on-chain, USDC)
- **Chat**: Real-time messaging and file sharing
- **Portfolio & Reviews**: Showcase work and build trust

---

## 🏛️ Database Overview

- **users / profiles**: Auth, roles, and profile info
- **projects**: Project postings
- **bids**: Bids on projects
- **contracts**: Accepted bids, project agreements, escrow contract address
- **milestones**: Project phases, funding, and deliverables
- **deliverables**: Files and notes submitted for milestones
- **reviews**: Ratings and feedback

---

## 🔗 Smart Contract Integration (Sepolia Testnet, USDC)

### **How to Use On-Chain Escrow**

1. **Install MetaMask**  
   Download and install [MetaMask](https://metamask.io/) for your browser.

2. **Create a MetaMask Account**  
   - Open MetaMask and follow the instructions to create a new wallet/account.
   - Save your recovery phrase securely.

3. **Add Sepolia Testnet to MetaMask**  
   - Open MetaMask, click your account icon > Settings > Networks > Add Network.
   - Network Name: `Sepolia`
   - RPC URL: `https://rpc.sepolia.org`
   - Chain ID: `11155111`
   - Currency Symbol: `ETH`
   - Block Explorer: `https://sepolia.etherscan.io`
   - Or, select Sepolia from the default test networks list.

4. **Get Sepolia ETH (for gas fees)**  
   - Use a [Sepolia faucet](https://sepoliafaucet.com/) to get free testnet ETH.

5. **Mint Sepolia USDC (Testnet)**
   - Visit a [USDC Sepolia faucet](https://faucet.circle.com/) and connect your wallet.
   - Mint test USDC tokens to your MetaMask account.

6. **Import USDC Token in MetaMask**
   - Open MetaMask, go to "Assets", click "Import Tokens".
   - Token contract address:  
     ```
     0x1c7D4B196Cb0C7B01d743Fbc6116a902379C7238
     ```
   - Token symbol: `USDC`
   - Decimals: `6`
   - Click "Add Custom Token" and "Import Tokens".

7. **Connect Your Wallet in GigCampus**
   - On the contract workspace page, click "Connect Wallet".
   - Make sure you are on Sepolia and have USDC and ETH for gas.

8. **Use On-Chain Escrow**
   - When a contract is created, an escrow contract is deployed on-chain.
   - All milestone payments, approvals, and refunds are handled via the smart contract using USDC.

---

## 📝 How to Run Locally

1. **Clone the repo**
2. **Install dependencies**
   ```bash
   npm install
   ```
3. **Set up your `.env` with Supabase keys**
4. **Start the dev server**
   ```bash
   npm run dev
   ```
5. **Visit** [http://localhost:5173](http://localhost:5173)

---

## 🤝 Contributing

Pull requests are welcome! For major changes, please open an issue first to discuss what you would like to change.

---

## 📄 License

MIT

---

## 💡 Inspiration

GigCampus is inspired by the real needs of students and campus communities to unlock talent, build experience, and create new opportunities—right where they are.

---