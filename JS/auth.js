// ====================== AUTH.JS ======================
import { isAdmin, getContract, getCurrentAddress } from "./blockchain.js";

let currentRole = null;

export async function checkUserRole() {
  if (!window.ethereum) return "guest";

  try {
    const accounts = await window.ethereum.request({ method: "eth_accounts" });
    if (!accounts || accounts.length === 0) return "guest";

    const address = accounts[0];

    if (isAdmin()) {
      currentRole = "admin";
      return "admin";
    }

    const contract = getContract();
    if (!contract) return "guest";

    try {
      const voter = await contract.getVoter(address);
      if (voter.verified && voter.active) {
        currentRole = "voter";
        return "voter";
      }
    } catch (e) {
      // Voter chưa tồn tại
    }

    currentRole = "guest";
    return "guest";
  } catch (error) {
    console.error(error);
    return "guest";
  }
}

export async function autoRedirect() {
  const role = await checkUserRole();
  if (role === "admin") {
    window.location.href = "../pages/admin/admin-dashboard.html";
  } else if (role === "voter") {
    window.location.href = "../pages/voting/create-ballot.html";
  } else {
    window.location.href = "../pages/auth/connect-wallet.html";
  }
}

// Export
window.auth = {
  checkUserRole,
  autoRedirect,
  getCurrentRole: () => currentRole,
};
