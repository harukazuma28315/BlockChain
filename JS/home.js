tailwind.config = {
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        "on-primary-fixed-variant": "#3323cc",
        "surface-dim": "#d3daea",
        "surface-container-lowest": "#ffffff",
        "on-tertiary-fixed-variant": "#7b2f00",
        secondary: "#0058be",
        "on-primary-fixed": "#0f0069",
        "surface-container-highest": "#dce2f3",
        "outline-variant": "#c7c4d8",
        "surface-container-low": "#f0f3ff",
        "inverse-on-surface": "#ebf1ff",
        error: "#ba1a1a",
        "on-error-container": "#93000a",
        "inverse-primary": "#c3c0ff",
        "secondary-fixed-dim": "#adc6ff",
        "surface-container-high": "#e2e8f8",
        "on-secondary": "#ffffff",
        primary: "#3525cd",
        "on-primary": "#ffffff",
        "on-tertiary-fixed": "#351000",
        "tertiary-fixed": "#ffdbcc",
        "on-secondary-container": "#fefcff",
        "primary-fixed": "#e2dfff",
        "surface-bright": "#f9f9ff",
        "secondary-container": "#2170e4",
        "surface-container": "#e7eefe",
        "on-primary-container": "#dad7ff",
        "on-tertiary": "#ffffff",
        "error-container": "#ffdad6",
        outline: "#777587",
        "on-secondary-fixed": "#001a42",
        "surface-variant": "#dce2f3",
        "primary-container": "#4f46e5",
        "inverse-surface": "#2a313d",
        "tertiary-fixed-dim": "#ffb695",
        "primary-fixed-dim": "#c3c0ff",
        tertiary: "#7e3000",
        background: "#f9f9ff",
        "on-tertiary-container": "#ffd2be",
        "secondary-fixed": "#d8e2ff",
        surface: "#f9f9ff",
        "on-error": "#ffffff",
        "on-background": "#151c27",
        "tertiary-container": "#a44100",
        "on-secondary-fixed-variant": "#004395",
        "on-surface": "#151c27",
        "surface-tint": "#4d44e3",
        "on-surface-variant": "#464555",
      },
      borderRadius: {
        DEFAULT: "0.25rem",
        lg: "0.5rem",
        xl: "0.75rem",
        full: "9999px",
      },
      spacing: {
        md: "16px",
        xs: "4px",
        lg: "24px",
        gutter: "20px",
        "container-max": "1200px",
        sm: "8px",
        base: "4px",
        xl: "40px",
      },
      fontFamily: {
        "mono-label": ["Inter"],
        "label-md": ["Inter"],
        "headline-lg": ["Inter"],
        "body-md": ["Inter"],
        "headline-lg-mobile": ["Inter"],
        "display-lg": ["Inter"],
        "body-sm": ["Inter"],
        "body-lg": ["Inter"],
        "headline-md": ["Inter"],
      },
      fontSize: {
        "mono-label": [
          "13px",
          {
            lineHeight: "16px",
            letterSpacing: "0.02em",
            fontWeight: "500",
          },
        ],
        "label-md": [
          "14px",
          {
            lineHeight: "20px",
            letterSpacing: "0.05em",
            fontWeight: "600",
          },
        ],
        "headline-lg": [
          "32px",
          {
            lineHeight: "40px",
            letterSpacing: "-0.01em",
            fontWeight: "600",
          },
        ],
        "body-md": ["16px", { lineHeight: "24px", fontWeight: "400" }],
        "headline-lg-mobile": [
          "24px",
          { lineHeight: "32px", fontWeight: "600" },
        ],
        "display-lg": [
          "48px",
          {
            lineHeight: "56px",
            letterSpacing: "-0.02em",
            fontWeight: "700",
          },
        ],
        "body-sm": ["14px", { lineHeight: "20px", fontWeight: "400" }],
        "body-lg": ["18px", { lineHeight: "28px", fontWeight: "400" }],
        "headline-md": ["24px", { lineHeight: "32px", fontWeight: "600" }],
      },
    },
  },
};

