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

// ====================== VOTE-SUCCESS.JS ======================
// Hiển thị Transaction Hash / Block Number THẬT của giao dịch vote() vừa
// được ký qua MetaMask (đã lưu tạm ở sessionStorage từ verify-ballot.js).
import { getReadContract } from "./blockchain.js";
import { shortAddr } from "./election-utils.js";

document.addEventListener("DOMContentLoaded", async () => {
  const votedCandidate = sessionStorage.getItem("lastVotedCandidate");
  const txHash = sessionStorage.getItem("lastVoteTxHash");
  const blockNumber = sessionStorage.getItem("lastVoteBlock");

  const candidateNameEl = document.getElementById("votedCandidateName");
  if (votedCandidate && candidateNameEl) {
    candidateNameEl.textContent = votedCandidate;
  }

  const txHashEl = document.getElementById("txHashValue");
  if (txHash && txHashEl) {
    txHashEl.textContent = txHash;
    txHashEl.title = txHash;
  }

  const blockEl = document.getElementById("txBlockValue");
  if (blockNumber && blockEl) {
    blockEl.textContent = "#" + Number(blockNumber).toLocaleString("vi-VN");
  }

  const timeEl = document.getElementById("txTimeValue");
  if (txHash && timeEl) {
    try {
      const contract = getReadContract();
      const provider = contract.provider ?? contract.runner?.provider;
      const receipt = await provider.getTransactionReceipt(txHash);
      if (receipt) {
        const block = await provider.getBlock(receipt.blockNumber);
        if (block) {
          timeEl.textContent = new Date(Number(block.timestamp) * 1000).toLocaleString("vi-VN");
        }
      }
    } catch (e) {
      /* giữ nguyên "Vừa xong" nếu không lấy được */
    }
  }

  // Sua loi: ban goc dung selector ":contains()" (chi co trong jQuery, khong hop le
  // trong document.querySelector()) nen doan copy hash truoc day chua bao gio chay duoc.
  const copyBtn = document.getElementById("copyHashBtn");
  const txHashElForCopy = document.getElementById("txHashValue");
  if (copyBtn && txHashElForCopy) {
    copyBtn.addEventListener("click", () => {
      const icon = copyBtn.querySelector(".material-symbols-outlined");
      navigator.clipboard.writeText(txHashElForCopy.textContent.trim()).then(() => {
        icon.textContent = "check";
        setTimeout(() => {
          icon.textContent = "content_copy";
        }, 2000);
      });
    });
  }

  if (window.ethereum) {
    try {
      const accounts = await window.ethereum.request({ method: "eth_accounts" });
      const headerAddr = document.querySelector("header .font-mono-label");
      if (accounts && accounts.length > 0 && headerAddr) {
        headerAddr.textContent = shortAddr(accounts[0]);
      }
    } catch (e) {
      /* ignore */
    }
  }
});

// Atmospheric Confetti Effect on Load
window.addEventListener("DOMContentLoaded", () => {
  const canvas = document.createElement("canvas");
  canvas.className = "confetti-canvas";
  document.body.appendChild(canvas);
  const ctx = canvas.getContext("2d");
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  const particles = [];
  for (let i = 0; i < 50; i++) {
    particles.push({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height - canvas.height,
      size: Math.random() * 5 + 2,
      color: ["#4F46E5", "#10B981", "#6366F1"][Math.floor(Math.random() * 3)],
      speed: Math.random() * 3 + 1,
      angle: Math.random() * 6,
    });
  }

  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach((p, i) => {
      p.y += p.speed;
      p.x += Math.sin(p.angle) * 0.5;
      ctx.fillStyle = p.color;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fill();
      if (p.y > canvas.height) particles[i].y = -20;
    });
    requestAnimationFrame(animate);
  }
  animate();

  setTimeout(() => {
    canvas.style.transition = "opacity 1s";
    canvas.style.opacity = "0";
    setTimeout(() => canvas.remove(), 1000);
  }, 3000);
});
