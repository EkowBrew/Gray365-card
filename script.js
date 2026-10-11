
/* =====================================================
   GRAY365 STUDIO — COMPLETE DIGITAL CARD JAVASCRIPT
   ===================================================== */

const GRAY365 = {
  name: "Gray365 Studio",
  organization: "Gray365 Studio",
  jobTitle: "Nail Technician & Nail Artist",

  phoneDisplay: "0555262368",
  phoneInternational: "+233555262368",

  website: "https://www.gray365studio.com/",
  whatsapp: "https://wa.me/233555262368",

  socials: {
    Instagram: "https://www.instagram.com/gray365.studio/",
    TikTok: "https://www.tiktok.com/@gray365.studio",
    Snapchat: "https://www.snapchat.com/add/gray365.studio"
  }
};


/* =====================================================
   TOAST NOTIFICATIONS
   ===================================================== */

const toast = document.getElementById("toast");
let toastTimer;

function showToast(message) {
  if (!toast) {
    alert(message);
    return;
  }

  toast.textContent = message;
  toast.classList.add("show");

  clearTimeout(toastTimer);

  toastTimer = setTimeout(() => {
    toast.classList.remove("show");
  }, 3500);
}


/* =====================================================
   SOCIAL MEDIA LINKS
   ===================================================== */

document.querySelectorAll("[data-placeholder]").forEach(link => {
  const platform = link.dataset.placeholder;
  const profileURL = GRAY365.socials[platform];

  if (profileURL) {
    link.href = profileURL;
    link.target = "_blank";
    link.rel = "noopener noreferrer";
  } else {
    link.href = "#";

    link.addEventListener("click", event => {
      event.preventDefault();
      showToast(`${platform} profile link is not configured.`);
    });
  }
});


/* =====================================================
   SHARE DIGITAL CARD
   ===================================================== */

const shareButton = document.getElementById("shareBtn");

if (shareButton) {
  shareButton.addEventListener("click", async () => {
    const shareData = {
      title: GRAY365.name,
      text:
        "Gray365 Studio — Nail Technician & Nail Artist. " +
        "Contact us to book your nail appointment.",
      url: window.location.href
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (error) {
        if (error.name !== "AbortError") {
          showToast("Unable to share. Copy the card link from your browser.");
        }
      }
    } else {
      try {
        await navigator.clipboard.writeText(window.location.href);
        showToast("Digital card link copied successfully.");
      } catch (error) {
        showToast("Copy the digital card address from your browser.");
      }
    }
  });
}


/* =====================================================
   VCARD CONTACT GENERATOR
   ===================================================== */

function escapeVCard(value) {
  return String(value || "")
    .replace(/\\/g, "\\\\")
    .replace(/\r?\n/g, "\\n")
    .replace(/,/g, "\\,")
    .replace(/;/g, "\\;");
}

function createGray365VCard() {
  const lines = [
    "BEGIN:VCARD",
    "VERSION:3.0",

    `FN:${escapeVCard(GRAY365.name)}`,
    `ORG:${escapeVCard(GRAY365.organization)}`,
    `TITLE:${escapeVCard(GRAY365.jobTitle)}`,

    `TEL;TYPE=CELL,VOICE:${GRAY365.phoneInternational}`,

    `URL:${GRAY365.website}`,
    `URL;TYPE=WhatsApp:${GRAY365.whatsapp}`,

    `X-SOCIALPROFILE;TYPE=instagram:${GRAY365.socials.Instagram}`,
    `X-SOCIALPROFILE;TYPE=tiktok:${GRAY365.socials.TikTok}`,
    `X-SOCIALPROFILE;TYPE=snapchat:${GRAY365.socials.Snapchat}`,

    "NOTE:Nail artistry, beauty and detail",

    "END:VCARD"
  ];

  return lines.join("\r\n") + "\r\n";
}


/* =====================================================
   SAVE CONTACT
   ===================================================== */

const saveContactButton = document.getElementById("saveContactBtn");

if (saveContactButton) {
  saveContactButton.addEventListener("click", () => {
    try {
      const vcardContent = createGray365VCard();

      const contactBlob = new Blob(
        [vcardContent],
        { type: "text/vcard;charset=utf-8" }
      );

      const fileURL = URL.createObjectURL(contactBlob);
      const downloadLink = document.createElement("a");

      downloadLink.href = fileURL;
      downloadLink.download = "Gray365-Studio.vcf";
      downloadLink.style.display = "none";

      document.body.appendChild(downloadLink);
      downloadLink.click();
      downloadLink.remove();

      // Allow the browser time to begin processing the file.
      setTimeout(() => {
        URL.revokeObjectURL(fileURL);
      }, 60000);

      showToast(
        "Gray365 contact card prepared. Open the downloaded file and choose Add to Contacts."
      );
    } catch (error) {
      console.error("Unable to create contact card:", error);

      showToast(
        "Sorry, the contact card could not be created. Please try again."
      );
    }
  });
}


/* =====================================================
   OPTIONAL: UPDATE WHATSAPP BOOKING LINKS
   ===================================================== */

document.querySelectorAll('a[href*="wa.me"]').forEach(link => {
  // Use the configured studio WhatsApp number for booking links.
  const existingURL = new URL(link.href);

  if (existingURL.hostname === "wa.me") {
    existingURL.pathname = "/233555262368";
    link.href = existingURL.toString();
  }
});


/* =====================================================
   END OF GRAY365 STUDIO JAVASCRIPT
   ===================================================== */