// Micro-interactions and effects
document.addEventListener("DOMContentLoaded", () => {
  const heroCards = document.querySelectorAll(".animate-bounce-slow");
  heroCards.forEach((card, index) => {
    card.style.animation = `bounce ${3 + index}s infinite ease-in-out`;
  });
});

// Keyframe for bounce if tailwind doesn't have it
const style = document.createElement("style");
style.innerHTML = `
            @keyframes bounce {
                0%, 100% { transform: translateY(0); }
                50% { transform: translateY(-10px); }
            }
            .animate-bounce-slow {
                animation: bounce 4s infinite ease-in-out;
            }
            @keyframes fade-in {
                from { opacity: 0; transform: translateY(20px); }
                to { opacity: 1; transform: translateY(0); }
            }
            .animate-fade-in {
                animation: fade-in 1s forwards;
            }
        `;
document.head.appendChild(style);

/* =========================================================================
 * BVStore — kho dữ liệu mô phỏng on-chain bằng localStorage
 * QUAN TRỌNG: khoá lưu trữ (BV_STORE_KEY), tên hàm (bvLoad/bvSave) và
 * BV_ADMIN_ADDRESS phải TRÙNG với các file JS phía Admin (đã sửa ở lượt
 * trước) thì mới nhận diện đúng vai trò. Nếu phía Admin dùng khoá khác,
 * hãy gửi lại 1 file JS admin bất kỳ để mình đồng bộ chính xác.
 * ========================================================================= */
const BV_STORE_KEY = "bv_voting_data";
const BV_ADMIN_ADDRESS = "0xa1b517e141F6d7BE60555dfaBCf27Fdc536C20AA";

// Đường dẫn trang đích sau khi xác định vai trò (tương đối từ pages/landing/home.html)
const BV_ADMIN_HOME_PATH = "../admin/admin-dashboard.html";
const BV_VOTER_HOME_PATH = "../voting/create-ballot.html";
const BV_CONNECT_WALLET_PATH = "../auth/connect-wallet.html";

function bvLoad() {
  try {
    const raw = localStorage.getItem(BV_STORE_KEY);
    if (!raw) {
      return { admin: { address: "", connected: false, isAdmin: false }, voters: [], candidates: [], election: {}, transactions: [] };
    }
    return JSON.parse(raw);
  } catch (e) {
    return { admin: { address: "", connected: false, isAdmin: false }, voters: [], candidates: [], election: {}, transactions: [] };
  }
}

function bvSave(data) {
  localStorage.setItem(BV_STORE_KEY, JSON.stringify(data));
}

function bvFindVoter(address, store) {
  const list = (store && store.voters) || [];
  return list.find(
    (v) => (v.address || "").toLowerCase() === address.toLowerCase(),
  );
}

function bvShortAddress(addr) {
  return addr.slice(0, 6) + "..." + addr.slice(-4);
}

/* ---------------------------- Toast thông báo --------------------------- */
let bvToastTimer = null;
function bvShowToast(message, type = "info") {
  const toast = document.getElementById("bv-toast");
  if (!toast) return;

  const styles = {
    info: "bg-surface-container-high text-on-surface border-outline-variant",
    error: "bg-error-container text-on-error-container border-error",
    success: "bg-emerald-50 text-emerald-700 border-emerald-200",
  };

  toast.className =
    "fixed bottom-6 right-6 z-[100] max-w-sm px-lg py-md rounded-xl shadow-lg font-body-sm text-body-sm border transition-all duration-300 " +
    (styles[type] || styles.info);
  toast.textContent = message;

  // force reflow then reveal
  requestAnimationFrame(() => {
    toast.classList.remove("opacity-0", "translate-y-2");
  });

  clearTimeout(bvToastTimer);
  bvToastTimer = setTimeout(() => {
    toast.classList.add("opacity-0", "translate-y-2");
  }, 4000);
}

