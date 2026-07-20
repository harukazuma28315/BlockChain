
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
              "headline-md": [
                "24px",
                { lineHeight: "32px", fontWeight: "600" },
              ],
            },
          },
        },
      };
    


      // Simple micro-interaction for the winner card
      document.addEventListener("DOMContentLoaded", () => {
        const winnerCard = document.querySelector(".winner-gradient");
        if (winnerCard) {
          winnerCard.addEventListener("mousemove", (e) => {
            const rect = winnerCard.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            winnerCard.style.setProperty("--mouse-x", `${x}px`);
            winnerCard.style.setProperty("--mouse-y", `${y}px`);
          });
        }
      });

      // Simulating some animation on page load
      window.addEventListener("load", () => {
        const progressBars = document.querySelectorAll(
          ".bg-primary, .bg-secondary, .bg-primary-container",
        );
        progressBars.forEach((bar) => {
          const targetWidth = bar.style.width;
          bar.style.width = "0%";
          setTimeout(() => {
            bar.style.transition = "width 1.5s cubic-bezier(0.22, 1, 0.36, 1)";
            bar.style.width = targetWidth;
          }, 300);
        });
      });
    