/* ------------------------------ Kết nối ví ------------------------------ */
function bvSetConnectButtonsLoading(isLoading) {
  document.querySelectorAll(".bv-connect-btn").forEach((btn) => {
    btn.disabled = isLoading;
    const label = btn.querySelector(".bv-connect-btn-label");
    if (label) {
      label.dataset.originalText = label.dataset.originalText || label.textContent;
      label.textContent = isLoading ? "Đang kết nối..." : label.dataset.originalText;
    }
    btn.classList.toggle("opacity-70", isLoading);
  });
}

function bvUpdateNavBadge(address) {
  const badge = document.getElementById("nav-wallet-badge");
  const addrEl = document.getElementById("nav-address");
  if (!badge || !addrEl) return;
  addrEl.textContent = bvShortAddress(address);
  badge.classList.remove("hidden");
  badge.classList.add("flex");
}

// Quyết định vai trò của địa chỉ ví rồi điều hướng đúng giao diện
function bvRouteByAddress(address) {
  const store = bvLoad();

  if (address.toLowerCase() === BV_ADMIN_ADDRESS.toLowerCase()) {
    store.admin = { address, connected: true, isAdmin: true };
    bvSave(store);
    bvShowToast("Xác thực Quản trị viên thành công. Đang chuyển hướng...", "success");
    setTimeout(() => (window.location.href = BV_ADMIN_HOME_PATH), 800);
    return;
  }

  const voter = bvFindVoter(address, store);
  if (voter && voter.verified) {
    bvShowToast("Xác thực cử tri thành công. Đang chuyển hướng...", "success");
    setTimeout(() => (window.location.href = BV_VOTER_HOME_PATH), 800);
    return;
  }

  if (voter && !voter.verified) {
    bvShowToast(
      "Ví của bạn đã được đăng ký nhưng chưa được Admin xác thực. Vui lòng quay lại sau.",
      "error",
    );
    setTimeout(() => (window.location.href = BV_CONNECT_WALLET_PATH), 1200);
    return;
  }

  bvShowToast(
    "Địa chỉ ví này chưa được đăng ký làm cử tri. Vui lòng liên hệ Quản trị viên.",
    "error",
  );
  setTimeout(() => (window.location.href = BV_CONNECT_WALLET_PATH), 1200);
}

async function bvConnectAndRoute() {
  if (typeof window.ethereum === "undefined") {
    bvShowToast(
      "Không tìm thấy MetaMask. Vui lòng cài đặt tiện ích MetaMask cho trình duyệt.",
      "error",
    );
    return;
  }

  bvSetConnectButtonsLoading(true);
  try {
    const accounts = await window.ethereum.request({
      method: "eth_requestAccounts",
    });
    const address = accounts && accounts[0];
    if (!address) throw new Error("Không lấy được địa chỉ ví.");

    bvUpdateNavBadge(address);
    bvRouteByAddress(address);
  } catch (err) {
    if (err && err.code === 4001) {
      bvShowToast("Bạn đã từ chối kết nối ví.", "error");
    } else {
      bvShowToast("Kết nối ví thất bại: " + (err && err.message ? err.message : "Lỗi không xác định"), "error");
    }
  } finally {
    bvSetConnectButtonsLoading(false);
  }
}

document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll(".bv-connect-btn").forEach((btn) => {
    btn.addEventListener("click", bvConnectAndRoute);
  });

  // Nếu trình duyệt đã có phiên kết nối MetaMask sẵn (không cần popup), hiển thị badge
  if (typeof window.ethereum !== "undefined") {
    window.ethereum
      .request({ method: "eth_accounts" })
      .then((accounts) => {
        if (accounts && accounts[0]) {
          bvUpdateNavBadge(accounts[0]);
        }
      })
      .catch(() => {});

    window.ethereum.on &&
      window.ethereum.on("accountsChanged", (accounts) => {
        if (accounts && accounts[0]) {
          bvUpdateNavBadge(accounts[0]);
        } else {
          const badge = document.getElementById("nav-wallet-badge");
          if (badge) badge.classList.add("hidden");
        }
      });
  }
});
